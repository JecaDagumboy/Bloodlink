import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { EventType, Province } from '@/types/bloodlink';
import { CascadingLocationSelect } from '@/components/bloodlink/CascadingLocationSelect';
import {
    Calendar,
    Building2,
    MapPin,
    Clock,
    Phone,
    Link as LinkIcon,
    Upload,
    ArrowLeft,
} from 'lucide-react';

interface EventsCreateProps {
    provinces: Province[];
}

export default function EventsCreate({ provinces = [] }: EventsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        organizer: '',
        event_type: 'blood_drive' as EventType,
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        start_time: '08:00 AM',
        end_time: '04:00 PM',
        venue: '',
        province_id: '' as string | number,
        city_id: '' as string | number,
        barangay_id: '' as string | number,
        contact_person: '',
        contact_number: '',
        contact_email: '',
        registration_link: '',
        banner: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events');
    };

    return (
        <AppLayout title="Post Blood Donation Event">
            <Head title="Organize Blood Drive - BloodLink" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Blood Drives
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold shadow-xs">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                Register a Blood Donation Event
                            </h1>
                            <p className="text-xs text-zinc-500">
                                Announce a mobile blood donation drive, hospital collection drive, or advocacy campaign.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Red Cross Metro Manila Mega Blood Drive"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Organizer / Host Institution *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Philippine Red Cross / UST Hospital"
                                    value={data.organizer}
                                    onChange={(e) => setData('organizer', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.organizer && <p className="text-xs text-rose-500 mt-1">{errors.organizer}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Event Category *
                                </label>
                                <select
                                    value={data.event_type}
                                    onChange={(e) => setData('event_type', e.target.value as any)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="blood_drive">Mobile Blood Drive</option>
                                    <option value="hospital_drive">Hospital Blood Campaign</option>
                                    <option value="advocacy">Awareness & Advocacy</option>
                                    <option value="official_announcement">Official Announcement</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Event Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="08:00 AM"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="04:00 PM"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Venue / Specific Address *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Activity Center, SM Megamall, EDSA, Mandaluyong"
                                value={data.venue}
                                onChange={(e) => setData('venue', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                required
                            />
                            {errors.venue && <p className="text-xs text-rose-500 mt-1">{errors.venue}</p>}
                        </div>

                        {/* Location Selectors */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Philippine Geographic Location *
                            </label>
                            <CascadingLocationSelect
                                provinces={provinces}
                                selectedProvinceId={data.province_id ? Number(data.province_id) : null}
                                selectedCityId={data.city_id ? Number(data.city_id) : null}
                                selectedBarangayId={data.barangay_id ? Number(data.barangay_id) : null}
                                onProvinceChange={(id) => setData('province_id', id || '')}
                                onCityChange={(id) => setData('city_id', id || '')}
                                onBarangayChange={(id) => setData('barangay_id', id || '')}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Dr. Ana Santos"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 0917-888-9999"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                External Registration or RSVP Link (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://forms.gle/... or https://redcross.org.ph/..."
                                value={data.registration_link}
                                onChange={(e) => setData('registration_link', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Event Description & Donor Guidelines *
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Explain donor eligibility requirements (e.g. age 18-65, at least 50kg, 6-8 hours sleep), free snacks provided, and any tokens/certificates..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                required
                            />
                            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Link
                                href="/events"
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50"
                            >
                                {processing ? 'Publishing...' : 'Register Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
