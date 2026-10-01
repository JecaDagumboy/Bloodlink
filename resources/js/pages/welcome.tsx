import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/bloodlink';
import {
    HeartHandshake,
    Search,
    ShieldCheck,
    MapPin,
    Flame,
    Calendar,
    Users,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Hospital,
    PhoneCall,
    Sparkles,
} from 'lucide-react';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { MedicalDisclaimerBanner } from '@/components/bloodlink/MedicalDisclaimerBanner';

export default function Welcome() {
    const { auth } = usePage<SharedProps>().props;
    const user = auth?.user;

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const compatibility = [
        { type: 'O-', giveTo: 'All Blood Types (Universal Donor)', receiveFrom: 'O-' },
        { type: 'O+', giveTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-' },
        { type: 'A-', giveTo: 'A+, A-, AB+, AB-', receiveFrom: 'A-, O-' },
        { type: 'A+', giveTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-' },
        { type: 'B-', giveTo: 'B+, B-, AB+, AB-', receiveFrom: 'B-, O-' },
        { type: 'B+', giveTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-' },
        { type: 'AB-', giveTo: 'AB+, AB-', receiveFrom: 'AB-, A-, B-, O-' },
        { type: 'AB+', giveTo: 'AB+ only', receiveFrom: 'All Blood Types (Universal Recipient)' },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
            <Head title="BloodLink Philippines — Verified Blood Assistance & Donor Network" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
                                Blood<span className="text-rose-600">Link</span>
                            </span>
                            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                Philippines
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition"
                                >
                                    Register Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Medical Disclaimer Banner at Top */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                <MedicalDisclaimerBanner compact />
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Nationwide Philippine Blood Assistance Platform</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-zinc-950 dark:text-white">
                                Connecting Patients With{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-rose-700">
                                    Verified Donors
                                </span>{' '}
                                Across the Philippines.
                            </h1>

                            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                When seconds count, BloodLink connects families in need with verified volunteer donors and official blood bank drives from Metro Manila to Cebu, Davao, and nationwide.
                            </p>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href="/donors"
                                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-600/25 transition flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Find Donors Nearby
                                </Link>
                                <Link
                                    href="/helpme"
                                    className="px-6 py-3.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2"
                                >
                                    <Flame className="w-4 h-4 text-red-500" />
                                    Emergency HelpMe Board
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl shadow-xs transition"
                                >
                                    Become a Donor
                                </Link>
                            </div>

                            {/* Quick Stats Banner */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-left">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-rose-600">8 Types</p>
                                    <p className="text-xs text-zinc-500">Universal & Rare Groups</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">100%</p>
                                    <p className="text-xs text-zinc-500">Voluntary Coordination</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-600">Nationwide</p>
                                    <p className="text-xs text-zinc-500">Luzon, Visayas, Mindanao</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Blood Types & Safety Preview Card */}
                        <div className="lg:col-span-5">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-lg text-rose-600">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                                                Verified Donor Network
                                            </h3>
                                            <p className="text-xs text-zinc-500">Philippine Blood Coordination</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        Active
                                    </span>
                                </div>

                                {/* Blood Type Selector Pills */}
                                <div>
                                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2.5">
                                        Find donors by blood type:
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {bloodTypes.map((type) => (
                                            <Link
                                                key={type}
                                                href={`/donors?blood_type=${encodeURIComponent(type)}`}
                                                className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/40 border border-zinc-200 dark:border-zinc-700 rounded-xl text-center group transition"
                                            >
                                                <span className="block font-black text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 transition">
                                                    {type}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 group-hover:text-rose-500">
                                                    Search
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Safety Principle Callout */}
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <span>BloodLink Safety & Ethical Rule</span>
                                    </div>
                                    <p className="leading-relaxed text-[11px]">
                                        BloodLink donor cards are for <strong>coordination and availability</strong>, NOT identity transfer. BloodLink strictly prohibits impersonation. All blood typing, crossmatching, and transfusions must take place under authorized hospital supervision.
                                    </p>
                                </div>

                                <Link
                                    href="/donors"
                                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl text-center block shadow-xs transition"
                                >
                                    Explore Nearby Donors on Map
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How BloodLink Works Section */}
            <section className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                            Transparent Workflow
                        </span>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                            How Blood Coordination Works on BloodLink
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            A secure, community-first pathway connecting donors with patients requiring blood products.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-black text-base flex items-center justify-center">
                                1
                            </div>
                            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                                Verified Donor Registry
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Donors register with their blood type and Philippine address, toggle their availability, and submit verification documents to administrators.
                            </p>
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-black text-base flex items-center justify-center">
                                2
                            </div>
                            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                                Geographic Search
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Search donors by blood group and distance radius (5km to 100km) nationwide across Philippine provinces, cities, and barangays.
                            </p>
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-black text-base flex items-center justify-center">
                                3
                            </div>
                            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                                Coordination Request
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Send a coordination request specifying needed units, date, and hospital. The donor receives an in-app alert to accept or decline.
                            </p>
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-black text-base flex items-center justify-center">
                                4
                            </div>
                            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                                Hospital Testing & Donation
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Upon acceptance, contact info is shared. Both parties proceed to the authorized hospital blood bank for official screening and donation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blood Type Compatibility Reference */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                            Blood Compatibility Chart
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500">
                            General informational compatibility reference. Final clinical crossmatching is performed by hospital laboratories.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                                    <th className="p-4">Blood Group</th>
                                    <th className="p-4">Can Donate Red Cells To</th>
                                    <th className="p-4">Can Receive Red Cells From</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {compatibility.map((row) => (
                                    <tr key={row.type} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition">
                                        <td className="p-4 font-bold">
                                            <BloodTypeBadge bloodType={row.type} size="md" showTag />
                                        </td>
                                        <td className="p-4 text-zinc-700 dark:text-zinc-300 font-medium">
                                            {row.giveTo}
                                        </td>
                                        <td className="p-4 text-zinc-600 dark:text-zinc-400">
                                            {row.receiveFrom}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/donors?blood_type=${encodeURIComponent(row.type)}`}
                                                className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-600 hover:text-white rounded-lg transition"
                                            >
                                                Find Donors
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Call to Action Footer Section */}
            <section className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Be the reason someone smiles today.
                    </h2>
                    <p className="text-base text-rose-100 max-w-2xl mx-auto leading-relaxed">
                        Join hundreds of verified donors across the Philippines who make themselves available for emergency blood coordination.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link
                            href="/register"
                            className="px-6 py-3.5 bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm rounded-xl shadow-lg transition"
                        >
                            Register as a Volunteer Donor
                        </Link>
                        <Link
                            href="/donors"
                            className="px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white border border-rose-400/40 font-bold text-sm rounded-xl transition"
                        >
                            Search Donors in Your City
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

