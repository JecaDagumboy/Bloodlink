<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRequest;
use App\Models\BloodEvent;
use App\Models\City;
use App\Models\DonorCard;
use App\Models\HelpmePost;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing(['donorCard', 'province', 'city', 'barangay']);

        $userLat = $user->latitude ?? 14.6091; // Default to NCR center if not set
        $userLng = $user->longitude ?? 121.0223;

        // Automatically mark expired requests
        AssistanceRequest::where(function ($q) {
            $q->where('status', 'pending')->orWhere('status', 'accepted');
        })
        ->whereDate('needed_date', '<', Carbon::today())
        ->update(['status' => 'expired']);

        // Nearby available donors query with Haversine distance
        $nearbyDonors = DonorCard::query()
            ->with(['user.province', 'user.city', 'user.barangay'])
            ->where('is_available', true)
            ->where('user_id', '!=', $user->id)
            ->whereHas('user', function ($q) {
                $q->where('status', 'active');
            })
            ->join('users', 'donor_cards.user_id', '=', 'users.id')
            ->select('donor_cards.*', 'users.name', 'users.avatar', 'users.latitude', 'users.longitude')
            ->selectRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(users.latitude)) * cos(radians(users.longitude) - radians(?)) + sin(radians(?)) * sin(radians(users.latitude)))) AS distance_km',
                [$userLat, $userLng, $userLat]
            )
            ->orderBy('distance_km')
            ->take(6)
            ->get();

        $nearbyCount = DonorCard::query()
            ->where('is_available', true)
            ->where('user_id', '!=', $user->id)
            ->whereHas('user', fn ($q) => $q->where('status', 'active'))
            ->count();

        // Pending requests count for this user (both incoming and outgoing)
        $pendingRequestsCount = AssistanceRequest::where(function ($q) use ($user) {
            $q->where('requester_id', $user->id)
              ->orWhere('donor_user_id', $user->id);
        })
        ->where('status', 'pending')
        ->count();

        // Active HelpMe requests count
        $activeHelpmeCount = HelpmePost::where('status', 'approved')
            ->whereDate('needed_date', '>=', Carbon::today())
            ->count();

        // Upcoming blood events count
        $upcomingEventsCount = BloodEvent::where('status', 'approved')
            ->whereDate('event_date', '>=', Carbon::today())
            ->count();

        // User's recent requests (both sent & received)
        $recentRequests = AssistanceRequest::query()
            ->with(['requester', 'donor', 'donorCard'])
            ->where(function ($q) use ($user) {
                $q->where('requester_id', $user->id)
                  ->orWhere('donor_user_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        // Emergency HelpMe posts
        $emergencyHelpme = HelpmePost::query()
            ->with(['province', 'city', 'barangay', 'user'])
            ->where('status', 'approved')
            ->whereDate('needed_date', '>=', Carbon::today())
            ->orderByRaw("FIELD(urgency, 'critical', 'urgent', 'moderate')")
            ->latest()
            ->take(4)
            ->get();

        // Recent Blood Events
        $recentEvents = BloodEvent::query()
            ->with(['province', 'city', 'barangay'])
            ->where('status', 'approved')
            ->whereDate('event_date', '>=', Carbon::today())
            ->orderBy('event_date')
            ->take(3)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'blood_type' => $user->blood_type ?? 'Unspecified',
                'donor_card' => $user->donorCard,
                'is_available' => (bool) $user->donorCard?->is_available,
                'verification_status' => $user->donorCard?->verification_status ?? 'unverified',
                'nearby_donors_count' => $nearbyCount,
                'pending_requests_count' => $pendingRequestsCount,
                'helpme_requests_count' => $activeHelpmeCount,
                'upcoming_events_count' => $upcomingEventsCount,
            ],
            'nearbyDonors' => $nearbyDonors,
            'recentRequests' => $recentRequests,
            'emergencyHelpme' => $emergencyHelpme,
            'recentEvents' => $recentEvents,
            'userLocation' => [
                'latitude' => $userLat,
                'longitude' => $userLng,
                'address' => $user->location_string,
            ],
        ]);
    }
}

