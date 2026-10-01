<?php

namespace App\Http\Controllers;

use App\Models\DonorCard;
use App\Models\Province;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showRegister(): Response
    {
        $provinces = Province::orderBy('name')->get();

        return Inertia::render('auth/register', [
            'provinces' => $provinces,
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'max:20'],
            'blood_type' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'province_id' => ['required', 'exists:provinces,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'barangay_id' => ['nullable', 'exists:barangays,id'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $name = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $user = User::create([
            'name' => $name,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => strtolower($validated['email']),
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'date_of_birth' => $validated['date_of_birth'],
            'gender' => $validated['gender'] ?? 'prefer_not_to_say',
            'blood_type' => $validated['blood_type'],
            'role' => 'user',
            'status' => 'active',
            'province_id' => $validated['province_id'],
            'city_id' => $validated['city_id'],
            'barangay_id' => $validated['barangay_id'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        // Create default user settings
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

        // Create initial donor card record
        DonorCard::create([
            'user_id' => $user->id,
            'blood_type' => $validated['blood_type'],
            'is_available' => false,
            'verification_status' => 'unverified',
            'search_radius_km' => 25,
            'preferred_contact_method' => 'app',
            'emergency_ready' => false,
            'total_donations_count' => 0,
        ]);

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Welcome to BloodLink Philippines! Your account has been registered successfully.');
    }
}

