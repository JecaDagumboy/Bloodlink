import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AdminAuditLog, PaginatedData } from '@/types/bloodlink';
import {
    Activity,
    ArrowLeft,
    Shield,
    Clock,
    User,
} from 'lucide-react';

interface AdminAuditLogsProps {
    logs: PaginatedData<AdminAuditLog>;
}

export default function AdminAuditLogs({ logs }: AdminAuditLogsProps) {
    return (
        <AppLayout title="Administrative Audit Logs">
            <Head title="Audit Logs - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Activity className="w-6 h-6 text-purple-600" />
                            Administrative Audit Trail & Security Logs
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Immutable chronological record of moderation events, approvals, user status modifications, and report resolutions.
                        </p>
                    </div>

                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4">Administrator</th>
                                    <th className="p-4">Action</th>
                                    <th className="p-4">Target</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4 whitespace-nowrap text-zinc-400 text-[11px]">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">
                                            {log.admin?.name || `Admin #${log.admin_id}`}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 capitalize text-zinc-600 dark:text-zinc-400">
                                            {log.target_type.replace(/_/g, ' ')} {log.target_id ? `#${log.target_id}` : ''}
                                        </td>
                                        <td className="p-4 max-w-sm text-zinc-700 dark:text-zinc-300">
                                            {log.description}
                                        </td>
                                        <td className="p-4 text-zinc-400 font-mono text-[11px]">
                                            {log.ip_address || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
