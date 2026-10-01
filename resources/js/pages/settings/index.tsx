import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { Province, SharedProps, User } from '@/types/bloodlink';
import { CascadingLocationSelect } from '@/components/bloodlink/CascadingLocationSelect';
import { PasswordInputWithToggle } from '@/components/bloodlink/PasswordInputWithToggle';
import {
    Settings,
    User as UserIcon,
    Lock,
    Shield,
    Sun,
    Moon,
    Bell,
    Trash2,
    Check,
    Save,
    Upload,
    AlertTriangle,
} from 'lucide-react';

interface SettingsIndexProps {
    user: User;
    provinces: Province[];
}

export default function SettingsIndex({ user, provinces = [] }: SettingsIndexProps) {
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'privacy' | 'appearance' | 'notifications' | 'danger'>('account');

    // Account Form
    const {
        data: accountData,
        setData: setAccountData,
        put: putAccount,
        processing: accountProcessing,
        errors: accountErrors,
    } = useForm({
        first_name: user.first_name || user.name.split(' ')[0] || '',
        last_name: user.last_name || user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'prefer_not_to_say',
        blood_type: user.blood_type || 'O+',
        bio: user.bio || '',
        province_id: user.province_id || '',
        city_id: user.city_id || '',
        barangay_id: user.barangay_id || '',
        address: user.address || '',
        avatar: null as File | null,
    });

    const handleAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putAccount('/settings/account');
    };

    // Security Form
    const {
        data: securityData,
        setData: setSecurityData,
        put: putSecurity,
        processing: securityProcessing,
        errors: securityErrors,
        reset: resetSecurity,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSecuritySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putSecurity('/settings/security', {
            onSuccess: () => resetSecurity(),
        });
    };

    // Privacy Form
    const {
        data: privacyData,
        setData: setPrivacyData,
        put: putPrivacy,
        processing: privacyProcessing,
    } = useForm({
        show_phone: user.settings?.show_phone || false,
        location_privacy: user.settings?.location_privacy || 'approximate',
        show_donor_availability: user.settings?.show_donor_availability ?? true,
        profile_visibility: user.settings?.profile_visibility || 'users_only',
    });

    const handlePrivacySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPrivacy('/settings/privacy');
    };

    // Appearance Form
    const {
        data: appearanceData,
        setData: setAppearanceData,
        put: putAppearance,
        processing: appearanceProcessing,
    } = useForm({
        theme: user.settings?.theme || 'system',
    });

    const handleAppearanceSubmit = (themeValue: 'light' | 'dark' | 'system') => {
        setAppearanceData('theme', themeValue);
        // Instant visual update
        if (themeValue === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else if (themeValue === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        router.put('/settings/appearance', { theme: themeValue });
    };

    // Notification Preferences Form
    const {
        data: notifData,
        setData: setNotifData,
        put: putNotif,
        processing: notifProcessing,
    } = useForm({
        notify_requests: user.settings?.notify_requests ?? true,
        notify_helpme: user.settings?.notify_helpme ?? true,
        notify_events: user.settings?.notify_events ?? true,
        notify_community: user.settings?.notify_community ?? true,
    });

    const handleNotifSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putNotif('/settings/notifications');
    };

    // Delete Account Form
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: deleteAcc,
        processing: deleteProcessing,
        errors: deleteErrors,
    } = useForm({
        password: '',
    });

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('Are you ABSOLUTELY sure you want to permanently delete your BloodLink account? This cannot be undone.')) {
            deleteAcc('/settings/account');
        }
    };

    const tabs = [
        { id: 'account', label: 'Account Profile', icon: UserIcon },
        { id: 'security', label: 'Password & Security', icon: Lock },
        { id: 'privacy', label: 'Privacy & Sharing', icon: Shield },
        { id: 'appearance', label: 'Theme & Appearance', icon: Sun },
        { id: 'notifications', label: 'Notification Alerts', icon: Bell },
        { id: 'danger', label: 'Danger Zone', icon: Trash2 },
    ];

    return (
        <AppLayout title="Account Settings">
            <Head title="Account Settings - BloodLink" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                        <Settings className="w-6 h-6 text-rose-600" />
                        Settings & Preferences
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Manage your credentials, Philippine location, donor privacy parameters, and notifications.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Settings Sidebar Tabs */}
                    <aside className="w-full md:w-64 shrink-0 space-y-1">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-xs space-y-1">
                            {tabs.map((t) => {
                                const Icon = t.icon;
                                const isActive = activeTab === t.id;
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setActiveTab(t.id as any)}
                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                                            isActive
                                                ? t.id === 'danger'
                                                    ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                                                    : 'bg-rose-600 text-white shadow-xs'
                                                : t.id === 'danger'
                                                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Active Tab Panel */}
                    <div className="flex-1 min-w-0">
                        {/* 1. Account Details */}
                        {activeTab === 'account' && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Personal & Medical Identification Info
                                </h2>

                                <form onSubmit={handleAccountSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={accountData.first_name}
                                                onChange={(e) => setAccountData('first_name', e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                                required
                                            />
                                            {accountErrors.first_name && <p className="text-xs text-rose-500 mt-1">{accountErrors.first_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={accountData.last_name}
                                                onChange={(e) => setAccountData('last_name', e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={accountData.email}
                                                onChange={(e) => setAccountData('email', e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                                required
                                            />
                                            {accountErrors.email && <p className="text-xs text-rose-500 mt-1">{accountErrors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                                Contact Phone *
                                            </label>
                                            <input
                                                type="text"
                                                value={accountData.phone}
                                                onChange={(e) => setAccountData('phone', e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                                required
                                            />
                                            {accountErrors.phone && <p className="text-xs text-rose-500 mt-1">{accountErrors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                                Blood Type *
                                            </label>
                                            <select
                                                value={accountData.blood_type}
                                                onChange={(e) => setAccountData('blood_type', e.target.value as any)}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 font-bold text-rose-600"
                                            >
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
                                    </div>

                                    {/* Location cascading selector */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            Philippine Residence Location
                                        </label>
                                        <CascadingLocationSelect
                                            provinces={provinces}
                                            selectedProvinceId={accountData.province_id ? Number(accountData.province_id) : null}
                                            selectedCityId={accountData.city_id ? Number(accountData.city_id) : null}
                                            selectedBarangayId={accountData.barangay_id ? Number(accountData.barangay_id) : null}
                                            onProvinceChange={(id) => setAccountData('province_id', id || '')}
                                            onCityChange={(id) => setAccountData('city_id', id || '')}
                                            onBarangayChange={(id) => setAccountData('barangay_id', id || '')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                            Street Address / Building
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 123 Rizal Ave, Apt 4"
                                            value={accountData.address}
                                            onChange={(e) => setAccountData('address', e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                            Bio / Personal Notes
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell other members about yourself or your donation history..."
                                            value={accountData.bio}
                                            onChange={(e) => setAccountData('bio', e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <button
                                            type="submit"
                                            disabled={accountProcessing}
                                            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            <Save className="w-4 h-4" />
                                            {accountProcessing ? 'Saving...' : 'Update Account'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 2. Security */}
                        {activeTab === 'security' && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Change Password & Authentication Security
                                </h2>

                                <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                            Current Password *
                                        </label>
                                        <input
                                            type="password"
                                            value={securityData.current_password}
                                            onChange={(e) => setSecurityData('current_password', e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                            required
                                        />
                                        {securityErrors.current_password && (
                                            <p className="text-xs text-rose-500 mt-1">{securityErrors.current_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <PasswordInputWithToggle
                                            label="New Password"
                                            value={securityData.password}
                                            onChange={(e) => setSecurityData('password', e.target.value)}
                                            showStrengthMeter={true}
                                            error={securityErrors.password}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                            Confirm New Password *
                                        </label>
                                        <input
                                            type="password"
                                            value={securityData.password_confirmation}
                                            onChange={(e) => setSecurityData('password_confirmation', e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                            required
                                        />
                                    </div>

                                    <div className="pt-3">
                                        <button
                                            type="submit"
                                            disabled={securityProcessing}
                                            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50"
                                        >
                                            {securityProcessing ? 'Saving...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 3. Privacy */}
                        {activeTab === 'privacy' && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Privacy & Coordination Controls
                                </h2>

                                <form onSubmit={handlePrivacySubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        {/* Show phone toggle */}
                                        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                            <div>
                                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                    Public Phone Number
                                                </h3>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    Allow prospective emergency patients to see your direct phone number without sending a formal in-app request first.
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={privacyData.show_phone}
                                                onChange={(e) => setPrivacyData('show_phone', e.target.checked)}
                                                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 mt-1 cursor-pointer"
                                            />
                                        </div>

                                        {/* Location privacy level */}
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Location Privacy Precision
                                            </h3>
                                            <p className="text-xs text-zinc-500">
                                                Controls how specifically your geographic location is displayed on public search maps.
                                            </p>
                                            <select
                                                value={privacyData.location_privacy}
                                                onChange={(e) => setPrivacyData('location_privacy', e.target.value as any)}
                                                className="w-full text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2"
                                            >
                                                <option value="approximate">Approximate (Randomized within 2-3km) - Recommended</option>
                                                <option value="barangay">Barangay Level Only</option>
                                                <option value="city">City / Municipality Level Only</option>
                                                <option value="exact">Exact Geolocation</option>
                                                <option value="hidden">Hide Location on Maps</option>
                                            </select>
                                        </div>

                                        {/* Profile visibility */}
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Profile Visibility
                                            </h3>
                                            <select
                                                value={privacyData.profile_visibility}
                                                onChange={(e) => setPrivacyData('profile_visibility', e.target.value as any)}
                                                className="w-full text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2"
                                            >
                                                <option value="users_only">Registered BloodLink Members Only</option>
                                                <option value="public">Public (Visible to guests)</option>
                                                <option value="hidden">Private (Only you and admins)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <button
                                            type="submit"
                                            disabled={privacyProcessing}
                                            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50"
                                        >
                                            {privacyProcessing ? 'Saving...' : 'Save Privacy Settings'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 4. Appearance */}
                        {activeTab === 'appearance' && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <div>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        Appearance & Display Theme
                                    </h2>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Choose your preferred color theme across the BloodLink application.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleAppearanceSubmit('light')}
                                        className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between h-32 ${
                                            appearanceData.theme === 'light'
                                                ? 'border-rose-600 bg-rose-50/30 dark:bg-rose-950/20'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        <Sun className="w-6 h-6 text-amber-500" />
                                        <div>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                                                Light Theme
                                            </span>
                                            <span className="text-[11px] text-zinc-400">Clean white presentation</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAppearanceSubmit('dark')}
                                        className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between h-32 ${
                                            appearanceData.theme === 'dark'
                                                ? 'border-rose-600 bg-rose-50/30 dark:bg-rose-950/20'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        <Moon className="w-6 h-6 text-indigo-400" />
                                        <div>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                                                Dark Theme
                                            </span>
                                            <span className="text-[11px] text-zinc-400">Comfortable in low light</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAppearanceSubmit('system')}
                                        className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between h-32 ${
                                            appearanceData.theme === 'system'
                                                ? 'border-rose-600 bg-rose-50/30 dark:bg-rose-950/20'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        <Settings className="w-6 h-6 text-zinc-400" />
                                        <div>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                                                System Default
                                            </span>
                                            <span className="text-[11px] text-zinc-400">Sync with device settings</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 5. Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Notification Alert Preferences
                                </h2>

                                <form onSubmit={handleNotifSubmit} className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Assistance Requests
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Receive immediate alerts when a patient requests blood coordination.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifData.notify_requests}
                                            onChange={(e) => setNotifData('notify_requests', e.target.checked)}
                                            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Emergency HelpMe Posts
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Notify when critical emergencies occur matching your blood type.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifData.notify_helpme}
                                            onChange={(e) => setNotifData('notify_helpme', e.target.checked)}
                                            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Blood Drives & Events
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Receive alerts for upcoming local Red Cross and hospital donation campaigns.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifData.notify_events}
                                            onChange={(e) => setNotifData('notify_events', e.target.checked)}
                                            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                Community Discussions
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Notify on comments and likes on your shared stories.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifData.notify_community}
                                            onChange={(e) => setNotifData('notify_community', e.target.checked)}
                                            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <button
                                            type="submit"
                                            disabled={notifProcessing}
                                            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50"
                                        >
                                            {notifProcessing ? 'Saving...' : 'Save Notification Preferences'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 6. Danger Zone */}
                        {activeTab === 'danger' && (
                            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-base font-black text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Danger Zone: Delete Account
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        Once your account is deleted, your donor card, records, and history will be permanently wiped.
                                    </p>
                                </div>

                                <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                            Confirm Password to Delete Account *
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter your current password"
                                            value={deleteData.password}
                                            onChange={(e) => setDeleteData('password', e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        {deleteErrors.password && (
                                            <p className="text-xs text-red-500 mt-1">{deleteErrors.password}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={deleteProcessing}
                                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-600 text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
                                    >
                                        {deleteProcessing ? 'Deleting...' : 'Permanently Delete My Account'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
