import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BloodEvent, PaginatedData, Province } from '@/types/bloodlink';
import {
    Calendar,
    MapPin,
    Clock,
    Plus,
    Building2,
    Users,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';

interface EventsIndexProps {
    events: PaginatedData<BloodEvent>;
    provinces: Province[];
    filters: {
        event_type: string;
        province_id: string;
        upcoming_only: boolean;
    };
}

export default function EventsIndex({ events, provinces, filters }: EventsIndexProps) {
    const handleFilterChange = (key: string, value: any) => {
        router.get(
            '/events',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout title="Blood Drives & Community Events">
            <Head title="Blood Donation Events - BloodLink" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5 text-white" />
                                Philippine Blood Donation Drives
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
                                Community Blood Drives & Events
                            </h1>
                            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                                Join hospital drives, Red Cross mobile donation hubs, and university blood campaigns in your city.
                            </p>
                        </div>

                        <div>
                            <Link
                                href="/events/create"
                                className="px-5 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm shadow-xl transition inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Organize / Post Event
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">
                                Event Category
                            </label>
                            <select
                                value={filters.event_type}
                                onChange={(e) => handleFilterChange('event_type', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="all">All Event Types</option>
                                <option value="blood_drive">Mobile Blood Drive</option>
                                <option value="hospital_drive">Hospital Blood Campaign</option>
                                <option value="advocacy">Awareness & Advocacy</option>
                                <option value="official_announcement">Official Announcement</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">
                                Filter Province
                            </label>
                            <select
                                value={filters.province_id}
                                onChange={(e) => handleFilterChange('province_id', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="">All Provinces (Nationwide)</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.upcoming_only}
                                    onChange={(e) => handleFilterChange('upcoming_only', e.target.checked)}
                                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                                />
                                Show Upcoming Events Only
                            </label>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {events.data.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-4">
                        <Calendar className="w-10 h-10 text-zinc-300 mx-auto" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            No blood donation events found
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Check back soon or post a new blood drive event for your community.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.data.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex flex-col justify-between space-y-4 group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                            {event.event_type.replace('_', ' ')}
                                        </span>
                                        {event.is_official && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Official
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 transition line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Organized by <strong className="text-zinc-700 dark:text-zinc-300">{event.organizer}</strong>
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                {event.event_date}
                                                {event.start_time && ` • ${event.start_time}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-400">
                                        {event.city?.name ? `${event.city.name}, ` : ''}{event.province?.name || 'Philippines'}
                                    </span>
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                    >
                                        View Event <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
