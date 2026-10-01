import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { AssistanceRequest, PaginatedData } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import {
    Inbox,
    ArrowLeft,
    Building2,
    Calendar,
    Eye,
} from 'lucide-react';

interface AdminRequestsProps {
    requests: PaginatedData<AssistanceRequest>;
}

export default function AdminRequests({ requests }: AdminRequestsProps) {
    return (
        <AppLayout title="System Requests Overview">
            <Head title="System Requests - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Inbox className="w-6 h-6 text-purple-600" />
                            Systemwide Assistance & Coordination Requests
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Overview of all blood assistance transactions, status progressions, and hospital coordination requests.
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
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Blood & Units</th>
                                    <th className="p-4">Hospital Target</th>
                                    <th className="p-4">Requester</th>
                                    <th className="p-4">Designated Donor</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Inspect</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {requests.data.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4 font-mono font-bold text-zinc-500">
                                            #{req.id.toString().padStart(6, '0')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <BloodTypeBadge bloodType={req.blood_type_needed} size="sm" />
                                                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                                    {req.units_needed} bag(s)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                                {req.hospital_name}
                                            </p>
                                            <p className="text-[11px] text-zinc-400">
                                                Needed: {req.needed_date}
                                            </p>
                                        </td>
                                        <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                                            {req.requester?.name}
                                        </td>
                                        <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                                            {req.donor?.name}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/requests/${req.id}`}
                                                className="inline-flex items-center p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-purple-600 transition"
                                                title="View request timeline"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
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
