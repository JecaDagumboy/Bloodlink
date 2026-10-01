<?php

namespace App\Http\Controllers;

use App\Models\ContentReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'reportable_type' => ['required', 'string', 'in:user,helpme_post,community_post,blood_event'],
            'reportable_id' => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:100'],
            'details' => ['nullable', 'string', 'max:1000'],
        ]);

        ContentReport::create([
            'reporter_id' => $user->id,
            'reportable_type' => $validated['reportable_type'],
            'reportable_id' => $validated['reportable_id'],
            'reason' => $validated['reason'],
            'details' => $validated['details'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Report submitted successfully. Our safety moderation team will review this shortly.');
    }
}

