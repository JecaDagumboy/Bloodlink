import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { ContentReport, PaginatedData } from '@/types/bloodlink';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';

interface AdminReportsProps {
    reports: PaginatedData<ContentReport>;
}

export default function AdminReports({ reports }: AdminReportsProps) {
    const [resolveModalOpen, setResolveModalOpen] = useState<number | null>(null);
    const [actionType, setActionType] = useState<'resolved' | 'dismissed'>('resolved');
    const [adminNotes, setAdminNotes] = useState('');

    const handleResolveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (resolveModalOpen) {
            router.post(`/admin/reports/${resolveModalOpen}/resolve`, {
                action: actionType,
                notes: adminNotes,
            }, {
                onSuccess: () => {
                    setResolveModalOpen(null);
                    setAdminNotes('');
                },
            });
        }
    };

    return (
        <AppLayout title="Content Reports Moderation">
            <Head title="Content Reports - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            Content Reports & Safety Flags
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Investigate reports of fraud, false medical claims, impersonation, or abusive behavior.
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
                                    <th className="p-4">Reported Target</th>
                                    <th className="p-4">Reason & Details</th>
                                    <th className="p-4">Reporter</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {reports.data.map((rep) => (
                                    <tr key={rep.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4">
                                            <span className="capitalize font-bold text-zinc-800 dark:text-zinc-200">
                                                {rep.reportable_type.replace('_', ' ')} #{rep.reportable_id}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-sm">
                                            <p className="font-bold text-red-600 capitalize">
                                                {rep.reason.replace('_', ' ')}
                                            </p>
                                            {rep.details && (
                                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                                    "{rep.details}"
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                                            {rep.reporter?.name}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                rep.status === 'resolved'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                    : rep.status === 'dismissed'
                                                    ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                            }`}>
                                                {rep.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {rep.status === 'pending' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setResolveModalOpen(rep.id)}
                                                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 transition"
                                                >
                                                    Resolve / Dismiss
                                                </button>
                                            ) : (
                                                <span className="text-[11px] text-zinc-400 italic">
                                                    Reviewed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Resolve Modal */}
            {resolveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Resolve Content Report #{resolveModalOpen}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setResolveModalOpen(null)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleResolveSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Resolution Outcome *
                                </label>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value as any)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="resolved">Resolved (Action taken / Content reviewed)</option>
                                    <option value="dismissed">Dismissed (No violation found)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Admin Notes & Justification
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Notes on the action taken..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setResolveModalOpen(null)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition"
                                >
                                    Save Resolution
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
