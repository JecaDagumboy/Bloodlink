<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->loadMissing(['donorCard', 'settings', 'province', 'city', 'barangay']);
        }

        return [
            ...parent::share($request),
            'name' => 'BloodLink',
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth?->format('Y-m-d'),
                    'gender' => $user->gender,
                    'blood_type' => $user->blood_type,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'bio' => $user->bio,
                    'address' => $user->address,
                    'location_string' => $user->location_string,
                    'latitude' => $user->latitude,
                    'longitude' => $user->longitude,
                    'province_id' => $user->province_id,
                    'city_id' => $user->city_id,
                    'barangay_id' => $user->barangay_id,
                    'province_name' => $user->province?->name,
                    'city_name' => $user->city?->name,
                    'barangay_name' => $user->barangay?->name,
                    'donor_card' => $user->donorCard,
                    'settings' => $user->settings,
                    'is_admin' => $user->isAdmin(),
                    'unread_notifications_count' => $user->unreadNotificationsCount(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}

