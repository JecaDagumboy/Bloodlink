import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import {
    Activity,
    Search,
    HeartHandshake,
    Flame,
    Calendar,
    Inbox,
    CreditCard,
    ArrowRight,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Clock,
    UserCheck,
    Hospital,
    Phone,
} from 'lucide-react';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import { LeafletMap } from '@/components/bloodlink/LeafletMap';
import { DonorCard, AssistanceRequest, HelpmePost, BloodEvent, SharedProps } from '@/types/bloodlink';

interface DashboardProps {
    stats: {
        blood_type: string;
        donor_card?: DonorCard;
        is_available: boolean;
        verification_status: string;
        nearby_donors_count: number;
        pending_requests_count: number;
        helpme_requests_count: number;
        upcoming_events_count: number;
    };
    nearbyDonors: DonorCard[];
    recentRequests: AssistanceRequest[];
    emergencyHelpme: HelpmePost[];
    recentEvents: BloodEvent[];
    userLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
}

export default function Dashboard({
    stats,
    nearbyDonors = [],
    recentRequests = [],
    emergencyHelpme = [],
    recentEvents = [],
    userLocation,
}: DashboardProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard — BloodLink Philippines" />

            <div className="space-y-8">
                {/* Welcome & Quick Profile Header */}
                <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                                BloodLink Network Dashboard
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                Mabuhay, {user?.first_name || user?.name}!
                            </h1>
                            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                                📍 {user?.location_string || 'Philippines'} • Connected to verified donors and emergency hospital coordination across your region.
                            </p>
                        </div>

                        {/* Quick action pill buttons */}
                        <div className="flex flex-wrap gap-2.5">
                            <Link
                                href="/donors"
                                className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
                            >
                                <Search className="w-4 h-4" />
                                Search Donors
                            </Link>
                            <Link
                                href="/helpme/create"
                                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center gap-1.5"
                            >
                                <Flame className="w-4 h-4 text-amber-300" />
                                Post Emergency
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1: Blood Type */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                            <span>Your Blood Group</span>
                            <HeartHandshake className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <BloodTypeBadge bloodType={stats.blood_type} size="lg" showTag />
                        </div>
                        <p className="text-[11px] text-zinc-400">
                            Registered on BloodLink
                        </p>
                    </div>

                    {/* Stat 2: Donor Availability */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                            <span>Donor Card Status</span>
                            <CreditCard className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={stats.is_available ? 'available' : 'unavailable'} />
                        </div>
                        <Link
                            href="/my-blood-card"
                            className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                        >
                            Manage Card & Radius <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Stat 3: Nearby Donors */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                            <span>Available Donors</span>
                            <UserCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                            {stats.nearby_donors_count}
                        </div>
                        <Link
                            href="/donors"
                            className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                        >
                            View Nearby Map <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Stat 4: Pending Coordination Requests */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                            <span>Active Requests</span>
                            <Inbox className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                            {stats.pending_requests_count}
                        </div>
                        <Link
                            href="/requests"
                            className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                        >
                            View Requests Inbox <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Interactive Map & Nearby Available Donors */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-600" />
                                Nearby Verified Donors Around You
                            </h2>
                            <p className="text-xs text-zinc-500">
                                Real-time distance calculated from your registered Philippine address
                            </p>
                        </div>
                        <Link
                            href="/donors"
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 self-start sm:self-auto"
                        >
                            Open Full Map & Filters <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Interactive Leaflet Map */}
                    <LeafletMap
                        userLocation={userLocation}
                        donors={nearbyDonors}
                        events={recentEvents}
                        height="360px"
                    />

                    {/* Quick Donor Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {nearbyDonors.map((donor) => {
                            const donorName = donor.user?.name ?? (donor as any).name;
                            const distance = (donor as any).distance_km;
                            const locStr = donor.user?.location_string || 'Philippines';

                            return (
                                <div
                                    key={donor.id}
                                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 flex items-start gap-3.5 hover:border-rose-300 dark:hover:border-rose-800 transition shadow-2xs"
                                >
                                    <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                                        {donor.user?.avatar ? (
                                            <img
                                                src={donor.user.avatar}
                                                alt={donorName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>{donorName ? donorName[0] : 'D'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                                {donorName}
                                            </h4>
                                            <BloodTypeBadge bloodType={donor.blood_type} size="sm" />
                                        </div>
                                        <p className="text-[11px] text-zinc-500 truncate">
                                            📍 {locStr}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] pt-1">
                                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                {distance ? `${distance} km away` : 'Nearby'}
                                            </span>
                                            <Link
                                                href={`/donors/${donor.id}`}
                                                className="font-bold text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
                                            >
                                                Coordinate →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Two Columns: Recent Requests & Emergency HelpMe Board */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Recent Coordination Requests */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Inbox className="w-5 h-5 text-rose-600" />
                                Recent Requests
                            </h2>
                            <Link
                                href="/requests"
                                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                            >
                                View All ({recentRequests.length})
                            </Link>
                        </div>

                        {recentRequests.length === 0 ? (
                            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-2">
                                <p>No coordination requests recorded yet.</p>
                                <Link
                                    href="/donors"
                                    className="inline-block px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
                                >
                                    Find Donors
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentRequests.map((req) => {
                                    const isRequester = req.requester_id === user?.id;
                                    const otherPerson = isRequester ? req.donor : req.requester;

                                    return (
                                        <Link
                                            key={req.id}
                                            href={`/requests/${req.id}`}
                                            className="block p-3.5 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 transition space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                                        {isRequester ? `To: ${otherPerson?.name}` : `From: ${otherPerson?.name}`}
                                                    </span>
                                                    <BloodTypeBadge bloodType={req.blood_type_needed} size="sm" />
                                                </div>
                                                <StatusBadge status={req.status} />
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-zinc-500">
                                                <span>🏥 {req.hospital_name}</span>
                                                <span>Needed: {req.needed_date}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right: Emergency HelpMe Requests */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Flame className="w-5 h-5 text-red-500" />
                                Urgent HelpMe Board
                            </h2>
                            <Link
                                href="/helpme"
                                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                            >
                                View Board
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {emergencyHelpme.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/helpme/${post.id}`}
                                    className="block p-3.5 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 transition space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                                            {post.title}
                                        </h4>
                                        <StatusBadge status={post.urgency} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BloodTypeBadge bloodType={post.blood_type_needed} size="sm" />
                                        <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                                            {post.units_needed} Unit(s) Needed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                                        <span>🏥 {post.hospital_name}</span>
                                        <span>Needed by: {post.needed_date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Blood Donation Drives & Community Events */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-500" />
                            Official Blood Donation Drives & Events
                        </h2>
                        <Link
                            href="/events"
                            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                        >
                            View Calendar ({recentEvents.length})
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentEvents.map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className="p-4 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 transition space-y-2"
                            >
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    📅 {event.event_date} {event.start_time || ''}
                                </span>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-2">
                                    {event.title}
                                </h4>
                                <p className="text-[11px] text-zinc-500 line-clamp-1">
                                    📍 {event.venue}
                                </p>
                                <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                                    By: {event.organizer}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

