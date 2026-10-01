import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { SharedProps } from '@/types/bloodlink';
import {
    HeartHandshake,
    Search,
    Bell,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Users,
    Activity,
    CreditCard,
    FileText,
    Calendar,
    Inbox,
    Moon,
    Sun,
    ChevronDown,
    Flame,
    AlertCircle,
    CheckCircle2,
    Info,
    Check,
} from 'lucide-react';
import { MedicalDisclaimerBanner } from '@/components/bloodlink/MedicalDisclaimerBanner';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
    const { auth, flash, name } = usePage<SharedProps>().props;
    const user = auth.user;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Synchronize flash messages to toast
    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
            const timer = setTimeout(() => setToast(null), 6000);
            return () => clearTimeout(timer);
        } else if (flash.info) {
            setToast({ message: flash.info, type: 'info' });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Handle theme toggle
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme('light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery.trim() });
        }
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const currentPath = window.location.pathname;

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Activity },
        { label: 'Find Donors', href: '/donors', icon: Search },
        { label: 'HelpMe (Emergency)', href: '/helpme', icon: Flame, badge: 'Urgent' },
        { label: 'Requests', href: '/requests', icon: Inbox },
        { label: 'My Blood Card', href: '/my-blood-card', icon: CreditCard },
        { label: 'Community Posts', href: '/posts', icon: FileText },
        { label: 'Blood Events', href: '/events', icon: Calendar },
        { label: 'Notifications', href: '/notifications', icon: Bell, count: user?.unread_notifications_count },
    ];

    const adminNavItems = [
        { label: 'Admin Dashboard', href: '/admin', icon: Shield },
        { label: 'User Directory', href: '/admin/users', icon: Users },
        { label: 'Donor Verifications', href: '/admin/verifications', icon: CheckCircle2 },
        { label: 'HelpMe Moderation', href: '/admin/helpme', icon: Flame },
        { label: 'Community Moderation', href: '/admin/community', icon: FileText },
        { label: 'Events Moderation', href: '/admin/events', icon: Calendar },
        { label: 'System Requests', href: '/admin/requests', icon: Inbox },
        { label: 'Content Reports', href: '/admin/reports', icon: AlertCircle },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Brand & Mobile Hamburger */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
                                    Blood<span className="text-rose-600">Link</span>
                                </span>
                                <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                    PH
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Global Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search donors, HelpMe, events, blood types (e.g. O+)..."
                            className="w-full bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 rounded-full pl-9 pr-4 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white dark:focus:bg-zinc-900 transition"
                        />
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>

                    {/* Right Tools: Notification, Theme, User Dropdown */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title="Toggle light/dark theme"
                            className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                        >
                            <Sun className="w-5 h-5 hidden dark:block text-amber-400" />
                            <Moon className="w-5 h-5 block dark:hidden text-zinc-600" />
                        </button>

                        {/* Notifications */}
                        <Link
                            href="/notifications"
                            className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition relative"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {Boolean(user?.unread_notifications_count && user.unread_notifications_count > 0) && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {user.unread_notifications_count}
                                </span>
                            )}
                        </Link>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-200 dark:border-rose-900">
                                        {user?.first_name ? user.first_name[0] : 'U'}
                                    </div>
                                )}
                                <div className="hidden lg:block text-left">
                                    <p className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                                        {user?.first_name || user?.name}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 font-medium">
                                        {user?.blood_type ? `Type ${user.blood_type}` : 'Member'}
                                    </p>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {userDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 truncate">
                                                {user?.email}
                                            </p>
                                            {user?.is_admin && (
                                                <span className="mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                                    Administrator
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                        >
                                            <User className="w-4 h-4 text-zinc-400" />
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            href="/my-blood-card"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                        >
                                            <CreditCard className="w-4 h-4 text-zinc-400" />
                                            <span>My Blood Card & Availability</span>
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                        >
                                            <Settings className="w-4 h-4 text-zinc-400" />
                                            <span>Account Settings</span>
                                        </Link>

                                        {user?.is_admin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                                            >
                                                <Shield className="w-4 h-4 text-purple-500" />
                                                <span>Admin Portal</span>
                                            </Link>
                                        )}

                                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="font-extrabold text-base text-zinc-900 dark:text-white">
                                Blood<span className="text-rose-600">Link</span> Menu
                            </span>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                                            isActive
                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </div>
                                        {Boolean(item.count && item.count > 0) && (
                                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {item.count}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {user?.is_admin && (
                            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                    Admin Moderation
                                </p>
                                <div className="space-y-1">
                                    {adminNavItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentPath === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                    isActive
                                                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold'
                                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 shrink-0" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Application Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-8">
                {/* Desktop Left Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-6">
                    {/* User Quick Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-rose-500/30"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-base flex items-center justify-center border-2 border-rose-500/20">
                                    {user?.first_name ? user.first_name[0] : 'U'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                    {user?.name}
                                </h3>
                                <p className="text-xs text-zinc-500 truncate">
                                    📍 {user?.location_string || 'Philippines'}
                                </p>
                            </div>
                        </div>

                        {/* Availability Pill */}
                        <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">Donor Status:</span>
                            {user?.donor_card?.is_available ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 font-medium text-zinc-500">
                                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Unavailable
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-xs space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                        isActive
                                            ? 'bg-rose-600 text-white shadow-xs'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </div>
                                    {Boolean(item.count && item.count > 0) && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'}`}>
                                            {item.count}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Admin Section if Admin */}
                    {user?.is_admin && (
                        <div className="bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-3 shadow-xs space-y-1">
                            <div className="px-3 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                                <Shield className="w-3.5 h-3.5" />
                                Admin Management
                            </div>
                            {adminNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                            isActive
                                                ? 'bg-purple-600 text-white font-semibold'
                                                : 'text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Compact Safety Reminder */}
                    <div className="p-3 bg-zinc-100/70 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-[11px] text-zinc-500 space-y-1 leading-relaxed">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Safety Policy:</span> BloodLink donor cards represent willingness to coordinate, never identity transfer. Hospital compatibility testing is always mandatory.
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 space-y-6">
                    {/* Medical Disclaimer Banner */}
                    <MedicalDisclaimerBanner compact />

                    {/* Page Content */}
                    {children}
                </main>
            </div>

            {/* Toast Alerts */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
                    <div className="shrink-0 mt-0.5">
                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                        {toast.message}
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 text-xs text-zinc-500 text-center">
                <div className="max-w-7xl mx-auto px-4 space-y-1.5">
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        BloodLink Philippines — Verified Blood Assistance & Donor Coordination Platform
                    </p>
                    <p className="text-[11px] text-zinc-400 max-w-3xl mx-auto">
                        Notice: BloodLink does not dispense, sell, or medically administer blood products. All transfusions must adhere to Philippine Department of Health and hospital blood-banking protocols.
                    </p>
                </div>
            </footer>
        </div>
    );
}

