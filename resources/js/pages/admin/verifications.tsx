import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { DonorCard, PaginatedData } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    CheckCircle2,
    XCircle,
    FileText,
    ArrowLeft,
    Check,
    X,
    ExternalLink,
    Shield,
} from 'lucide-react';

interface AdminVerificationsProps {
    donorCards: PaginatedData<DonorCard>;
    currentFilter: string;
}

export default function AdminVerifications({ donorCards, currentFilter }: AdminVerificationsProps) {
    const [rejectModalOpen, setRejectModalOpen] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleFilter = (status: string) => {
        router.get('/admin/verifications', { status }, { preserveState: true, replace: true });
    };

    const handleApprove = (id: number) => {
        if (confirm('Approve and verify this donor card?')) {
            router.post(`/admin/verifications/${id}/approve`);
        }
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rejectModalOpen) {
            router.post(`/admin/verifications/${rejectModalOpen}/reject`, { reason: rejectReason }, {
                onSuccess: () => {
                    setRejectModalOpen(null);
                    setRejectReason('');
                },
            });
        }
    };

    return (
        <AppLayout title="Donor Card Verification Queue">
            <Head title="Donor Verifications - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <CheckCircle2 className="w-6 h-6 text-purple-600" />
                            Donor Card & Blood Verification Queue
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Review submitted Philippine Red Cross cards, blood donation certificates, and donor credentials.
                        </p>
                    </div>

                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    {['pending', 'verified', 'rejected', 'all'].map((st) => (
                        <button
                            key={st}
                            type="button"
                            onClick={() => handleFilter(st)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                                currentFilter === st
                                    ? 'bg-purple-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                            }`}
                        >
                            {st} ({st === currentFilter ? donorCards.total : ''})
                        </button>
                    ))}
                </div>

                {/* Verification Cards */}
                {donorCards.data.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-zinc-300 mx-auto" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            No donor cards in "{currentFilter}" status
                        </h3>
                        <p className="text-xs text-zinc-500">
                            All pending verification submissions have been reviewed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donorCards.data.map((card) => (
                            <div
                                key={card.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <BloodTypeBadge bloodType={card.blood_type} size="md" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                                                    {card.user?.name}
                                                </h3>
                                                <StatusBadge status={card.verification_status} />
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {card.user?.email} • {card.user?.phone || 'No phone'} •{' '}
                                                {card.user?.location_string || 'Philippines'}
                                            </p>
                                        </div>
                                    </div>

                                    {card.verification_status === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(card.id)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Approve & Verify
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRejectModalOpen(card.id)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                                            >
                                                <X className="w-3.5 h-3.5" /> Decline
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                                    <div>
                                        <span className="text-zinc-400 block font-semibold text-[10px] uppercase">
                                            Submitted Card Number
                                        </span>
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                            {card.donor_card_number || 'None provided'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400 block font-semibold text-[10px] uppercase">
                                            Total Donations Claimed
                                        </span>
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                            {card.total_donations_count} times
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400 block font-semibold text-[10px] uppercase">
                                            Proof Document
                                        </span>
                                        {card.id_document_path ? (
                                            <a
                                                href={card.id_document_path}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-bold text-purple-600 hover:underline flex items-center gap-1"
                                            >
                                                View Attached Proof <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-zinc-400 italic">No document uploaded</span>
                                        )}
                                    </div>
                                </div>

                                {card.notes && (
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                                        Notes: "{card.notes}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Decline Verification Request
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
                                    Rejection Reason (sent to donor) *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain why the proof could not be verified (e.g. illegible photo, expired card)..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500"
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
                                    Decline Verification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
