import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BloodEvent, CommunityPost, DonorCard, HelpmePost } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import {
    Search,
    User,
    Flame,
    Calendar,
    FileText,
    ArrowRight,
    MapPin,
    Building2,
} from 'lucide-react';

interface SearchIndexProps {
    searchQuery: string;
    donors: DonorCard[];
    helpmePosts: HelpmePost[];
    events: BloodEvent[];
    communityPosts: CommunityPost[];
}

export default function SearchIndex({
    searchQuery,
    donors = [],
    helpmePosts = [],
    events = [],
    communityPosts = [],
}: SearchIndexProps) {
    const [query, setQuery] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.get('/search', { q: query.trim() });
        }
    };

    const totalResults = donors.length + helpmePosts.length + events.length + communityPosts.length;

    return (
        <AppLayout title={`Search: ${searchQuery || 'All'}`}>
            <Head title={`Search Results for "${searchQuery}" - BloodLink`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Search Header */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                    <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Search className="w-5 h-5 text-rose-600" />
                        Search BloodLink Across All Resources
                    </h1>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by blood type (e.g. O+, A-), donor name, hospital, city, event venue..."
                            className="flex-1 px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-rose-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md transition"
                        >
                            Search
                        </button>
                    </form>

                    <p className="text-xs text-zinc-400">
                        {totalResults} results found for "<strong className="text-zinc-700 dark:text-zinc-300">{searchQuery}</strong>"
                    </p>
                </div>

                {/* 1. Matching Donors */}
                {donors.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <User className="w-4 h-4 text-rose-600" /> Matching Donors ({donors.length})
                            </h2>
                            <Link href="/donors" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                                View all donors →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {donors.map((donor) => (
                                <Link
                                    key={donor.id}
                                    href={`/donors/${donor.id}`}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex items-center gap-3.5 group"
                                >
                                    <BloodTypeBadge bloodType={donor.blood_type} size="md" />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-600 transition">
                                            {donor.user?.name}
                                        </h3>
                                        <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {donor.user?.location_string || 'Philippines'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. HelpMe Emergency Posts */}
                {helpmePosts.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-500" /> Emergency HelpMe Posts ({helpmePosts.length})
                            </h2>
                            <Link href="/helpme" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                                View all emergency calls →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {helpmePosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/helpme/${post.id}`}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex items-center justify-between gap-3 group"
                                >
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <BloodTypeBadge bloodType={post.blood_type_needed} size="sm" />
                                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-600 transition">
                                                {post.title}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Building2 className="w-3 h-3 text-zinc-400" /> {post.hospital_name}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-rose-600 transition shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Blood Drives & Events */}
                {events.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-rose-500" /> Blood Donation Drives ({events.length})
                            </h2>
                            <Link href="/events" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                                View all events →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex items-center justify-between gap-3 group"
                                >
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-600 transition">
                                            {event.title}
                                        </h3>
                                        <p className="text-[11px] text-zinc-500">
                                            {event.event_date} • {event.venue}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-rose-600 transition shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Community Stories */}
                {communityPosts.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" /> Community Stories ({communityPosts.length})
                            </h2>
                            <Link href="/posts" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                                View all stories →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {communityPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/posts/${post.id}`}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex items-center justify-between gap-3 group"
                                >
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-600 transition">
                                            {post.title}
                                        </h3>
                                        <p className="text-[11px] text-zinc-400">
                                            By {post.user?.name}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-rose-600 transition shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {totalResults === 0 && searchQuery && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-3">
                        <Search className="w-10 h-10 text-zinc-300 mx-auto" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            No matching items found for "{searchQuery}"
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Try searching by blood type (e.g. O+, B-), Philippine city (e.g. Quezon City, Cebu), or hospital name.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
