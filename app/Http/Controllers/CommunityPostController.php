<?php

namespace App\Http\Controllers;

use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityPostController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = CommunityPost::with(['user'])
            ->where(function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->orWhere('user_id', $user->id);
            });

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $posts = $query->latest()->paginate(10)->through(function ($post) use ($user) {
            $post->is_liked = CommunityPostLike::where('community_post_id', $post->id)
                ->where('user_id', $user->id)
                ->exists();
            return $post;
        })->withQueryString();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'selectedCategory' => $request->category ?? 'all',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:story,tip,question,advocacy'],
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('community_images', 'public');
            $imagePath = '/storage/' . $path;
        }

        $post = CommunityPost::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'content' => $validated['content'],
            'image_path' => $imagePath,
            'status' => 'approved', // Auto-approved for lively community engagement
            'approved_at' => now(),
            'approved_by' => $user->id,
        ]);

        return redirect()->route('posts.show', $post->id)->with('success', 'Your community story was published successfully!');
    }

    public function show(Request $request, $id): Response
    {
        $user = $request->user();

        $post = CommunityPost::with(['user', 'comments.user'])->findOrFail($id);
        $post->is_liked = CommunityPostLike::where('community_post_id', $post->id)
            ->where('user_id', $user->id)
            ->exists();

        return Inertia::render('posts/show', [
            'post' => $post,
        ]);
    }

    public function storeComment(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $post = CommunityPost::findOrFail($id);

        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        CommunityComment::create([
            'community_post_id' => $post->id,
            'user_id' => $user->id,
            'comment' => $validated['comment'],
        ]);

        $post->increment('comments_count');

        return back()->with('success', 'Comment posted.');
    }

    public function toggleLike(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $post = CommunityPost::findOrFail($id);

        $existing = CommunityPostLike::where('community_post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $post->decrement('likes_count');
        } else {
            CommunityPostLike::create([
                'community_post_id' => $post->id,
                'user_id' => $user->id,
            ]);
            $post->increment('likes_count');
        }

        return back();
    }
}

