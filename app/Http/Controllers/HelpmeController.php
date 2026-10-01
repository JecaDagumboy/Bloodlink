<?php

namespace App\Http\Controllers;

use App\Models\HelpmePost;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HelpmeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = HelpmePost::with(['user', 'province', 'city', 'barangay'])
            ->where(function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->orWhere('user_id', $user->id); // Can view own posts even if pending
            });

        if ($request->filled('blood_type') && $request->blood_type !== 'all') {
            $query->where('blood_type_needed', $request->blood_type);
        }

        if ($request->filled('urgency') && $request->urgency !== 'all') {
            $query->where('urgency', $request->urgency);
        }

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $posts = $query->orderByRaw("FIELD(urgency, 'critical', 'urgent', 'moderate')")
            ->latest()
            ->paginate(9)
            ->withQueryString();

        $provinces = Province::orderBy('name')->get();

        return Inertia::render('helpme/index', [
            'posts' => $posts,
            'provinces' => $provinces,
            'filters' => [
                'blood_type' => $request->blood_type ?? 'all',
                'urgency' => $request->urgency ?? 'all',
                'province_id' => $request->province_id ?? '',
                'city_id' => $request->city_id ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        $provinces = Province::orderBy('name')->get();

        return Inertia::render('helpme/create', [
            'provinces' => $provinces,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'blood_type_needed' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'units_needed' => ['required', 'integer', 'min:1', 'max:20'],
            'urgency' => ['required', 'string', 'in:critical,urgent,moderate'],
            'needed_date' => ['required', 'date', 'after_or_equal:today'],
            'hospital_name' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'exists:provinces,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'barangay_id' => ['nullable', 'exists:barangays,id'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'description' => ['required', 'string', 'max:3000'],
            'photo' => ['nullable', 'image', 'max:4096'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('helpme_photos', 'public');
            $photoPath = '/storage/' . $path;
        }

        // Admins posts are immediately approved; user posts default to approved or pending
        $status = $user->isAdmin() ? 'approved' : 'approved'; // Set to approved so users immediately see their emergency posts

        $post = HelpmePost::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'blood_type_needed' => $validated['blood_type_needed'],
            'units_needed' => $validated['units_needed'],
            'urgency' => $validated['urgency'],
            'needed_date' => $validated['needed_date'],
            'hospital_name' => $validated['hospital_name'],
            'province_id' => $validated['province_id'],
            'city_id' => $validated['city_id'],
            'barangay_id' => $validated['barangay_id'] ?? null,
            'location_name' => $validated['location_name'] ?? null,
            'contact_number' => $validated['contact_number'],
            'contact_email' => $validated['contact_email'] ?? null,
            'description' => $validated['description'],
            'photo_path' => $photoPath,
            'status' => $status,
            'approved_at' => $status === 'approved' ? now() : null,
            'approved_by' => $status === 'approved' ? $user->id : null,
        ]);

        return redirect()->route('helpme.show', $post->id)
            ->with('success', 'Emergency HelpMe post published successfully!');
    }

    public function show(Request $request, $id): Response
    {
        $post = HelpmePost::with(['user', 'province', 'city', 'barangay'])->findOrFail($id);

        return Inertia::render('helpme/show', [
            'post' => $post,
        ]);
    }
}
