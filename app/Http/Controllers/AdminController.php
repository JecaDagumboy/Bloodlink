<?php

namespace App\Http\Controllers;

use App\Models\AdminAuditLog;
use App\Models\AssistanceRequest;
use App\Models\BloodEvent;
use App\Models\CommunityPost;
use App\Models\ContentReport;
use App\Models\DonorCard;
use App\Models\HelpmePost;
use App\Models\InAppNotification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    private function logAction(Request $request, string $action, string $targetType, ?int $targetId, string $description): void
    {
        AdminAuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'description' => $description,
            'ip_address' => $request->ip(),
        ]);
    }

    public function dashboard(): Response
    {
        $metrics = [
            'total_users' => User::count(),
            'active_donors' => DonorCard::where('is_available', true)->count(),
            'pending_verifications' => DonorCard::where('verification_status', 'pending')->count(),
            'open_requests' => AssistanceRequest::whereIn('status', ['pending', 'accepted'])->count(),
            'urgent_helpme' => HelpmePost::where('status', 'approved')->whereIn('urgency', ['critical', 'urgent'])->count(),
            'upcoming_events' => BloodEvent::where('status', 'approved')->whereDate('event_date', '>=', now())->count(),
            'unresolved_reports' => ContentReport::where('status', 'pending')->count(),
        ];

        $recentAudits = AdminAuditLog::with('admin')->latest()->take(8)->get();
        $recentReports = ContentReport::with('reporter')->latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics,
            'recentAudits' => $recentAudits,
            'recentReports' => $recentReports,
        ]);
    }

    public function users(Request $request): Response
    {
        $query = User::with(['province', 'city', 'donorCard']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    public function toggleUserStatus(Request $request, $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot suspend your own admin account.');
        }

        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->status = $newStatus;
        $user->save();

        $this->logAction($request, 'toggle_user_status', 'user', $user->id, "Changed user {$user->name} status to {$newStatus}");

        return back()->with('success', "User account has been {$newStatus}.");
    }

    public function verifications(Request $request): Response
    {
        $query = DonorCard::with(['user.province', 'user.city']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('verification_status', $request->status);
        } else {
            $query->where('verification_status', 'pending');
        }

        $donorCards = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/verifications', [
            'donorCards' => $donorCards,
            'currentFilter' => $request->status ?? 'pending',
        ]);
    }

    public function approveVerification(Request $request, $id): RedirectResponse
    {
        $card = DonorCard::with('user')->findOrFail($id);
        $card->verification_status = 'verified';
        $card->verified_at = now();
        $card->verified_by = $request->user()->id;
        $card->rejection_reason = null;
        $card->save();

        InAppNotification::create([
            'user_id' => $card->user_id,
            'title' => 'Donor Card Verified! ✅',
            'message' => 'Congratulations! Your BloodLink donor/blood card has been officially verified by administrators.',
            'type' => 'success',
            'link' => '/my-blood-card',
        ]);

        $this->logAction($request, 'approve_verification', 'donor_card', $card->id, "Approved donor card verification for {$card->user?->name}");

        return back()->with('success', "Donor card for {$card->user?->name} marked as Verified.");
    }

    public function rejectVerification(Request $request, $id): RedirectResponse
    {
        $card = DonorCard::with('user')->findOrFail($id);
        $reason = $request->input('reason', 'Provided documents or information could not be verified.');

        $card->verification_status = 'rejected';
        $card->rejection_reason = $reason;
        $card->save();

        InAppNotification::create([
            'user_id' => $card->user_id,
            'title' => 'Verification Update',
            'message' => "Your donor card verification request was declined: {$reason}",
            'type' => 'warning',
            'link' => '/my-blood-card',
        ]);

        $this->logAction($request, 'reject_verification', 'donor_card', $card->id, "Rejected donor card for {$card->user?->name}: {$reason}");

        return back()->with('info', "Donor verification declined.");
    }

    public function helpmeModeration(Request $request): Response
    {
        $posts = HelpmePost::with(['user', 'province', 'city'])
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/helpme', [
            'posts' => $posts,
        ]);
    }

    public function approveHelpme(Request $request, $id): RedirectResponse
    {
        $post = HelpmePost::findOrFail($id);
        $post->status = 'approved';
        $post->approved_at = now();
        $post->approved_by = $request->user()->id;
        $post->save();

        $this->logAction($request, 'approve_helpme', 'helpme_post', $post->id, "Approved HelpMe post '{$post->title}'");

        return back()->with('success', 'HelpMe emergency post approved.');
    }

    public function rejectHelpme(Request $request, $id): RedirectResponse
    {
        $post = HelpmePost::findOrFail($id);
        $post->status = 'rejected';
        $post->rejection_reason = $request->input('reason', 'Post does not meet community guidelines.');
        $post->save();

        $this->logAction($request, 'reject_helpme', 'helpme_post', $post->id, "Rejected HelpMe post '{$post->title}'");

        return back()->with('info', 'HelpMe post rejected.');
    }

    public function communityModeration(Request $request): Response
    {
        $posts = CommunityPost::with(['user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/community', [
            'posts' => $posts,
        ]);
    }

    public function approveCommunity(Request $request, $id): RedirectResponse
    {
        $post = CommunityPost::findOrFail($id);
        $post->status = 'approved';
        $post->approved_at = now();
        $post->approved_by = $request->user()->id;
        $post->save();

        $this->logAction($request, 'approve_community', 'community_post', $post->id, "Approved community post '{$post->title}'");

        return back()->with('success', 'Community post approved.');
    }

    public function rejectCommunity(Request $request, $id): RedirectResponse
    {
        $post = CommunityPost::findOrFail($id);
        $post->status = 'rejected';
        $post->rejection_reason = $request->input('reason', 'Post does not meet guidelines.');
        $post->save();

        $this->logAction($request, 'reject_community', 'community_post', $post->id, "Rejected community post '{$post->title}'");

        return back()->with('info', 'Community post rejected.');
    }

    public function eventsModeration(Request $request): Response
    {
        $events = BloodEvent::with(['user', 'province', 'city'])
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/events', [
            'events' => $events,
        ]);
    }

    public function approveEvent(Request $request, $id): RedirectResponse
    {
        $event = BloodEvent::findOrFail($id);
        $event->status = 'approved';
        $event->approved_at = now();
        $event->approved_by = $request->user()->id;
        $event->save();

        $this->logAction($request, 'approve_event', 'blood_event', $event->id, "Approved blood event '{$event->title}'");

        return back()->with('success', 'Blood donation event approved.');
    }

    public function rejectEvent(Request $request, $id): RedirectResponse
    {
        $event = BloodEvent::findOrFail($id);
        $event->status = 'rejected';
        $event->rejection_reason = $request->input('reason', 'Event does not meet criteria.');
        $event->save();

        $this->logAction($request, 'reject_event', 'blood_event', $event->id, "Rejected blood event '{$event->title}'");

        return back()->with('info', 'Blood event rejected.');
    }

    public function requestsOverview(Request $request): Response
    {
        $requests = AssistanceRequest::with(['requester', 'donor', 'donorCard'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/requests', [
            'requests' => $requests,
        ]);
    }

    public function reports(Request $request): Response
    {
        $reports = ContentReport::with(['reporter'])
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/reports', [
            'reports' => $reports,
        ]);
    }

    public function resolveReport(Request $request, $id): RedirectResponse
    {
        $report = ContentReport::findOrFail($id);
        $action = $request->input('action', 'resolved'); // resolved or dismissed

        $report->status = $action;
        $report->admin_notes = $request->input('notes');
        $report->reviewed_by = $request->user()->id;
        $report->reviewed_at = now();
        $report->save();

        $this->logAction($request, 'resolve_report', 'content_report', $report->id, "Marked report #{$report->id} as {$action}");

        return back()->with('success', "Report marked as {$action}.");
    }

    public function auditLogs(Request $request): Response
    {
        $logs = AdminAuditLog::with(['admin'])
            ->latest()
            ->paginate(25);

        return Inertia::render('admin/audit-logs', [
            'logs' => $logs,
        ]);
    }
}

