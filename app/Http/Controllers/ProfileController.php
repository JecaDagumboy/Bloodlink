<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRequest;
use App\Models\HelpmePost;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request, ?int $id = null): Response
    {
        $currentUser = $request->user();
        $targetUserId = $id ?? $currentUser->id;

        $profileUser = User::with(['province', 'city', 'barangay', 'donorCard', 'settings'])
            ->findOrFail($targetUserId);

        $isOwnProfile = $currentUser->id === $profileUser->id;

        // Privacy check
        if (! $isOwnProfile && $profileUser->settings && $profileUser->settings->profile_visibility === 'hidden') {
            abort(404, 'This profile is private.');
        }

        // Stats
        $donationsCount = $profileUser->donorCard?->total_donations_count ?? 0;
        $helpmeCount = HelpmePost::where('user_id', $profileUser->id)->count();
        $assistanceGivenCount = AssistanceRequest::where('donor_user_id', $profileUser->id)
            ->where('status', 'completed')
            ->count();

        return Inertia::render('profile/show', [
            'profileUser' => $profileUser,
            'isOwnProfile' => $isOwnProfile,
            'stats' => [
                'donations_count' => $donationsCount,
                'helpme_count' => $helpmeCount,
                'assistance_given_count' => $assistanceGivenCount,
            ],
        ]);
    }
}

