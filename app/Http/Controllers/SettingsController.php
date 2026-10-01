<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\UserSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing(['settings', 'province', 'city', 'barangay', 'donorCard']);

        if (! $user->settings) {
            UserSetting::create([
                'user_id' => $user->id,
                'theme' => 'system',
                'show_phone' => false,
                'location_privacy' => 'approximate',
                'show_donor_availability' => true,
                'profile_visibility' => 'users_only',
                'notify_requests' => true,
                'notify_helpme' => true,
                'notify_events' => true,
                'notify_community' => true,
            ]);
            $user->load('settings');
        }

        $provinces = Province::orderBy('name')->get();

        return Inertia::render('settings/index', [
            'user' => $user,
            'provinces' => $provinces,
        ]);
    }

    public function updateAccount(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['required', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'max:20'],
            'blood_type' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'bio' => ['nullable', 'string', 'max:500'],
            'province_id' => ['nullable', 'exists:provinces,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'barangay_id' => ['nullable', 'exists:barangays,id'],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = '/storage/' . $path;
        }

        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $user->update($validated);

        // Synchronize blood type with donor card
        if ($user->donorCard) {
            $user->donorCard->update(['blood_type' => $validated['blood_type']]);
        }

        return back()->with('success', 'Profile and account details updated successfully.');
    }

    public function updateSecurity(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password changed successfully.');
    }

    public function updatePrivacy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'show_phone' => ['required', 'boolean'],
            'location_privacy' => ['required', 'string', 'in:exact,approximate,barangay,city,hidden'],
            'show_donor_availability' => ['required', 'boolean'],
            'profile_visibility' => ['required', 'string', 'in:public,users_only,hidden'],
        ]);

        $settings = $user->settings ?? new UserSetting(['user_id' => $user->id]);
        $settings->fill($validated);
        $settings->save();

        return back()->with('success', 'Privacy preferences updated successfully.');
    }

    public function updateAppearance(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'theme' => ['required', 'string', 'in:light,dark,system'],
        ]);

        $settings = $user->settings ?? new UserSetting(['user_id' => $user->id]);
        $settings->theme = $validated['theme'];
        $settings->save();

        return back()->with('success', 'Appearance theme updated.');
    }

    public function updateNotifications(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'notify_requests' => ['required', 'boolean'],
            'notify_helpme' => ['required', 'boolean'],
            'notify_events' => ['required', 'boolean'],
            'notify_community' => ['required', 'boolean'],
        ]);

        $settings = $user->settings ?? new UserSetting(['user_id' => $user->id]);
        $settings->fill($validated);
        $settings->save();

        return back()->with('success', 'Notification preferences saved.');
    }

    public function deleteAccount(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('info', 'Your account has been permanently deleted.');
    }
}

