import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { CommunityPost, PaginatedData } from '@/types/bloodlink';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    FileText,
    ArrowLeft,
    Check,
    X,
    Eye,
    MessageCircle,
    Heart,
} from 'lucide-react';

interface AdminCommunityProps {
    posts: PaginatedData<CommunityPost>;
}

export default function AdminCommunity({ posts }: AdminCommunityProps) {
    const [rejectModalOpen, setRejectModalOpen] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = (id: number) => {
        router.post(`/admin/community/${id}/approve`);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rejectModalOpen) {
            router.post(`/admin/community/${rejectModalOpen}/reject`, { reason: rejectReason }, {
                onSuccess: () => {
                    setRejectModalOpen(null);
                    setRejectReason('');
                },
            });
        }
    };

    return (
        <AppLayout title="Community Posts Moderation">
            <Head title="Community Moderation - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <FileText className="w-6 h-6 text-purple-600" />
                            Community Posts & Stories Moderation
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Ensure member stories, donor advice, and community questions comply with safety rules.
                        </p>
                    </div>

                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Title & Content Preview</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4">Engagement</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4">
                                            <span className="capitalize font-bold text-rose-600 text-xs">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-sm">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                                {post.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                                                {post.content}
                                            </p>
                                        </td>
                                        <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                                            {post.user?.name}
                                        </td>
                                        <td className="p-4 text-zinc-500 text-[11px]">
                                            {post.likes_count} likes • {post.comments_count} comments
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={post.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/posts/${post.id}`}
                                                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700"
                                                    title="View"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Link>
                                                {post.status !== 'approved' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(post.id)}
                                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {post.status !== 'rejected' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setRejectModalOpen(post.id)}
                                                        className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px]"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Reject Community Story
                            </h3>
                            <button
                                type="button"
                                onClick={() => setRejectModalOpen(null)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Reason *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain violation..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(null)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition"
                                >
                                    Reject Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
