import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { HelpmePost, PaginatedData, Province } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import {
    Flame,
    Plus,
    Building2,
    Calendar,
    Phone,
    MapPin,
    AlertCircle,
    ArrowRight,
    Search,
} from 'lucide-react';

interface HelpmeIndexProps {
    posts: PaginatedData<HelpmePost>;
    provinces: Province[];
    filters: {
        blood_type: string;
        urgency: string;
        province_id: string;
        city_id: string;
    };
}

export default function HelpmeIndex({ posts, provinces, filters }: HelpmeIndexProps) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/helpme',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout title="HelpMe Emergency Blood Requests">
            <Head title="HelpMe (Emergency Blood Requests) - BloodLink" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                                <Flame className="w-3.5 h-3.5 text-amber-300" />
                                Emergency Blood Hotline & Board
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
                                HelpMe Emergency Blood Calls
                            </h1>
                            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                                Urgent calls for blood donations across hospitals in the Philippines. Connect directly with families in critical medical need.
                            </p>
                        </div>

                        <div>
                            <Link
                                href="/helpme/create"
                                className="px-5 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm shadow-xl transition inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Post Emergency Request
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">
                                Filter Blood Type
                            </label>
                            <select
                                value={filters.blood_type}
                                onChange={(e) => handleFilterChange('blood_type', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="all">All Blood Types</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">
                                Filter Urgency
                            </label>
                            <select
                                value={filters.urgency}
                                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="all">All Urgency Levels</option>
                                <option value="critical">Critical (Immediate)</option>
                                <option value="urgent">Urgent (Within 24h)</option>
                                <option value="moderate">Moderate</option>
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
                                <option value="">Nationwide (All Provinces)</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Posts Cards Grid */}
                {posts.data.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-4">
                        <Flame className="w-10 h-10 text-zinc-300 mx-auto" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            No emergency HelpMe posts match your filter
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Check back regularly or create an emergency post if a patient is in need.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.data.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:border-rose-400 dark:hover:border-rose-700 transition flex flex-col justify-between space-y-4 group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <BloodTypeBadge bloodType={post.blood_type_needed} size="md" />
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                            post.urgency === 'critical'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                                : post.urgency === 'urgent'
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                        }`}>
                                            {post.urgency}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 transition line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
                                            Needs {post.units_needed} bag(s) • Needed by {post.needed_date}
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-zinc-500">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                            <span className="truncate">{post.hospital_name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                            <span className="truncate">
                                                {post.city?.name ? `${post.city.name}, ` : ''}{post.province?.name || 'Philippines'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-400">
                                        By {post.user?.name}
                                    </span>
                                    <Link
                                        href={`/helpme/${post.id}`}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                    >
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
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
