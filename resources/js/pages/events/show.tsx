import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BloodEvent, SharedProps } from '@/types/bloodlink';
import { ReportModal } from '@/components/bloodlink/ReportModal';
import { LeafletMap } from '@/components/bloodlink/LeafletMap';
import {
    Calendar,
    MapPin,
    Clock,
    Phone,
    Mail,
    Building2,
    Users,
    ShieldCheck,
    ArrowLeft,
    ExternalLink,
    Flag,
    Share2,
} from 'lucide-react';

interface EventShowProps {
    event: BloodEvent;
}

export default function EventShow({ event }: EventShowProps) {
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
        <AppLayout title={`${event.title} - BloodLink Event`}>
            <Head title={`${event.title} - BloodLink Blood Drive`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Events
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {copied ? 'Link Copied!' : 'Share'}
                        </button>

                        {currentUser?.id !== event.user_id && (
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

                {/* Event Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                    {event.event_type.replace('_', ' ')}
                                </span>
                                {event.is_official && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Official Partner Drive
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                                {event.title}
                            </h1>
                            <p className="text-xs text-zinc-500">
                                Organized by <strong className="text-zinc-800 dark:text-zinc-200">{event.organizer}</strong>
                            </p>
                        </div>

                        {event.registration_link && (
                            <a
                                href={event.registration_link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                            >
                                Pre-Register / RSVP <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Event Date
                            </span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {event.event_date}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-500" /> Time
                            </span>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {event.start_time || '08:00 AM'} - {event.end_time || '04:00 PM'}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Location
                            </span>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                {event.venue}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                                {event.city?.name ? `${event.city.name}, ` : ''}{event.province?.name || 'Philippines'}
                            </p>
                        </div>
                    </div>

                    {/* Venue Map */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Venue Location Map
                        </h2>
                        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                            <LeafletMap
                                events={[event]}
                                height="260px"
                                defaultCenter={
                                    event.latitude && event.longitude
                                        ? [event.latitude, event.longitude]
                                        : [14.6091, 121.0223]
                                }
                                defaultZoom={13}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            About This Event & Donor Guidelines
                        </h2>
                        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </div>
                    </div>

                    {/* Contact Person */}
                    {(event.contact_person || event.contact_number) && (
                        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 text-xs">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                                    Organizer Contact
                                </span>
                                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                                    {event.contact_person || event.organizer}
                                </p>
                            </div>
                            {event.contact_number && (
                                <a
                                    href={`tel:${event.contact_number}`}
                                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
                                >
                                    <Phone className="w-3.5 h-3.5" /> {event.contact_number}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportableType="blood_event"
                reportableId={event.id}
                targetTitle={event.title}
            />
        </AppLayout>
    );
}
