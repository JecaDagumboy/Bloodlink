import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { InAppNotification, PaginatedData } from '@/types/bloodlink';
import {
    Bell,
    CheckCheck,
    Check,
    AlertCircle,
    Info,
    Inbox,
    Clock,
    ArrowRight,
} from 'lucide-react';

interface NotificationsIndexProps {
    notifications: PaginatedData<InAppNotification>;
}

export default function NotificationsIndex({ notifications }: NotificationsIndexProps) {
    const handleMarkAsRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    return (
        <AppLayout title="Notifications Inbox">
            <Head title="Notifications - BloodLink" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Bell className="w-6 h-6 text-rose-600" />
                            Notifications Inbox
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Stay updated on blood assistance requests, verification approvals, and urgent community calls.
                        </p>
                    </div>

                    {notifications.data.some((n) => !n.read_at) && (
                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
                        >
                            <CheckCheck className="w-4 h-4 text-emerald-500" />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {notifications.data.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs space-y-3">
                        <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                            <Bell className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            Your notifications inbox is clear
                        </h3>
                        <p className="text-xs text-zinc-500">
                            When someone requests your assistance or your card is verified, updates will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl divide-y divide-zinc-100 dark:divide-zinc-800 shadow-xs overflow-hidden">
                        {notifications.data.map((item) => {
                            const isUnread = !item.read_at;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-5 flex items-start justify-between gap-4 transition ${
                                        isUnread
                                            ? 'bg-rose-50/40 dark:bg-rose-950/20'
                                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                            item.type === 'request'
                                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950'
                                                : item.type === 'success'
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950'
                                                : 'bg-blue-100 text-blue-600 dark:bg-blue-950'
                                        }`}>
                                            {item.type === 'request' ? (
                                                <Inbox className="w-4 h-4" />
                                            ) : item.type === 'success' ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Info className="w-4 h-4" />
                                            )}
                                        </div>

                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-sm ${isUnread ? 'font-black text-zinc-900 dark:text-zinc-100' : 'font-semibold text-zinc-700 dark:text-zinc-300'}`}>
                                                    {item.title}
                                                </h4>
                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {item.message}
                                            </p>
                                            <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400">
                                                <span>{new Date(item.created_at).toLocaleString()}</span>
                                                {item.link && (
                                                    <Link
                                                        href={item.link}
                                                        className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                                    >
                                                        Open Link <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isUnread && (
                                        <button
                                            type="button"
                                            onClick={() => handleMarkAsRead(item.id)}
                                            title="Mark as read"
                                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
