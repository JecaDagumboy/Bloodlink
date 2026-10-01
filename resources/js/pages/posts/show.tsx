import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { CommunityPost, SharedProps } from '@/types/bloodlink';
import { ReportModal } from '@/components/bloodlink/ReportModal';
import {
    FileText,
    Heart,
    MessageCircle,
    ArrowLeft,
    Send,
    Flag,
    Calendar,
    User,
} from 'lucide-react';

interface PostShowProps {
    post: CommunityPost;
}

export default function PostShow({ post }: PostShowProps) {
    const { auth } = usePage<SharedProps>().props;
    const currentUser = auth.user;

    const [reportModalOpen, setReportModalOpen] = useState(false);

    const { data, setData, post: postComment, processing, errors, reset } = useForm({
        comment: '',
    });

    const handleLike = () => {
        router.post(`/posts/${post.id}/like`, {}, { preserveScroll: true });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/posts/${post.id}/comment`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout title={`${post.title} - BloodLink Community`}>
            <Head title={`${post.title} - BloodLink`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Community Stories
                    </Link>
                </div>

                {/* Main Post Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-base flex items-center justify-center">
                                {post.user?.name[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {post.user?.name}
                                </h4>
                                <p className="text-xs text-zinc-400">
                                    Posted on {new Date(post.created_at).toLocaleDateString()} • In{' '}
                                    <span className="capitalize font-bold text-rose-600">{post.category}</span>
                                </p>
                            </div>
                        </div>

                        {currentUser?.id !== post.user_id && (
                            <button
                                type="button"
                                onClick={() => setReportModalOpen(true)}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition flex items-center gap-1.5"
                            >
                                <Flag className="w-3.5 h-3.5" /> Report
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                            {post.title}
                        </h1>

                        <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                            {post.content}
                        </div>

                        {post.image_path && (
                            <div className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 max-h-96">
                                <img
                                    src={post.image_path}
                                    alt={post.title}
                                    className="w-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Likes & Comments Counter */}
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                                post.is_liked
                                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-rose-600 text-rose-600' : ''}`} />
                            <span>{post.likes_count} Likes</span>
                        </button>

                        <div className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0} Comments</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        Discussion ({post.comments?.length || 0})
                    </h3>

                    {/* New Comment Input */}
                    <form onSubmit={handleCommentSubmit} className="space-y-3">
                        <textarea
                            rows={3}
                            placeholder="Write a supportive comment or reply..."
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-rose-500"
                            required
                        />
                        {errors.comment && <p className="text-xs text-rose-500">{errors.comment}</p>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {processing ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 pt-2">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c) => (
                                <div key={c.id} className="py-4 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 font-bold flex items-center justify-center text-[10px]">
                                                {c.user?.name[0]}
                                            </div>
                                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                {c.user?.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 pl-9 leading-relaxed">
                                        {c.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-zinc-400 text-center py-6">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportableType="community_post"
                reportableId={post.id}
                targetTitle={post.title}
            />
        </AppLayout>
    );
}
