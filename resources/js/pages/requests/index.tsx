import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AssistanceRequest, PaginatedData, SharedProps } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    Inbox,
    Send,
    CheckCircle2,
    XCircle,
    Clock,
    Building2,
    Calendar,
    ArrowRight,
    AlertCircle,
    User,
    Check,
    X,
} from 'lucide-react';

interface RequestsIndexProps {
    receivedRequests: PaginatedData<AssistanceRequest>;
    sentRequests: PaginatedData<AssistanceRequest>;
    tab: 'received' | 'sent';
}

export default function RequestsIndex({
    receivedRequests,
    sentRequests,
    tab: initialTab = 'received',
}: RequestsIndexProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const [activeTab, setActiveTab] = useState<'received' | 'sent'>(initialTab);
    const [rejectModalOpen, setRejectModalOpen] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleAccept = (id: number) => {
        router.post(`/requests/${id}/accept`);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rejectModalOpen) {
            router.post(`/requests/${rejectModalOpen}/reject`, { reason: rejectReason }, {
                onSuccess: () => {
                    setRejectModalOpen(null);
                    setRejectReason('');
                },
            });
        }
    };

    const handleComplete = (id: number) => {
        router.post(`/requests/${id}/complete`);
    };

    const handleCancel = (id: number) => {
        if (confirm('Are you sure you want to cancel this assistance request?')) {
            router.post(`/requests/${id}/cancel`);
        }
    };

    const activeList = activeTab === 'received' ? receivedRequests.data : sentRequests.data;

    return (
        <AppLayout title="Assistance Requests & Coordination">
            <Head title="Assistance Requests - BloodLink" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Title & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Inbox className="w-6 h-6 text-rose-600" />
                            Blood Assistance Requests
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Coordinate blood assistance transactions, review incoming calls from patients, and track your sent requests.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-200/80 dark:bg-zinc-800 p-1 rounded-2xl w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveTab('received')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'received'
                                    ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                            }`}
                        >
                            <Inbox className="w-4 h-4" />
                            Incoming Requests ({receivedRequests.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('sent')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'sent'
                                    ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                            }`}
                        >
                            <Send className="w-4 h-4" />
                            My Sent Requests ({sentRequests.total})
                        </button>
                    </div>
                </div>

                {/* Requests List */}
                {activeList.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-4">
                        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                            <Inbox className="w-8 h-8" />
                        </div>
                        <div className="max-w-md mx-auto space-y-1">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                {activeTab === 'received'
                                    ? 'No incoming requests yet'
                                    : 'You have not submitted any assistance requests'}
                            </h3>
                            <p className="text-xs text-zinc-500">
                                {activeTab === 'received'
                                    ? 'Ensure your blood card is marked as "Available" so nearby patients can find you.'
                                    : 'Need blood for yourself or a loved one? Search verified donors near your hospital.'}
                            </p>
                        </div>
                        <div className="pt-2">
                            {activeTab === 'received' ? (
                                <Link
                                    href="/my-blood-card"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition"
                                >
                                    Check Blood Card Status
                                </Link>
                            ) : (
                                <Link
                                    href="/donors"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition"
                                >
                                    Search Nearby Donors
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeList.map((req) => {
                            const isIncoming = activeTab === 'received';
                            const otherParty = isIncoming ? req.requester : req.donor;

                            return (
                                <div
                                    key={req.id}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <BloodTypeBadge bloodType={req.blood_type_needed} size="md" />
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                                                        {req.units_needed} Unit(s) needed at {req.hospital_name}
                                                    </h3>
                                                    <StatusBadge status={req.status} />
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {isIncoming ? 'Requested by' : 'Donor contact'}:{' '}
                                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                        {otherParty?.name}
                                                    </span>{' '}
                                                    • Needed date: {req.needed_date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                req.urgency === 'critical'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                                    : req.urgency === 'urgent'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                            }`}>
                                                {req.urgency} Urgency
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message preview */}
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-2xl leading-relaxed">
                                        "{req.message}"
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="text-[11px] text-zinc-400">
                                            Submitted on {new Date(req.created_at).toLocaleString()}
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Incoming Actions */}
                                            {isIncoming && req.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAccept(req.id)}
                                                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                                                    >
                                                        <Check className="w-3.5 h-3.5" /> Accept Request
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRejectModalOpen(req.id)}
                                                        className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Decline
                                                    </button>
                                                </>
                                            )}

                                            {/* Completion Action */}
                                            {req.status === 'accepted' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleComplete(req.id)}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                                                </button>
                                            )}

                                            {/* Cancel Action */}
                                            {!isIncoming && req.status === 'pending' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(req.id)}
                                                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                >
                                                    Cancel Request
                                                </button>
                                            )}

                                            <Link
                                                href={`/requests/${req.id}`}
                                                className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1"
                                            >
                                                Details <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Decline Reason Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Reason for Declining Request
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
                                    Explanation (sent to patient) *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. Currently unavailable due to travel, recent donation resting period, etc."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(null)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition"
                                >
                                    Confirm Decline
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
