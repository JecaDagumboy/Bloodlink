<?php

namespace App\Http\Controllers;

use App\Models\BloodEvent;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BloodEventController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = BloodEvent::with(['user', 'province', 'city', 'barangay'])
            ->where(function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->orWhere('user_id', $user->id);
            });

        if ($request->filled('event_type') && $request->event_type !== 'all') {
            $query->where('event_type', $request->event_type);
        }

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        if ($request->boolean('upcoming_only', true)) {
            $query->whereDate('event_date', '>=', now()->toDateString());
        }

        $events = $query->orderBy('event_date', 'asc')->paginate(9)->withQueryString();
        $provinces = Province::orderBy('name')->get();

        return Inertia::render('events/index', [
            'events' => $events,
            'provinces' => $provinces,
            'filters' => [
                'event_type' => $request->event_type ?? 'all',
                'province_id' => $request->province_id ?? '',
                'upcoming_only' => $request->boolean('upcoming_only', true),
            ],
        ]);
    }

    public function create(): Response
    {
        $provinces = Province::orderBy('name')->get();

        return Inertia::render('events/create', [
            'provinces' => $provinces,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'organizer' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string', 'in:blood_drive,hospital_drive,advocacy,official_announcement'],
            'description' => ['required', 'string', 'max:3000'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['nullable', 'string', 'max:20'],
            'end_time' => ['nullable', 'string', 'max:20'],
            'venue' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'exists:provinces,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'barangay_id' => ['nullable', 'exists:barangays,id'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'registration_link' => ['nullable', 'url', 'max:255'],
            'banner' => ['nullable', 'image', 'max:4096'],
        ]);

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('event_banners', 'public');
            $bannerPath = '/storage/' . $path;
        }

        $event = BloodEvent::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'organizer' => $validated['organizer'],
            'event_type' => $validated['event_type'],
            'description' => $validated['description'],
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'venue' => $validated['venue'],
            'province_id' => $validated['province_id'],
            'city_id' => $validated['city_id'],
            'barangay_id' => $validated['barangay_id'] ?? null,
            'contact_person' => $validated['contact_person'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'contact_email' => $validated['contact_email'] ?? null,
            'registration_link' => $validated['registration_link'] ?? null,
            'banner_path' => $bannerPath,
            'status' => 'approved', // Auto-approved for active drives
            'is_official' => $user->isAdmin(),
            'approved_at' => now(),
            'approved_by' => $user->id,
        ]);

        return redirect()->route('events.show', $event->id)->with('success', 'Blood donation event created successfully!');
    }

    public function show(Request $request, $id): Response
    {
        $event = BloodEvent::with(['user', 'province', 'city', 'barangay'])->findOrFail($id);

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }
}

