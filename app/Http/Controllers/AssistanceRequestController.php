<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRequest;
use App\Models\DonorCard;
use App\Models\InAppNotification;
use App\Models\RequestStatusHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssistanceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $receivedRequests = AssistanceRequest::with(['requester.province', 'requester.city', 'donorCard'])
            ->where('donor_user_id', $user->id)
            ->latest()
            ->paginate(10, ['*'], 'received_page');

        $sentRequests = AssistanceRequest::with(['donor.province', 'donor.city', 'donorCard'])
            ->where('requester_id', $user->id)
            ->latest()
            ->paginate(10, ['*'], 'sent_page');

        return Inertia::render('requests/index', [
            'receivedRequests' => $receivedRequests,
            'sentRequests' => $sentRequests,
            'tab' => $request->query('tab', 'received'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'donor_user_id' => ['required', 'exists:users,id', 'different:' . $user->id],
            'donor_card_id' => ['required', 'exists:donor_cards,id'],
            'blood_type_needed' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'units_needed' => ['required', 'integer', 'min:1', 'max:10'],
            'urgency' => ['required', 'string', 'in:critical,urgent,standard'],
            'needed_date' => ['required', 'date', 'after_or_equal:today'],
            'hospital_name' => ['required', 'string', 'max:255'],
            'hospital_address' => ['nullable', 'string', 'max:500'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $assistanceRequest = AssistanceRequest::create([
            'requester_id' => $user->id,
            'donor_user_id' => $validated['donor_user_id'],
            'donor_card_id' => $validated['donor_card_id'],
            'blood_type_needed' => $validated['blood_type_needed'],
            'units_needed' => $validated['units_needed'],
            'urgency' => $validated['urgency'],
            'needed_date' => $validated['needed_date'],
            'hospital_name' => $validated['hospital_name'],
            'hospital_address' => $validated['hospital_address'] ?? null,
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        // Record history
        RequestStatusHistory::create([
            'assistance_request_id' => $assistanceRequest->id,
            'status' => 'pending',
            'notes' => 'Request submitted by ' . $user->name,
            'changed_by_user_id' => $user->id,
        ]);

        // Notify donor
        InAppNotification::create([
            'user_id' => $validated['donor_user_id'],
            'title' => 'New Blood Assistance Request',
            'message' => "{$user->name} has requested blood assistance for {$validated['units_needed']} unit(s) of Type {$validated['blood_type_needed']} at {$validated['hospital_name']}.",
            'type' => 'request',
            'link' => "/requests/{$assistanceRequest->id}",
        ]);

        return redirect()->route('requests.show', $assistanceRequest->id)
            ->with('success', 'Your blood assistance request has been sent to the donor for coordination.');
    }

    public function show(Request $request, $id): Response
    {
        $user = $request->user();

        $assistanceRequest = AssistanceRequest::with([
            'requester.province',
            'requester.city',
            'requester.barangay',
            'donor.province',
            'donor.city',
            'donor.barangay',
            'donorCard',
            'statusHistories.changedBy',
        ])->findOrFail($id);

        // Security check: only requester, donor, or admin can view
        if ($assistanceRequest->requester_id !== $user->id && $assistanceRequest->donor_user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Unauthorized access to this assistance request.');
        }

        return Inertia::render('requests/show', [
            'requestItem' => $assistanceRequest,
        ]);
    }

    public function accept(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $assistanceRequest = AssistanceRequest::findOrFail($id);

        if ($assistanceRequest->donor_user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Only the designated donor can accept this request.');
        }

        if ($assistanceRequest->status !== 'pending') {
            return back()->with('error', 'This request is no longer in pending status.');
        }

        $assistanceRequest->status = 'accepted';
        $assistanceRequest->accepted_at = now();
        $assistanceRequest->save();

        RequestStatusHistory::create([
            'assistance_request_id' => $assistanceRequest->id,
            'status' => 'accepted',
            'notes' => 'Coordination accepted by donor ' . $user->name,
            'changed_by_user_id' => $user->id,
        ]);

        InAppNotification::create([
            'user_id' => $assistanceRequest->requester_id,
            'title' => 'Request Accepted! Coordination In Progress',
            'message' => "Donor {$user->name} has accepted your request. Please proceed to coordinate verification with the hospital.",
            'type' => 'success',
            'link' => "/requests/{$assistanceRequest->id}",
        ]);

        return back()->with('success', 'Request accepted! You may now coordinate with the requester.');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $assistanceRequest = AssistanceRequest::findOrFail($id);

        if ($assistanceRequest->donor_user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Only the designated donor can reject this request.');
        }

        $reason = $request->input('reason', 'Donor is currently unable to assist.');

        $assistanceRequest->status = 'rejected';
        $assistanceRequest->rejection_reason = $reason;
        $assistanceRequest->save();

        RequestStatusHistory::create([
            'assistance_request_id' => $assistanceRequest->id,
            'status' => 'rejected',
            'notes' => 'Rejected: ' . $reason,
            'changed_by_user_id' => $user->id,
        ]);

        InAppNotification::create([
            'user_id' => $assistanceRequest->requester_id,
            'title' => 'Assistance Request Declined',
            'message' => "The donor was unable to accept your request at this time: {$reason}",
            'type' => 'warning',
            'link' => "/requests/{$assistanceRequest->id}",
        ]);

        return back()->with('info', 'You have declined this assistance request.');
    }

    public function cancel(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $assistanceRequest = AssistanceRequest::findOrFail($id);

        if ($assistanceRequest->requester_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Only the requester can cancel this request.');
        }

        $assistanceRequest->status = 'cancelled';
        $assistanceRequest->cancelled_at = now();
        $assistanceRequest->save();

        RequestStatusHistory::create([
            'assistance_request_id' => $assistanceRequest->id,
            'status' => 'cancelled',
            'notes' => 'Cancelled by requester',
            'changed_by_user_id' => $user->id,
        ]);

        InAppNotification::create([
            'user_id' => $assistanceRequest->donor_user_id,
            'title' => 'Assistance Request Cancelled',
            'message' => "Requester {$user->name} has cancelled their blood assistance request.",
            'type' => 'info',
            'link' => "/requests/{$assistanceRequest->id}",
        ]);

        return back()->with('info', 'Assistance request has been cancelled.');
    }

    public function complete(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $assistanceRequest = AssistanceRequest::findOrFail($id);

        if ($assistanceRequest->requester_id !== $user->id && $assistanceRequest->donor_user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $assistanceRequest->status = 'completed';
        $assistanceRequest->completed_at = now();
        $assistanceRequest->save();

        // Increment donor donations count
        $donorCard = DonorCard::where('user_id', $assistanceRequest->donor_user_id)->first();
        if ($donorCard) {
            $donorCard->increment('total_donations_count');
            $donorCard->last_donation_date = now()->toDateString();
            $donorCard->save();
        }

        RequestStatusHistory::create([
            'assistance_request_id' => $assistanceRequest->id,
            'status' => 'completed',
            'notes' => 'Marked as completed by ' . $user->name,
            'changed_by_user_id' => $user->id,
        ]);

        $notifyUserId = $user->id === $assistanceRequest->requester_id ? $assistanceRequest->donor_user_id : $assistanceRequest->requester_id;
        InAppNotification::create([
            'user_id' => $notifyUserId,
            'title' => 'Assistance Completed!',
            'message' => "Blood assistance coordination for {$assistanceRequest->hospital_name} has been marked as completed. Thank you for saving lives!",
            'type' => 'success',
            'link' => "/requests/{$assistanceRequest->id}",
        ]);

        return back()->with('success', 'Coordination successfully marked as completed! Thank you for helping save lives.');
    }
}
