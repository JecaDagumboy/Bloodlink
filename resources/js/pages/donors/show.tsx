import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { DonorCard, SharedProps } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import { ReportModal } from '@/components/bloodlink/ReportModal';
import {
    Heart,
    MapPin,
    Calendar,
    Phone,
    Mail,
    ShieldCheck,
    AlertTriangle,
    Clock,
    Send,
    Flag,
    Award,
    Sparkles,
    Building2,
    CheckCircle2,
    Info,
} from 'lucide-react';

interface DonorShowProps {
    donor: DonorCard;
    distance_km: number | null;
}

export default function DonorShow({ donor, distance_km }: DonorShowProps) {
    const { auth } = usePage<SharedProps>().props;
    const currentUser = auth.user;

    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const user = donor.user;
    const isSelf = currentUser?.id === user?.id;

    const { data, setData, post, processing, errors, reset } = useForm({
        donor_user_id: user?.id || 0,
        donor_card_id: donor.id,
        blood_type_needed: donor.blood_type,
        units_needed: 1,
        urgency: 'urgent',
        needed_date: new Date().toISOString().split('T')[0],
        hospital_name: '',
        hospital_address: '',
        message: '',
    });

    const handleSendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post('/requests', {
            onSuccess: () => {
                setRequestModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout title={`${user?.name} - BloodLink Donor Profile`}>
            <Head title={`${user?.name} (${donor.blood_type}) - Donor Profile`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href="/donors"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        ← Back to Find Donors
                    </Link>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/20 shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-2xl flex items-center justify-center border-2 border-rose-500/20 shadow-md">
                                    {user?.first_name ? user.first_name[0] : 'U'}
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                        {user?.name}
                                    </h1>
                                    <BloodTypeBadge bloodType={donor.blood_type} size="md" />
                                </div>

                                <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                        {user?.location_string || 'Philippines'}
                                    </span>
                                    {distance_km !== null && (
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                                            Approx. {distance_km} km away
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                    <StatusBadge status={donor.verification_status} />
                                    {donor.is_available ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available for Coordination
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Currently Unavailable
                                        </span>
                                    )}
                                    {donor.emergency_ready && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                            <Sparkles className="w-3.5 h-3.5" /> Emergency Ready
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {!isSelf && donor.is_available && (
                                <button
                                    type="button"
                                    onClick={() => setRequestModalOpen(true)}
                                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-md hover:bg-rose-700 transition flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Request Blood Assistance
                                </button>
                            )}

                            {!isSelf && (
                                <button
                                    type="button"
                                    onClick={() => setReportModalOpen(true)}
                                    className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-1.5"
                                >
                                    <Flag className="w-3.5 h-3.5 text-zinc-400" />
                                    Report
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Donor Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Donor Statistics */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                            Donor Statistics
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-rose-500" /> Total Donations
                                </span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {donor.total_donations_count} times
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" /> Last Donation
                                </span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {donor.last_donation_date || 'Not recorded'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-500" /> Willing Radius
                                </span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Up to {donor.search_radius_km} km
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-500" /> Preferred Contact
                                </span>
                                <span className="text-sm font-bold capitalize text-zinc-900 dark:text-zinc-100">
                                    {donor.preferred_contact_method}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact & Safety Policies */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Contact Information (respects privacy settings) */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                Contact & Coordination Channels
                            </h2>

                            <div className="space-y-3">
                                {user?.settings?.show_phone && user?.phone ? (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium">Direct Phone (Public by Donor Choice)</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {user.phone}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">Phone number kept private</p>
                                            <p className="text-[11px]">Coordination is conducted via BloodLink secure requests until mutual confirmation.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium">In-App Assistance Requests</p>
                                        <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                                            Use the "Request Blood Assistance" button above to initiate secure coordination.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Safety Notice */}
                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5 space-y-2">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                                Very Important Blood Coordination Policy
                            </div>
                            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                                A BloodLink donor card represents a willing donor's availability for coordination. It is <strong>NOT</strong> an identity document or transferable credit. Under Philippine law and hospital regulations, the actual donor must personally present themselves at the accredited blood bank/hospital for screening and cross-matching. Impersonation is strictly prohibited.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Assistance Modal */}
            {requestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Request Blood Assistance
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    Send request to {user?.name} (Type {donor.blood_type})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRequestModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSendRequest} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Blood Type Needed *
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={data.blood_type_needed}
                                        className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-rose-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Units Needed (Bags) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.units_needed}
                                        onChange={(e) => setData('units_needed', parseInt(e.target.value) || 1)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Urgency Level *
                                    </label>
                                    <select
                                        value={data.urgency}
                                        onChange={(e) => setData('urgency', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="critical">Critical (Immediate)</option>
                                        <option value="urgent">Urgent (Within 24h)</option>
                                        <option value="standard">Standard (Scheduled)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Needed By Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.needed_date}
                                        onChange={(e) => setData('needed_date', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Hospital / Medical Facility Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Philippine General Hospital, St. Luke's, Chong Hua"
                                    value={data.hospital_name}
                                    onChange={(e) => setData('hospital_name', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.hospital_name && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.hospital_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Hospital Address / Ward
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Ward 4B, Room 412, Ermita, Manila"
                                    value={data.hospital_address}
                                    onChange={(e) => setData('hospital_address', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Message & Patient Situation *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Briefly explain the patient's medical situation and any doctor instructions..."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.message && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.message}</p>
                                )}
                            </div>

                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-[11px] text-zinc-500 flex items-start gap-2">
                                <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                                <span>
                                    Sending this request notifies the donor. If accepted, you will receive real-time notification to coordinate hospital donation protocols.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setRequestModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Submit Assistance Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportableType="user"
                reportableId={user?.id || 0}
                targetTitle={`Donor: ${user?.name}`}
            />
        </AppLayout>
    );
}
