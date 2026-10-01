import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { SharedProps, User } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    User as UserIcon,
    MapPin,
    Calendar,
    Award,
    CreditCard,
    Shield,
    Phone,
    Mail,
    Flame,
    Settings,
    Send,
    HeartHandshake,
} from 'lucide-react';

interface ProfileShowProps {
    profileUser: User;
    isOwnProfile: boolean;
    stats: {
        donations_count: number;
        helpme_count: number;
        assistance_given_count: number;
    };
}

export default function ProfileShow({ profileUser, isOwnProfile, stats }: ProfileShowProps) {
    const donorCard = profileUser.donor_card;

    return (
        <AppLayout title={`${profileUser.name} - Profile`}>
            <Head title={`${profileUser.name} - BloodLink Profile`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            {profileUser.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.name}
                                    className="w-24 h-24 rounded-3xl object-cover border-2 border-rose-500/20 shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-3xl flex items-center justify-center border-2 border-rose-500/20 shadow-md">
                                    {profileUser.first_name ? profileUser.first_name[0] : profileUser.name[0]}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                        {profileUser.name}
                                    </h1>
                                    {profileUser.blood_type && (
                                        <BloodTypeBadge bloodType={profileUser.blood_type} size="md" />
                                    )}
                                    {profileUser.is_admin && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase">
                                            Administrator
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    {profileUser.location_string || 'Philippines'}
                                </p>

                                <div className="flex items-center gap-2 pt-1">
                                    {donorCard && (
                                        <StatusBadge status={donorCard.verification_status} />
                                    )}
                                    <span className="text-[11px] text-zinc-400">
                                        Member since {new Date(profileUser.created_at || '').toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top Action */}
                        <div>
                            {isOwnProfile ? (
                                <Link
                                    href="/settings"
                                    className="px-5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold transition flex items-center gap-1.5"
                                >
                                    <Settings className="w-4 h-4 text-zinc-400" /> Edit Profile & Settings
                                </Link>
                            ) : (
                                donorCard?.is_available && (
                                    <Link
                                        href={`/donors/${donorCard.id}`}
                                        className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                                    >
                                        <Send className="w-4 h-4" /> Request Blood Assistance
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                {stats.donations_count}
                            </span>
                            <p className="text-xs text-zinc-500 font-medium">Recorded Blood Donations</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                {stats.assistance_given_count}
                            </span>
                            <p className="text-xs text-zinc-500 font-medium">Coordinated Transfusions</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                {stats.helpme_count}
                            </span>
                            <p className="text-xs text-zinc-500 font-medium">HelpMe Calls Posted</p>
                        </div>
                    </div>
                </div>

                {/* Donor Card & Bio Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bio */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            About Member
                        </h2>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {profileUser.bio || 'This member has not written a personal bio yet.'}
                        </p>
                    </div>

                    {/* Blood Card Coordination Summary */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-rose-600" /> Donor Card Status
                            </h2>
                            {isOwnProfile && (
                                <Link
                                    href="/my-blood-card"
                                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                                >
                                    Manage Card →
                                </Link>
                            )}
                        </div>

                        {donorCard ? (
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <span className="text-zinc-500">Availability:</span>
                                    <span className={`font-bold ${donorCard.is_available ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {donorCard.is_available ? '● Available for Coordination' : '○ Unavailable'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <span className="text-zinc-500">Willing Radius:</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                        Up to {donorCard.search_radius_km} km
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                    <span className="text-zinc-500">Verification:</span>
                                    <span className="font-bold capitalize text-zinc-800 dark:text-zinc-200">
                                        {donorCard.verification_status}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-500">No donor card configured.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
