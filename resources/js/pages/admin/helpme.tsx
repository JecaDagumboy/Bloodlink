import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { HelpmePost, PaginatedData } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    Flame,
    Check,
    X,
    Building2,
    Calendar,
    ArrowLeft,
    AlertCircle,
    Eye,
} from 'lucide-react';

interface AdminHelpmeProps {
    posts: PaginatedData<HelpmePost>;
}

export default function AdminHelpme({ posts }: AdminHelpmeProps) {
    const [rejectModalOpen, setRejectModalOpen] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = (id: number) => {
        router.post(`/admin/helpme/${id}/approve`);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rejectModalOpen) {
            router.post(`/admin/helpme/${rejectModalOpen}/reject`, { reason: rejectReason }, {
                onSuccess: () => {
                    setRejectModalOpen(null);
                    setRejectReason('');
                },
            });
        }
    };

    return (
        <AppLayout title="HelpMe Moderation">
            <Head title="HelpMe Moderation - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Flame className="w-6 h-6 text-red-600" />
                            HelpMe Emergency Moderation
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Review emergency blood requests for compliance with anti-fraud and hospital protocol guidelines.
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
                                    <th className="p-4">Blood & Urgency</th>
                                    <th className="p-4">Title & Hospital</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <BloodTypeBadge bloodType={post.blood_type_needed} size="sm" />
                                                <span className="font-extrabold uppercase text-[10px] text-zinc-500">
                                                    {post.urgency}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-sm">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                                {post.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                                                {post.hospital_name} • Needed: {post.needed_date}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                {post.user?.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={post.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/helpme/${post.id}`}
                                                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700"
                                                    title="Inspect"
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
                                                        className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold text-[11px]"
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
                                Reject Emergency Post
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
                                    Reason for Rejection *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain why this post does not meet guidelines..."
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
