<?php

namespace App\Http\Controllers;

use App\Models\BloodEvent;
use App\Models\CommunityPost;
use App\Models\DonorCard;
use App\Models\HelpmePost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GlobalSearchController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim($request->input('q', ''));

        $donors = [];
        $helpmePosts = [];
        $events = [];
        $communityPosts = [];

        if ($q !== '') {
            $donors = DonorCard::with(['user.province', 'user.city'])
                ->where('is_available', true)
                ->where(function ($query) use ($q) {
                    $query->where('blood_type', 'like', "%{$q}%")
                        ->orWhereHas('user', function ($uq) use ($q) {
                            $uq->where('name', 'like', "%{$q}%")
                                ->orWhere('address', 'like', "%{$q}%");
                        });
                })
                ->take(6)
                ->get();

            $helpmePosts = HelpmePost::with(['user', 'province', 'city'])
                ->where('status', 'approved')
                ->where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('blood_type_needed', 'like', "%{$q}%")
                        ->orWhere('hospital_name', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%");
                })
                ->take(6)
                ->get();

            $events = BloodEvent::with(['user', 'province', 'city'])
                ->where('status', 'approved')
                ->where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('venue', 'like', "%{$q}%")
                        ->orWhere('organizer', 'like', "%{$q}%");
                })
                ->take(6)
                ->get();

            $communityPosts = CommunityPost::with(['user'])
                ->where('status', 'approved')
                ->where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('content', 'like', "%{$q}%")
                        ->orWhere('category', 'like', "%{$q}%");
                })
                ->take(6)
                ->get();
        }

        return Inertia::render('search/index', [
            'searchQuery' => $q,
            'donors' => $donors,
            'helpmePosts' => $helpmePosts,
            'events' => $events,
            'communityPosts' => $communityPosts,
        ]);
    }
}
