import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { HeartHandshake, LogIn, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, Shield, User } from 'lucide-react';
import { MedicalDisclaimerBanner } from '@/components/bloodlink/MedicalDisclaimerBanner';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email: string) => {
        setData({
            email,
            password: 'Password123!',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <Head title="Log In — BloodLink Philippines" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
                        <HeartHandshake className="w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
                        Blood<span className="text-rose-600">Link</span>
                    </span>
                </Link>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Sign in to your account
                </h2>
                <p className="text-xs text-zinc-500">
                    Coordinate blood requests and donor availability safely
                </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    {status && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-medium text-emerald-800 dark:text-emerald-300">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    autoFocus
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                                />
                                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                    Password <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                                />
                                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-sm border-zinc-300 text-rose-600 focus:ring-rose-500"
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">Remember me</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                            Log In
                        </button>
                    </form>

                    {/* Quick Demo Credentials */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center">
                            Demo Quick Sign-In
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => fillDemo('admin@bloodlink.ph')}
                                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1.5 transition"
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admin User
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemo('pedro.reyes@bloodlink.ph')}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center justify-center gap-1.5 transition"
                            >
                                <User className="w-3.5 h-3.5" />
                                Regular User
                            </button>
                        </div>
                    </div>

                    {/* Register link */}
                    <p className="text-center text-xs text-zinc-500">
                        Don't have an account yet?{' '}
                        <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700 underline">
                            Register here
                        </Link>
                    </p>
                </div>

                <div className="mt-6">
                    <MedicalDisclaimerBanner compact />
                </div>
            </div>
        </div>
    );
}

