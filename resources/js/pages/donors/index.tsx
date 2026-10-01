import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import {
    Search,
    MapPin,
    Filter,
    SlidersHorizontal,
    Phone,
    UserCheck,
    AlertCircle,
    ArrowRight,
    Map,
    List,
} from 'lucide-react';
import { BloodTypeBadge } from '@/components/bloodlink/BloodTypeBadge';
import { StatusBadge } from '@/components/bloodlink/StatusBadge';
import { LeafletMap } from '@/components/bloodlink/LeafletMap';
import { CascadingLocationSelect } from '@/components/bloodlink/CascadingLocationSelect';
import { DonorCard, PaginatedData, Province, BloodType } from '@/types/bloodlink';

interface DonorsIndexProps {
    donors: PaginatedData<DonorCard>;
    filters: {
        blood_type: string;
        province_id: string;
        city_id: string;
        barangay_id: string;
        radius_km: string;
        verification_status: string;
        availability: string;
        emergency_ready: boolean;
        lat: number;
        lng: number;
    };
    provinces: Province[];
    userLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
}

export default function DonorsIndex({
    donors,
    filters,
    provinces = [],
    userLocation,
}: DonorsIndexProps) {
    const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');

    const [bloodType, setBloodType] = useState(filters.blood_type || 'all');
    const [provinceId, setProvinceId] = useState(filters.province_id || '');
    const [cityId, setCityId] = useState(filters.city_id || '');
    const [barangayId, setBarangayId] = useState(filters.barangay_id || '');
    const [radiusKm, setRadiusKm] = useState(filters.radius_km || '50');
    const [availability, setAvailability] = useState(filters.availability || 'available');
    const [verificationStatus, setVerificationStatus] = useState(filters.verification_status || 'all');
    const [emergencyReady, setEmergencyReady] = useState(filters.emergency_ready || false);

    const handleApplyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/donors',
            {
                blood_type: bloodType,
                province_id: provinceId,
                city_id: cityId,
                barangay_id: barangayId,
                radius_km: radiusKm,
                availability,
                verification_status: verificationStatus,
                emergency_ready: emergencyReady ? 1 : 0,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setBloodType('all');
        setProvinceId('');
        setCityId('');
        setBarangayId('');
        setRadiusKm('50');
        setAvailability('available');
        setVerificationStatus('all');
        setEmergencyReady(false);
        router.get('/donors');
    };

    const bloodTypeOptions = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <AppLayout title="Find Donors">
            <Head title="Find Nearby Blood Assistance — BloodLink" />

            <div className="space-y-6">
                {/* Header & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                            <Search className="w-6 h-6 text-rose-600" />
                            Find Nearby Blood Assistance
                        </h1>
                        <p className="text-xs text-zinc-500">
                            Search verified volunteer donor cards across Philippine provinces with interactive geographic radius.
                        </p>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode('both')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                viewMode === 'both'
                                    ? 'bg-white dark:bg-zinc-900 text-rose-600 shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                            Split View
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('map')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                viewMode === 'map'
                                    ? 'bg-white dark:bg-zinc-900 text-rose-600 shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                            <Map className="w-3.5 h-3.5" /> Map Only
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-zinc-900 text-rose-600 shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" /> List Only
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                <form
                    onSubmit={handleApplyFilters}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4"
                >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white">
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                            Search & Filter Filters
                        </span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs text-zinc-500 hover:text-rose-600 font-semibold"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Row 1: Blood Type Quick Filter Pills */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Filter by Blood Group
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {bloodTypeOptions.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setBloodType(type)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                        bloodType === type
                                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                            : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-rose-400'
                                    }`}
                                >
                                    {type === 'all' ? 'All Types' : type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Cascading Philippine Locations */}
                    <div className="pt-2">
                        <CascadingLocationSelect
                            provinces={provinces}
                            initialProvinceId={provinceId}
                            initialCityId={cityId}
                            initialBarangayId={barangayId}
                            required={false}
                            onLocationChange={({ provinceId: p, cityId: c, barangayId: b }) => {
                                setProvinceId(String(p));
                                setCityId(String(c));
                                setBarangayId(String(b));
                            }}
                        />
                    </div>

                    {/* Row 3: Radius, Availability, Emergency Ready */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800 items-center">
                        {/* Radius Slider / Select */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Search Radius
                            </label>
                            <select
                                value={radiusKm}
                                onChange={(e) => setRadiusKm(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-rose-500"
                            >
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="25">Within 25 km</option>
                                <option value="50">Within 50 km</option>
                                <option value="100">Within 100 km</option>
                                <option value="9999">Anywhere in Philippines</option>
                            </select>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Availability
                            </label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-rose-500"
                            >
                                <option value="available">Available Now</option>
                                <option value="all">All Donors</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>

                        {/* Emergency Ready Toggle */}
                        <div className="pt-4 sm:pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                <input
                                    type="checkbox"
                                    checked={emergencyReady}
                                    onChange={(e) => setEmergencyReady(e.target.checked)}
                                    className="rounded-sm border-zinc-300 text-rose-600 focus:ring-rose-500"
                                />
                                <span>🚨 Emergency Ready Only</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Apply Filters
                        </button>
                    </div>
                </form>

                {/* Map Display (if both or map mode) */}
                {(viewMode === 'both' || viewMode === 'map') && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-rose-600" />
                                Interactive Philippine Donor Map
                            </h2>
                            <span className="text-xs text-zinc-500">
                                Showing {donors.data.length} mapped donors
                            </span>
                        </div>
                        <LeafletMap
                            userLocation={userLocation}
                            donors={donors.data}
                            height="420px"
                        />
                    </div>
                )}

                {/* Donors Cards List (if both or list mode) */}
                {(viewMode === 'both' || viewMode === 'list') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                                Available Donors ({donors.total})
                            </h2>
                            <span className="text-xs text-zinc-500">
                                Page {donors.current_page} of {donors.last_page}
                            </span>
                        </div>

                        {donors.data.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center mx-auto">
                                    <Search className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                    No donors found matching your criteria
                                </h3>
                                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                    Try expanding your search radius, selecting all blood types, or resetting location filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {donors.data.map((card) => {
                                    const donorName = card.user?.name ?? (card as any).name;
                                    const distance = (card as any).distance_km;
                                    const locationString = card.user?.location_string || 'Philippines';

                                    return (
                                        <div
                                            key={card.id}
                                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:border-rose-400 dark:hover:border-rose-800 transition flex flex-col justify-between space-y-4 group"
                                        >
                                            <div className="space-y-3">
                                                {/* Card Header: Avatar, Name, Verification */}
                                                <div className="flex items-start gap-3.5">
                                                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900 overflow-hidden">
                                                        {card.user?.avatar ? (
                                                            <img
                                                                src={card.user.avatar}
                                                                alt={donorName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-base">
                                                                {donorName ? donorName[0] : 'D'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                                                {donorName}
                                                            </h3>
                                                            <BloodTypeBadge bloodType={card.blood_type} size="sm" />
                                                        </div>
                                                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                                                            📍 {locationString}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Badges & Meta */}
                                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                    <StatusBadge status={card.verification_status} />
                                                    {card.emergency_ready && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                                            🚨 Emergency Ready
                                                        </span>
                                                    )}
                                                    {distance && (
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                            📏 {distance} km away
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Bio / Notes */}
                                                {card.notes && (
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 italic">
                                                        "{card.notes}"
                                                    </p>
                                                )}

                                                <div className="text-[11px] text-zinc-500 space-y-0.5 pt-1">
                                                    <p>• Total Donations: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{card.total_donations_count}</span></p>
                                                    <p>• Preferred Contact: <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">{card.preferred_contact_method}</span></p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                                                <Link
                                                    href={`/donors/${card.id}`}
                                                    className="flex-1 py-2 px-3 text-center bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                                                >
                                                    Request Coordination
                                                </Link>
                                                <Link
                                                    href={`/profile/${card.user_id}`}
                                                    className="py-2 px-3 text-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition"
                                                >
                                                    Profile
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Links */}
                        {donors.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                {donors.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition ${
                                            link.active
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : link.url
                                                ? 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-rose-400'
                                                : 'text-zinc-400 border-zinc-100 dark:border-zinc-800 opacity-50 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

