import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { HeartHandshake, UserPlus, Eye, EyeOff, Loader2, Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import { Province } from '@/types/bloodlink';
import { CascadingLocationSelect } from '@/components/bloodlink/CascadingLocationSelect';
import { PasswordInputWithToggle } from '@/components/bloodlink/PasswordInputWithToggle';
import { MedicalDisclaimerBanner } from '@/components/bloodlink/MedicalDisclaimerBanner';

interface RegisterProps {
    provinces: Province[];
}

export default function Register({ provinces = [] }: RegisterProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        gender: 'prefer_not_to_say',
        blood_type: 'O+',
        province_id: '',
        city_id: '',
        barangay_id: '',
        address: '',
        is_donor: true,
        avatar: null as File | null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Head title="Register — BloodLink Philippines" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">
                            Blood<span className="text-rose-600">Link</span>
                        </span>
                    </Link>
                    <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Create Your BloodLink Account
                    </h2>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                        Register to coordinate assistance, find nearby blood groups, or register as a verified volunteer donor.
                    </p>
                </div>

                <MedicalDisclaimerBanner compact />

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Section 1: Personal Details */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Personal Information
                            </h3>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="e.g. Maria"
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    />
                                    {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="e.g. Santos"
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    />
                                    {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="maria.santos@example.com"
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Mobile Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="09171234567"
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    />
                                    <p className="mt-1 text-[11px] text-zinc-400">PH Mobile format: 09XXXXXXXXX</p>
                                    {errors.phone && <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Date of Birth <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    />
                                    {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Sex / Gender <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Blood Information & Donor Status */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Blood Information & Availability
                            </h3>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                        Your Blood Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.blood_type}
                                        onChange={(e) => setData('blood_type', e.target.value)}
                                        required
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="O+">O+ (Common)</option>
                                        <option value="O-">O- (Universal Red Cell Donor)</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+ (Universal Recipient)</option>
                                        <option value="AB-">AB- (Rare)</option>
                                    </select>
                                    {errors.blood_type && <p className="mt-1 text-xs text-red-500">{errors.blood_type}</p>}
                                </div>

                                <div className="pt-4 sm:pt-0">
                                    <label className="flex items-start gap-3 p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_donor}
                                            onChange={(e) => setData('is_donor', e.target.checked)}
                                            className="mt-0.5 rounded-sm border-zinc-300 text-rose-600 focus:ring-rose-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-rose-950 dark:text-rose-200 block">
                                                Register as Available Volunteer Donor
                                            </span>
                                            <span className="text-[11px] text-rose-800/80 dark:text-rose-400 block leading-tight mt-0.5">
                                                Make your donor card discoverable by nearby patients who need coordination. You can toggle this anytime.
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Philippine Location */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Philippine Geographic Location
                            </h3>
                            <p className="mt-1 text-xs text-zinc-500 mb-3">
                                Select your province, city/municipality, and barangay to calculate distance accurately.
                            </p>

                            <CascadingLocationSelect
                                provinces={provinces}
                                initialProvinceId={data.province_id}
                                initialCityId={data.city_id}
                                initialBarangayId={data.barangay_id}
                                onLocationChange={({ provinceId, cityId, barangayId }) => {
                                    setData({
                                        ...data,
                                        province_id: String(provinceId),
                                        city_id: String(cityId),
                                        barangay_id: String(barangayId),
                                    });
                                }}
                                errorProvince={errors.province_id}
                                errorCity={errors.city_id}
                                errorBarangay={errors.barangay_id}
                            />

                            <div className="mt-3">
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    Street / Landmark Address (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="e.g. Unit 402, Katipunan St."
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        {/* Section 4: Security / Password */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Security & Password
                            </h3>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PasswordInputWithToggle
                                    id="password"
                                    label="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    showStrengthIndicator={true}
                                />

                                <PasswordInputWithToggle
                                    id="password_confirmation"
                                    label="Confirm Password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                />
                            </div>
                        </div>

                        {/* Section 5: Profile Photo Upload */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Optional Profile Photo
                            </h3>

                            <div className="mt-3 flex items-center gap-4">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-rose-500"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handleAvatarChange}
                                        className="text-xs text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 cursor-pointer"
                                    />
                                    <p className="text-[11px] text-zinc-400 mt-0.5">JPG, PNG, or WEBP up to 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                Complete Registration
                            </button>

                            <p className="mt-3 text-center text-xs text-zinc-500">
                                Already registered?{' '}
                                <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 underline">
                                    Log in to your account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

