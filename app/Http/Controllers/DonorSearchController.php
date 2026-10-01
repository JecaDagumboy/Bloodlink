<?php

namespace App\Http\Controllers;

use App\Models\DonorCard;
use App\Models\Province;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonorSearchController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userLat = $user->latitude ?? 14.6091;
        $userLng = $user->longitude ?? 121.0223;

        $query = DonorCard::query()
            ->with(['user.province', 'user.city', 'user.barangay', 'user.settings'])
            ->join('users', 'donor_cards.user_id', '=', 'users.id')
            ->where('users.status', 'active')
            ->select('donor_cards.*', 'users.name', 'users.avatar', 'users.latitude', 'users.longitude')
            ->selectRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(users.latitude)) * cos(radians(users.longitude) - radians(?)) + sin(radians(?)) * sin(radians(users.latitude)))) AS distance_km',
                [$userLat, $userLng, $userLat]
            );

        // Filter by blood type
        if ($request->filled('blood_type') && $request->blood_type !== 'all') {
            $query->where('donor_cards.blood_type', $request->blood_type);
        }

        // Filter by availability
        if ($request->has('available_only') ? $request->boolean('available_only') : true) {
            $query->where('donor_cards.is_available', true);
        }

        // Filter by verification status
        if ($request->filled('verification_status') && $request->verification_status !== 'all') {
            $query->where('donor_cards.verification_status', $request->verification_status);
        }

        // Location filters
        if ($request->filled('province_id')) {
            $query->where('users.province_id', $request->province_id);
        }
        if ($request->filled('city_id')) {
            $query->where('users.city_id', $request->city_id);
        }
        if ($request->filled('barangay_id')) {
            $query->where('users.barangay_id', $request->barangay_id);
        }

        // Radius filter
        $radius = (int) $request->input('radius_km', 50);
        if ($radius > 0) {
            $query->having('distance_km', '<=', $radius);
        }

        $donors = $query->orderBy('distance_km', 'asc')->paginate(12)->withQueryString();
        $provinces = Province::orderBy('name')->get();

        return Inertia::render('donors/index', [
            'donors' => $donors,
            'provinces' => $provinces,
            'filters' => [
                'blood_type' => $request->blood_type ?? 'all',
                'province_id' => $request->province_id ?? '',
                'city_id' => $request->city_id ?? '',
                'barangay_id' => $request->barangay_id ?? '',
                'radius_km' => $radius,
                'available_only' => $request->has('available_only') ? $request->boolean('available_only') : true,
                'verification_status' => $request->verification_status ?? 'all',
            ],
        ]);
    }

    public function show(Request $request, $id): Response
    {
        $user = $request->user();
        $userLat = $user->latitude ?? 14.6091;
        $userLng = $user->longitude ?? 121.0223;

        // Can find by donor_cards.id or donor_cards.user_id
        $donor = DonorCard::with(['user.province', 'user.city', 'user.barangay', 'user.settings'])
            ->where('id', $id)
            ->orWhere('user_id', $id)
            ->firstOrFail();

        // Calculate distance
        $distance = null;
        if ($donor->user && $donor->user->latitude && $donor->user->longitude) {
            $lat1 = deg2rad($userLat);
            $lon1 = deg2rad($userLng);
            $lat2 = deg2rad($donor->user->latitude);
            $lon2 = deg2rad($donor->user->longitude);

            $dlat = $lat2 - $lat1;
            $dlon = $lon2 - $lon1;
            $a = sin($dlat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dlon / 2) ** 2;
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $distance = round(6371 * $c, 1);
        }

        return Inertia::render('donors/show', [
            'donor' => $donor,
            'distance_km' => $distance,
        ]);
    }
}
