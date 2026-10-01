import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AssistanceRequest, SharedProps } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    Inbox,
    Building2,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    MapPin,
    ArrowLeft,
    Check,
    X,
    FileText,
    Shield,
    Phone,
} from 'lucide-react';

interface RequestShowProps {
    requestItem: AssistanceRequest;
}

export default function RequestShow({ requestItem }: RequestShowProps) {
    const { auth } = usePage<SharedProps>().props;
    const currentUser = auth.user;

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const isRequester = currentUser?.id === requestItem.requester_id;
    const isDonor = currentUser?.id === requestItem.donor_user_id;

    const handleAccept = () => {
        router.post(`/requests/${requestItem.id}/accept`);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/requests/${requestItem.id}/reject`, { reason: rejectReason }, {
            onSuccess: () => setRejectModalOpen(false),
        });
    };

    const handleComplete = () => {
        if (confirm('Mark this blood assistance coordination as completed? This will update the donor donation records.')) {
            router.post(`/requests/${requestItem.id}/complete`);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this request?')) {
            router.post(`/requests/${requestItem.id}/cancel`);
        }
    };

    return (
        <AppLayout title={`Request #${requestItem.id} - Coordination Details`}>
            <Head title={`Assistance Request #${requestItem.id} - BloodLink`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <Link
                        href="/requests"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Requests
                    </Link>
                </div>

                {/* Request Header Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <BloodTypeBadge bloodType={requestItem.blood_type_needed} size="lg" />
                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                        {requestItem.units_needed} Unit(s) of Blood Requested
                                    </h1>
                                    <StatusBadge status={requestItem.status} />
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Request ID: #{requestItem.id.toString().padStart(6, '0')} • Submitted on{' '}
                                    {new Date(requestItem.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Urgency Badge */}
                        <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            requestItem.urgency === 'critical'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : requestItem.urgency === 'urgent'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                            {requestItem.urgency} Urgency
                        </span>
                    </div>

                    {/* Hospital & Clinical Target */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-rose-500" /> Target Hospital
                            </span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {requestItem.hospital_name}
                            </p>
                            {requestItem.hospital_address && (
                                <p className="text-xs text-zinc-500">
                                    {requestItem.hospital_address}
                                </p>
                            )}
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Needed Date
                            </span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {requestItem.needed_date}
                            </p>
                            <p className="text-xs text-zinc-500">
                                Please coordinate with the hospital blood bank schedule.
                            </p>
                        </div>
                    </div>

                    {/* Patient Message */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Message & Medical Notes
                        </h2>
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {requestItem.message}
                        </div>
                    </div>

                    {/* Parties In Coordination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Requester */}
                        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Patient / Requester
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold flex items-center justify-center">
                                    {requestItem.requester?.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {requestItem.requester?.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        📍 {requestItem.requester?.location_string || 'Philippines'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Donor */}
                        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Available Donor
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold flex items-center justify-center">
                                    {requestItem.donor?.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {requestItem.donor?.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        Type {requestItem.donorCard?.blood_type} • {requestItem.donor?.location_string || 'Philippines'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="text-xs text-zinc-500">
                            {requestItem.status === 'accepted' && (
                                <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> Coordination in Progress. Please proceed to the hospital blood bank.
                                </span>
                            )}
                            {requestItem.status === 'completed' && (
                                <span className="font-semibold text-purple-600 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> This blood coordination transaction is completed.
                                </span>
                            )}
                            {requestItem.status === 'rejected' && (
                                <span className="font-semibold text-red-600 flex items-center gap-1.5">
                                    <XCircle className="w-4 h-4" /> Declined: {requestItem.rejection_reason || 'Donor unavailable'}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {isDonor && requestItem.status === 'pending' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleAccept}
                                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition flex items-center gap-1.5"
                                    >
                                        <Check className="w-4 h-4" /> Accept Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRejectModalOpen(true)}
                                        className="px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                                    >
                                        <X className="w-4 h-4" /> Decline
                                    </button>
                                </>
                            )}

                            {requestItem.status === 'accepted' && (isDonor || isRequester) && (
                                <button
                                    type="button"
                                    onClick={handleComplete}
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white hover:bg-purple-700 shadow-md transition flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                                </button>
                            )}

                            {isRequester && requestItem.status === 'pending' && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                >
                                    Cancel Request
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Timeline History */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Coordination Timeline & Audit Trail
                    </h3>

                    <div className="space-y-3 relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 ml-2">
                        {requestItem.status_histories && requestItem.status_histories.length > 0 ? (
                            requestItem.status_histories.map((hist) => (
                                <div key={hist.id} className="relative pb-2">
                                    <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900" />
                                    <div className="text-xs">
                                        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                                            <span className="capitalize">{hist.status}</span>
                                            <span className="font-normal text-zinc-400">
                                                • {new Date(hist.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {hist.notes && (
                                            <p className="text-zinc-500 mt-0.5">{hist.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-zinc-500">
                                Request initiated on {new Date(requestItem.created_at).toLocaleString()}.
                            </div>
                        )}
                    </div>
                </div>

                {/* Medical Safety Disclaimer */}
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 leading-relaxed flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                        <strong>Hospital Processing Requirement:</strong> BloodLink request approval is an agreement to coordinate blood assistance. Blood release and transfusion is strictly contingent upon compatibility testing, infectious disease screening, and formal release by accredited medical professionals.
                    </div>
                </div>
            </div>

            {/* Decline Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Decline Assistance Request
                            </h3>
                            <button
                                type="button"
                                onClick={() => setRejectModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Reason for Declining *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain why you cannot assist at this time..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
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
