import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { CommunityCategory, CommunityPost, PaginatedData, SharedProps } from '@/types/bloodlink';
import {
    FileText,
    Heart,
    MessageCircle,
    Plus,
    Share2,
    Sparkles,
    BookOpen,
    HelpCircle,
    Award,
    Image,
    Send,
} from 'lucide-react';

interface PostsIndexProps {
    posts: PaginatedData<CommunityPost>;
    selectedCategory: string;
}

export default function PostsIndex({ posts, selectedCategory }: PostsIndexProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: 'story' as CommunityCategory,
        content: '',
        image: null as File | null,
    });

    const handleCategoryFilter = (cat: string) => {
        router.get('/posts', { category: cat }, { preserveState: true, replace: true });
    };

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        post('/posts', {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleLike = (id: number) => {
        router.post(`/posts/${id}/like`, {}, { preserveScroll: true });
    };

    const categories = [
        { id: 'all', label: 'All Stories' },
        { id: 'story', label: 'Donor & Patient Stories' },
        { id: 'tip', label: 'Donation Tips' },
        { id: 'question', label: 'Q&A' },
        { id: 'advocacy', label: 'Blood Advocacy' },
    ];

    return (
        <AppLayout title="Community Stories & Advice">
            <Head title="Community Posts - BloodLink" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <FileText className="w-6 h-6 text-rose-600" />
                            BloodLink Community
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Share inspiring donation stories, recovery journeys, first-time donor tips, and ask health coordination questions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" /> Share a Story
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryFilter(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedCategory === cat.id
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Posts Feed */}
                {posts.data.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-4">
                        <FileText className="w-10 h-10 text-zinc-300 mx-auto" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            No community stories in this category yet
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Be the first to share an inspiring blood donation journey or tip!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.data.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-sm flex items-center justify-center">
                                            {item.user?.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {item.user?.name}
                                            </h4>
                                            <p className="text-[11px] text-zinc-400">
                                                {new Date(item.created_at).toLocaleDateString()} • In{' '}
                                                <span className="capitalize font-semibold text-rose-600">
                                                    {item.category}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Link href={`/posts/${item.id}`} className="block group">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 transition">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                                        {item.content}
                                    </p>
                                </div>

                                {item.image_path && (
                                    <div className="rounded-2xl overflow-hidden max-h-72 border border-zinc-100 dark:border-zinc-800">
                                        <img
                                            src={item.image_path}
                                            alt={item.title}
                                            className="w-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleLike(item.id)}
                                            className={`flex items-center gap-1.5 font-semibold transition ${
                                                item.is_liked
                                                    ? 'text-rose-600'
                                                    : 'text-zinc-500 hover:text-rose-600'
                                            }`}
                                        >
                                            <Heart className={`w-4 h-4 ${item.is_liked ? 'fill-rose-600 text-rose-600' : ''}`} />
                                            <span>{item.likes_count}</span>
                                        </button>

                                        <Link
                                            href={`/posts/${item.id}`}
                                            className="flex items-center gap-1.5 font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{item.comments_count} Comments</span>
                                        </Link>
                                    </div>

                                    <Link
                                        href={`/posts/${item.id}`}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-700"
                                    >
                                        Read Story →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Share Community Story or Advice
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Story Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. My First Blood Donation Experience at Red Cross Manila"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value as any)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="story">Donor & Patient Story</option>
                                    <option value="tip">Donation Tips & Prep</option>
                                    <option value="question">Question & Assistance Advice</option>
                                    <option value="advocacy">Blood Donation Advocacy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Content / Your Story *
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Share your thoughts, experiences, encouragement for other donors, or questions..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('image', e.target.files[0]);
                                        }
                                    }}
                                    className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Publishing...' : 'Publish Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
