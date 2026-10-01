import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppLayout } from '@/layouts/AppLayout';
import { Province } from '@/types/bloodlink';
import { CascadingLocationSelect } from '@/components/bloodlink/CascadingLocationSelect';
import {
    Flame,
    Building2,
    Calendar,
    Phone,
    Mail,
    Upload,
    ArrowLeft,
    AlertCircle,
    Info,
} from 'lucide-react';

interface HelpmeCreateProps {
    provinces: Province[];
}

export default function HelpmeCreate({ provinces = [] }: HelpmeCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        blood_type_needed: 'O+',
        units_needed: 1,
        urgency: 'critical',
        needed_date: new Date().toISOString().split('T')[0],
        hospital_name: '',
        province_id: '' as string | number,
        city_id: '' as string | number,
        barangay_id: '' as string | number,
        location_name: '',
        contact_number: '',
        contact_email: '',
        description: '',
        photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/helpme');
    };

    return (
        <AppLayout title="Post Emergency HelpMe Request">
            <Head title="Post Emergency Blood Request - BloodLink" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Link
                        href="/helpme"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to HelpMe Board
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold shadow-xs">
                            <Flame className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                                Post HelpMe Emergency Blood Call
                            </h1>
                            <p className="text-xs text-zinc-500">
                                Broadcast an urgent call for blood assistance across our verified donor network.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Call Title / Headline *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Urgent Need: 3 bags of O+ Blood for Dengue Patient at PGH"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                required
                            />
                            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Blood Type Needed *
                                </label>
                                <select
                                    value={data.blood_type_needed}
                                    onChange={(e) => setData('blood_type_needed', e.target.value as any)}
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

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Bags / Units Needed *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={data.units_needed}
                                    onChange={(e) => setData('units_needed', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Urgency Level *
                                </label>
                                <select
                                    value={data.urgency}
                                    onChange={(e) => setData('urgency', e.target.value as any)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                                >
                                    <option value="critical">Critical (Immediate / ICU)</option>
                                    <option value="urgent">Urgent (Within 24 Hours)</option>
                                    <option value="moderate">Moderate (Within 3 Days)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Hospital / Facility Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Philippine General Hospital, Manila"
                                    value={data.hospital_name}
                                    onChange={(e) => setData('hospital_name', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.hospital_name && <p className="text-xs text-rose-500 mt-1">{errors.hospital_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Needed Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.needed_date}
                                    onChange={(e) => setData('needed_date', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>
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

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Contact Phone Number *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 0917-123-4567"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                {errors.contact_number && <p className="text-xs text-rose-500 mt-1">{errors.contact_number}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Contact Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    placeholder="e.g. family.contact@email.com"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Situation Description & Hospital Instructions *
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Explain the medical situation (e.g. upcoming surgery, leukemia treatment, trauma) and where prospective donors should report (e.g. PGH Blood Bank 2nd Floor, Look for Nurse Ramos)..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                                required
                            />
                            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                        </div>

                        {/* Photo / Hospital Slip */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                Hospital Requisition Slip / Doctor's Request (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('photo', e.target.files[0]);
                                    }
                                }}
                                className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Link
                                href="/helpme"
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition disabled:opacity-50"
                            >
                                {processing ? 'Publishing...' : 'Publish Emergency Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
