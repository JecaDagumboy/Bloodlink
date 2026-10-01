<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRequest;
use App\Models\DonorCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BloodCardController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing(['province', 'city', 'barangay', 'donorCard']);

        $donorCard = $user->donorCard;
        if (! $donorCard) {
            $donorCard = DonorCard::create([
                'user_id' => $user->id,
                'blood_type' => $user->blood_type ?? 'O+',
                'is_available' => true,
                'verification_status' => 'unverified',
                'search_radius_km' => 25,
                'preferred_contact_method' => 'app',
                'emergency_ready' => false,
                'total_donations_count' => 0,
            ]);
        }

        // Assistance/donation coordination history
        $recentCoordination = AssistanceRequest::with(['requester'])
            ->where('donor_user_id', $user->id)
            ->whereIn('status', ['accepted', 'completed'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('blood-card/index', [
            'donorCard' => $donorCard,
            'recentCoordination' => $recentCoordination,
        ]);
    }

    public function toggleAvailability(Request $request): RedirectResponse
    {
        $user = $request->user();
        $donorCard = $user->donorCard;

        if (! $donorCard) {
            return back()->with('error', 'Donor card not found.');
        }

        $donorCard->is_available = ! $donorCard->is_available;
        $donorCard->save();

        $statusText = $donorCard->is_available ? 'Available for Coordination' : 'Unavailable';

        return back()->with('success', "Your donor availability is now {$statusText}.");
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $donorCard = $user->donorCard;

        if (! $donorCard) {
            return back()->with('error', 'Donor card not found.');
        }

        $validated = $request->validate([
            'search_radius_km' => ['required', 'integer', 'min:1', 'max:500'],
            'preferred_contact_method' => ['required', 'string', 'in:app,phone,email,both'],
            'emergency_ready' => ['required', 'boolean'],
            'last_donation_date' => ['nullable', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $donorCard->update($validated);

        return back()->with('success', 'Your blood card preferences have been updated successfully.');
    }

    public function requestVerification(Request $request): RedirectResponse
    {
        $user = $request->user();
        $donorCard = $user->donorCard;

        if (! $donorCard) {
            return back()->with('error', 'Donor card not found.');
        }

        $request->validate([
            'donor_card_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
            'id_document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        if ($request->hasFile('id_document')) {
            $path = $request->file('id_document')->store('verification_docs', 'public');
            $donorCard->id_document_path = '/storage/' . $path;
        }

        if ($request->filled('donor_card_number')) {
            $donorCard->donor_card_number = $request->donor_card_number;
        }

        if ($request->filled('notes')) {
            $donorCard->notes = $request->notes;
        }

        $donorCard->verification_status = 'pending';
        $donorCard->rejection_reason = null;
        $donorCard->save();

        return back()->with('success', 'Verification request submitted! BloodLink administrators will review your verified donor status.');
    }
}
