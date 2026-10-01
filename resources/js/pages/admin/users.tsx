import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { PaginatedData, User } from '@/types/bloodlink';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import {
    Users,
    Search,
    Shield,
    UserX,
    UserCheck,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
} from 'lucide-react';

interface AdminUsersProps {
    users: PaginatedData<User>;
    filters: {
        search: string;
        role: string;
        status: string;
    };
}

export default function AdminUsers({ users, filters }: AdminUsersProps) {
    const [search, setSearch] = useState(filters.search);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/users',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const handleToggleStatus = (id: number) => {
        if (confirm('Change active/suspended status for this user?')) {
            router.post(`/admin/users/${id}/toggle-status`);
        }
    };

    return (
        <AppLayout title="Admin User Management">
            <Head title="User Directory - BloodLink Admin" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <Users className="w-6 h-6 text-purple-600" />
                            User Directory & Account Oversight
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Review member accounts, manage roles, and suspend violating accounts.
                        </p>
                    </div>

                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or phone..."
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            />
                        </div>

                        <div>
                            <select
                                value={filters.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Regular Members</option>
                                <option value="admin">Administrators</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Blood Type</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold flex items-center justify-center text-xs">
                                                    {u.first_name ? u.first_name[0] : u.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                                                        {u.name}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-400">
                                                        {u.email} • {u.phone || 'No phone'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {u.blood_type ? (
                                                <BloodTypeBadge bloodType={u.blood_type} size="sm" />
                                            ) : (
                                                <span className="text-zinc-400">—</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
                                                u.status === 'active'
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} />
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-zinc-500 truncate max-w-xs">
                                            {u.location_string || 'Philippines'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(u.id)}
                                                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                                                    u.status === 'active'
                                                        ? 'bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                }`}
                                            >
                                                {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                                            </button>
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
