import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AssistanceRequest, DonorCard, SharedProps } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    CreditCard,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
    RefreshCw,
    MapPin,
    Calendar,
    Phone,
    Sliders,
    Upload,
    HeartHandshake,
    Sparkles,
    FileCheck,
    Info,
    AlertTriangle,
} from 'lucide-react';

interface BloodCardIndexProps {
    donorCard: DonorCard;
    recentCoordination: AssistanceRequest[];
}

export default function BloodCardIndex({ donorCard, recentCoordination = [] }: BloodCardIndexProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [editSettingsOpen, setEditSettingsOpen] = useState(false);

    // Form for editing blood card preferences
    const { data, setData, put, processing, errors } = useForm({
        search_radius_km: donorCard.search_radius_km || 25,
        preferred_contact_method: donorCard.preferred_contact_method || 'app',
        emergency_ready: donorCard.emergency_ready || false,
        last_donation_date: donorCard.last_donation_date || '',
        notes: donorCard.notes || '',
    });

    // Form for requesting verification
    const {
        data: verifData,
        setData: setVerifData,
        post: postVerif,
        processing: verifProcessing,
        errors: verifErrors,
        reset: resetVerif,
    } = useForm({
        donor_card_number: donorCard.donor_card_number || '',
        notes: '',
        id_document: null as File | null,
    });

    const handleToggleAvailability = () => {
        router.post('/my-blood-card/toggle');
    };

    const handleUpdateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        put('/my-blood-card', {
            onSuccess: () => setEditSettingsOpen(false),
        });
    };

    const handleRequestVerification = (e: React.FormEvent) => {
        e.preventDefault();
        postVerif('/my-blood-card/verify', {
            onSuccess: () => {
                setVerificationModalOpen(false);
                resetVerif();
            },
        });
    };

    return (
        <AppLayout title="My Blood Card & Availability">
            <Head title="My Blood Card - Verified Donor Coordination" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <CreditCard className="w-6 h-6 text-rose-600" />
                            My Blood Card & Availability
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Manage your verified donor coordination profile, availability toggle, and Philippine hospital coordination records.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {donorCard.verification_status !== 'verified' && (
                            <button
                                type="button"
                                onClick={() => setVerificationModalOpen(true)}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition flex items-center gap-1.5"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                {donorCard.verification_status === 'pending'
                                    ? 'Verification Pending'
                                    : 'Request Verification'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setEditSettingsOpen(!editSettingsOpen)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                        >
                            <Sliders className="w-4 h-4 text-zinc-400" />
                            Card Settings
                        </button>
                    </div>
                </div>

                {/* Important Medical & Safety Warning Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 leading-relaxed">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                        <strong className="font-bold">Very Important Blood Card Safety Policy:</strong> This card is a <strong>verified donor coordination record</strong> reflecting your willingness to assist patients. It is <strong>NOT</strong> an identity card, legal power of attorney, or transferable blood voucher. You cannot transfer, sell, or allow another person to impersonate this card. All blood donations require physical presence and clinical screening at an authorized hospital or Philippine Red Cross facility.
                    </div>
                </div>

                {/* Main Card Display & Availability Toggle */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visual Blood Card Preview */}
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-rose-700 via-red-600 to-rose-900 border border-rose-500/30">
                            {/* Decorative Background Circles */}
                            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-black/10 blur-xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-between h-56">
                                {/* Top Card Bar */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                                            <HeartHandshake className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-base tracking-wide uppercase">
                                                BloodLink PH
                                            </span>
                                            <p className="text-[10px] text-rose-200 font-medium tracking-wider">
                                                Verified Donor Coordination Card
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className="px-3 py-1 rounded-full bg-white text-rose-700 text-sm font-black shadow-xs">
                                            {donorCard.blood_type}
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20 text-white/90">
                                            {donorCard.verification_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Center Card Details */}
                                <div>
                                    <p className="text-[11px] text-rose-200 font-semibold tracking-wider uppercase">
                                        Donor Name / Cardholder
                                    </p>
                                    <h3 className="text-xl font-black tracking-tight drop-shadow-xs">
                                        {user?.name}
                                    </h3>
                                    <p className="text-xs text-rose-100 flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {user?.location_string || 'Philippines'}
                                    </p>
                                </div>

                                {/* Bottom Card Bar */}
                                <div className="flex items-end justify-between border-t border-white/20 pt-3 text-[11px]">
                                    <div>
                                        <span className="text-rose-200 block text-[9px] uppercase font-semibold">
                                            Card Number / ID
                                        </span>
                                        <span className="font-mono font-bold tracking-wider">
                                            {donorCard.donor_card_number || `BL-${user?.id.toString().padStart(6, '0')}`}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-rose-200 block text-[9px] uppercase font-semibold">
                                            Radius
                                        </span>
                                        <span className="font-bold">
                                            {donorCard.search_radius_km} km
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-rose-200 block text-[9px] uppercase font-semibold">
                                            Total Donations
                                        </span>
                                        <span className="font-bold">
                                            {donorCard.total_donations_count} times
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-rose-200 block text-[9px] uppercase font-semibold">
                                            Status
                                        </span>
                                        <span className={`font-bold ${donorCard.is_available ? 'text-emerald-300' : 'text-zinc-300'}`}>
                                            {donorCard.is_available ? '● Available' : '○ Unavailable'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Availability Toggle Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                Donor Coordination Status
                            </h2>

                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        Current Availability:
                                    </span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        donorCard.is_available
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                                    }`}>
                                        {donorCard.is_available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-relaxed">
                                    {donorCard.is_available
                                        ? 'You are currently visible to nearby patients and emergency requesters looking for blood coordination.'
                                        : 'You are hidden from nearby donor searches. You will not receive new assistance requests.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleAvailability}
                                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                                    donorCard.is_available
                                        ? 'bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                            >
                                <RefreshCw className="w-4 h-4" />
                                {donorCard.is_available
                                    ? 'Set Status to Unavailable'
                                    : 'Set Status to Available Now'}
                            </button>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                            Verified on: {donorCard.verified_at || 'Pending official admin verification'}
                        </div>
                    </div>
                </div>

                {/* Edit Card Preferences Form (Collapsible) */}
                {editSettingsOpen && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Card Settings & Preferences
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    Configure your willingness radius, preferred contact, and emergency status.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditSettingsOpen(false)}
                                className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSettings} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Willing Search Radius (km) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={data.search_radius_km}
                                        onChange={(e) => setData('search_radius_km', parseInt(e.target.value) || 25)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    />
                                    <p className="text-[11px] text-zinc-400 mt-1">Maximum travel distance you are willing to travel for blood donation.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Preferred Coordination Channel *
                                    </label>
                                    <select
                                        value={data.preferred_contact_method}
                                        onChange={(e) => setData('preferred_contact_method', e.target.value as any)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="app">BloodLink App Requests Only</option>
                                        <option value="phone">Direct Phone Call / SMS</option>
                                        <option value="email">Email</option>
                                        <option value="both">Both App & Phone</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Last Recorded Blood Donation
                                    </label>
                                    <input
                                        type="date"
                                        value={data.last_donation_date}
                                        onChange={(e) => setData('last_donation_date', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    />
                                    <p className="text-[11px] text-zinc-400 mt-1">Standard medical resting interval between whole blood donations is typically 3 months.</p>
                                </div>

                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="emergency_ready"
                                        checked={data.emergency_ready}
                                        onChange={(e) => setData('emergency_ready', e.target.checked)}
                                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                                    />
                                    <label htmlFor="emergency_ready" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                        Mark as Emergency Ready (willing to be alerted for urgent/critical calls)
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Donor Notes & Availability Details
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Free weekends only, near Capitol Medical Center, etc."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setEditSettingsOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Recent Assistance / Coordination History */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-emerald-500" />
                        Recent Coordination Activity
                    </h2>

                    {recentCoordination.length === 0 ? (
                        <div className="p-8 text-center text-xs text-zinc-500">
                            No coordination requests recorded yet. When patients reach out to you, they will appear here.
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {recentCoordination.map((req) => (
                                <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                                            {req.requester?.name} requested {req.units_needed} unit(s) Type {req.blood_type_needed}
                                        </p>
                                        <p className="text-zinc-500 mt-0.5">
                                            Hospital: {req.hospital_name} • Needed Date: {req.needed_date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={req.status} />
                                        <span className="text-[11px] text-zinc-400">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Request Modal */}
            {verificationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Request Official Verification
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    Submit your Red Cross card, government ID, or blood bank certificate.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setVerificationModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRequestVerification} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Existing Red Cross / Donor Card Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PRC-2024-XXXXX"
                                    value={verifData.donor_card_number}
                                    onChange={(e) => setVerifData('donor_card_number', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Proof Document (Blood Type Card, Red Cross ID, Lab Test) *
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setVerifData('id_document', e.target.files[0]);
                                        }
                                    }}
                                    className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Notes for Administrators
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Any additional details regarding your blood donation history..."
                                    value={verifData.notes}
                                    onChange={(e) => setVerifData('notes', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setVerificationModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={verifProcessing}
                                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition disabled:opacity-50"
                                >
                                    {verifProcessing ? 'Submitting...' : 'Submit for Verification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
