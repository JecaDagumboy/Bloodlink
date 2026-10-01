import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldAlert, Sparkles, Check, Flame } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    type?: 'request' | 'verification' | 'urgency' | 'general';
}

export function StatusBadge({ status, type = 'general' }: StatusBadgeProps) {
    const s = status.toLowerCase();

    // Urgency statuses
    if (s === 'critical') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Critical Urgency
            </span>
        );
    }

    if (s === 'urgent') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Urgent
            </span>
        );
    }

    if (s === 'moderate') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Moderate
            </span>
        );
    }

    // Verification & Request statuses
    if (s === 'verified' || s === 'approved' || s === 'completed' || s === 'accepted') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {s === 'accepted' ? 'Accepted / Coordinating' : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
        );
    }

    if (s === 'pending') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Pending Review
            </span>
        );
    }

    if (s === 'rejected' || s === 'cancelled' || s === 'suspended') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
        );
    }

    if (s === 'expired') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                Expired
            </span>
        );
    }

    if (s === 'available') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Available Now
            </span>
        );
    }

    if (s === 'unavailable') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                Unavailable
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
            {status}
        </span>
    );
}

