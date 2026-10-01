import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AdminAuditLog, ContentReport } from '@/types/bloodlink';
import {
    Shield,
    Users,
    CheckCircle2,
    Inbox,
    Flame,
    Calendar,
    AlertCircle,
    Activity,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
    metrics: {
        total_users: number;
        active_donors: number;
        pending_verifications: number;
        open_requests: number;
        urgent_helpme: number;
        upcoming_events: number;
        unresolved_reports: number;
    };
    recentAudits: AdminAuditLog[];
    recentReports: ContentReport[];
}

export default function AdminDashboard({ metrics, recentAudits = [], recentReports = [] }: AdminDashboardProps) {
    const statCards = [
        {
            label: 'Total Registered Users',
            value: metrics.total_users,
            href: '/admin/users',
            icon: Users,
            color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
        },
        {
            label: 'Active Donors Available',
            value: metrics.active_donors,
            href: '/admin/users',
            icon: Activity,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
        },
        {
            label: 'Pending Verifications',
            value: metrics.pending_verifications,
            href: '/admin/verifications',
            icon: CheckCircle2,
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
            highlight: metrics.pending_verifications > 0,
        },
        {
            label: 'Active Requests In-Progress',
            value: metrics.open_requests,
            href: '/admin/requests',
            icon: Inbox,
            color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60',
        },
        {
            label: 'Urgent HelpMe Calls',
            value: metrics.urgent_helpme,
            href: '/admin/helpme',
            icon: Flame,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
        },
        {
            label: 'Upcoming Blood Drives',
            value: metrics.upcoming_events,
            href: '/admin/events',
            icon: Calendar,
            color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
        },
        {
            label: 'Unresolved Reports',
            value: metrics.unresolved_reports,
            href: '/admin/reports',
            icon: AlertCircle,
            color: 'text-red-600 bg-red-50 dark:bg-red-950/60',
            highlight: metrics.unresolved_reports > 0,
        },
    ];

    return (
        <AppLayout title="Admin Moderation Portal">
            <Head title="Admin Dashboard - BloodLink" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                        <Shield className="w-3.5 h-3.5 text-purple-300" />
                        BloodLink Central Administration
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Moderation & Compliance Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
                        Supervise donor card verifications, audit emergency HelpMe requests, enforce Philippine medical compliance, and monitor transactions.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={idx}
                                href={stat.href}
                                className={`bg-white dark:bg-zinc-900 border rounded-3xl p-5 shadow-xs transition hover:scale-[1.02] flex flex-col justify-between h-32 ${
                                    stat.highlight
                                        ? 'border-purple-400 dark:border-purple-600 ring-2 ring-purple-500/20'
                                        : 'border-zinc-200 dark:border-zinc-800'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-500 truncate">
                                        {stat.label}
                                    </span>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                                        {stat.value}
                                    </span>
                                    <span className="text-[11px] font-bold text-purple-600 flex items-center gap-0.5">
                                        Manage <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Split Row: Recent Reports & Audit Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Unresolved Reports */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" /> Recent Content Reports
                            </h2>
                            <Link href="/admin/reports" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                                All Reports →
                            </Link>
                        </div>

                        {recentReports.length === 0 ? (
                            <p className="text-xs text-zinc-400 py-6 text-center">
                                No unresolved content reports. Platform compliance is clean!
                            </p>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {recentReports.map((rep) => (
                                    <div key={rep.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                                        <div>
                                            <p className="font-bold text-zinc-800 dark:text-zinc-200">
                                                Reason: {rep.reason.replace('_', ' ')}
                                            </p>
                                            <p className="text-zinc-500 mt-0.5">
                                                Target: <span className="capitalize">{rep.reportable_type}</span> #{rep.reportable_id}
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/reports"
                                            className="text-[11px] font-bold text-purple-600 hover:underline"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Audit Logs */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-500" /> Recent Audit Trail
                            </h2>
                            <Link href="/admin/audit-logs" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                                View Full Log →
                            </Link>
                        </div>

                        {recentAudits.length === 0 ? (
                            <p className="text-xs text-zinc-400 py-6 text-center">
                                No administrative actions recorded yet.
                            </p>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                                {recentAudits.map((audit) => (
                                    <div key={audit.id} className="py-2.5 space-y-0.5">
                                        <div className="flex items-center justify-between font-bold text-zinc-800 dark:text-zinc-200">
                                            <span>{audit.action.replace(/_/g, ' ')}</span>
                                            <span className="text-[10px] text-zinc-400 font-normal">
                                                {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-[11px] truncate">
                                            {audit.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
