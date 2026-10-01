import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { HelpmePost, SharedProps } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { ReportModal } from '@/components/bloodlink/ReportModal';
import {
    Flame,
    Building2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ArrowLeft,
    Share2,
    Flag,
    AlertTriangle,
    Shield,
    Check,
    User,
} from 'lucide-react';

interface HelpmeShowProps {
    post: HelpmePost;
}

export default function HelpmeShow({ post }: HelpmeShowProps) {
    const { auth } = usePage<SharedProps>().props;
    const currentUser = auth.user;

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <AppLayout title={`${post.title} - BloodLink Emergency`}>
            <Head title={`${post.title} - BloodLink HelpMe`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/helpme"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Emergency Calls
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {copied ? 'Link Copied!' : 'Share Call'}
                        </button>

                        {currentUser?.id !== post.user_id && (
                            <button
                                type="button"
                                onClick={() => setReportModalOpen(true)}
                                className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition flex items-center gap-1.5"
                            >
                                <Flag className="w-3.5 h-3.5" /> Report
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Emergency Call Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-start gap-4">
                            <BloodTypeBadge bloodType={post.blood_type_needed} size="lg" />
                            <div className="space-y-1">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    post.urgency === 'critical'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                        : post.urgency === 'urgent'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                    {post.urgency} Urgency
                                </span>
                                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                    {post.title}
                                </h1>
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                                    Needs {post.units_needed} Bag(s) of Blood • Needed By {post.needed_date}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital & Location Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-rose-500" /> Hospital Facility
                            </span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {post.hospital_name}
                            </p>
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-zinc-400" />
                                {post.city?.name ? `${post.city.name}, ` : ''}{post.province?.name || 'Philippines'}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-emerald-500" /> Direct Contact
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`tel:${post.contact_number}`}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition inline-flex items-center gap-2 shadow-sm"
                                >
                                    <Phone className="w-3.5 h-3.5" /> Call {post.contact_number}
                                </a>
                                {post.contact_email && (
                                    <a
                                        href={`mailto:${post.contact_email}`}
                                        className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                        title="Email Requester"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Situation Narrative */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Patient Situation & Hospital Directions
                        </h2>
                        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                            {post.description}
                        </div>
                    </div>

                    {/* Requisition Photo if present */}
                    {post.photo_path && (
                        <div className="space-y-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Attached Hospital Requisition Document
                            </h2>
                            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-w-md">
                                <img
                                    src={post.photo_path}
                                    alt="Medical requisition"
                                    className="w-full object-cover max-h-80"
                                />
                            </div>
                        </div>
                    )}

                    {/* Author & Disclaimer Bar */}
                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 font-bold flex items-center justify-center text-[10px]">
                                {post.user?.name[0]}
                            </div>
                            <span>Posted by {post.user?.name} on {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="text-[11px] text-zinc-400">
                            Status: <span className="font-bold uppercase text-emerald-600">{post.status}</span>
                        </div>
                    </div>
                </div>

                {/* Important Clinical Disclaimer */}
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 leading-relaxed flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                        <strong>Emergency Volunteer Donor Notice:</strong> Donors who wish to assist this patient should report directly to the designated hospital's blood bank. Hospital medical staff will conduct confidential health history screening, hemoglobin tests, and cross-matching before accepting blood donation.
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportableType="helpme_post"
                reportableId={post.id}
                targetTitle={post.title}
            />
        </AppLayout>
    );
}
