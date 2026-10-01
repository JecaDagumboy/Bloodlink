import React, { useState, useEffect } from 'react';
import { Province, City, Barangay } from '@/types/bloodlink';
import { MapPin, Loader2 } from 'lucide-react';

interface CascadingLocationSelectProps {
    initialProvinceId?: number | string | null;
    initialCityId?: number | string | null;
    initialBarangayId?: number | string | null;
    selectedProvinceId?: number | string | null;
    selectedCityId?: number | string | null;
    selectedBarangayId?: number | string | null;
    provinces: Province[];
    onLocationChange?: (location: {
        provinceId: number | string;
        cityId: number | string;
        barangayId: number | string;
        latitude?: number | null;
        longitude?: number | null;
    }) => void;
    onProvinceChange?: (provinceId: number | string) => void;
    onCityChange?: (cityId: number | string) => void;
    onBarangayChange?: (barangayId: number | string) => void;
    errorProvince?: string;
    errorCity?: string;
    errorBarangay?: string;
    required?: boolean;
}

export function CascadingLocationSelect({
    initialProvinceId,
    initialCityId,
    initialBarangayId,
    selectedProvinceId,
    selectedCityId,
    selectedBarangayId,
    provinces = [],
    onLocationChange,
    onProvinceChange,
    onCityChange,
    onBarangayChange,
    errorProvince,
    errorCity,
    errorBarangay,
    required = true,
}: CascadingLocationSelectProps) {
    const activeProv = selectedProvinceId ?? initialProvinceId ?? '';
    const activeCity = selectedCityId ?? initialCityId ?? '';
    const activeBrgy = selectedBarangayId ?? initialBarangayId ?? '';

    const [provinceId, setProvinceId] = useState<string | number>(activeProv);
    const [cityId, setCityId] = useState<string | number>(activeCity);
    const [barangayId, setBarangayId] = useState<string | number>(activeBrgy);

    const [cities, setCities] = useState<City[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);

    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // Sync state when props change
    useEffect(() => {
        if (activeProv !== '' && activeProv !== null && activeProv !== undefined) {
            setProvinceId(activeProv);
        }
    }, [activeProv]);

    useEffect(() => {
        if (activeCity !== '' && activeCity !== null && activeCity !== undefined) {
            setCityId(activeCity);
        }
    }, [activeCity]);

    useEffect(() => {
        if (activeBrgy !== '' && activeBrgy !== null && activeBrgy !== undefined) {
            setBarangayId(activeBrgy);
        }
    }, [activeBrgy]);

    // When province changes, load cities
    useEffect(() => {
        if (!provinceId) {
            setCities([]);
            return;
        }

        let isMounted = true;
        setLoadingCities(true);

        fetch(`/api/locations/cities?province_id=${provinceId}`)
            .then((res) => res.json())
            .then((data: City[]) => {
                if (isMounted) {
                    setCities(data);
                    setLoadingCities(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoadingCities(false);
            });

        return () => {
            isMounted = false;
        };
    }, [provinceId]);

    // When city changes, load barangays
    useEffect(() => {
        if (!cityId) {
            setBarangays([]);
            return;
        }

        let isMounted = true;
        setLoadingBarangays(true);

        fetch(`/api/locations/barangays?city_id=${cityId}`)
            .then((res) => res.json())
            .then((data: Barangay[]) => {
                if (isMounted) {
                    setBarangays(data);
                    setLoadingBarangays(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoadingBarangays(false);
            });

        return () => {
            isMounted = false;
        };
    }, [cityId]);

    const handleProvinceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setProvinceId(val);
        setCityId('');
        setBarangayId('');
        onProvinceChange?.(val);
        onCityChange?.('');
        onBarangayChange?.('');
        onLocationChange?.({ provinceId: val, cityId: '', barangayId: '' });
    };

    const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCityId(val);
        setBarangayId('');
        onCityChange?.(val);
        onBarangayChange?.('');

        const selectedCity = cities.find((c) => String(c.id) === String(val));
        onLocationChange?.({
            provinceId,
            cityId: val,
            barangayId: '',
            latitude: selectedCity?.latitude,
            longitude: selectedCity?.longitude,
        });
    };

    const handleBarangaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setBarangayId(val);
        onBarangayChange?.(val);

        const selectedBarangay = barangays.find((b) => String(b.id) === String(val));
        const selectedCity = cities.find((c) => String(c.id) === String(cityId));

        onLocationChange?.({
            provinceId,
            cityId,
            barangayId: val,
            latitude: selectedBarangay?.latitude ?? selectedCity?.latitude,
            longitude: selectedBarangay?.longitude ?? selectedCity?.longitude,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Province */}
            <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Province {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    value={provinceId}
                    onChange={handleProvinceSelect}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                            {prov.name}
                        </option>
                    ))}
                </select>
                {errorProvince && <p className="text-xs text-red-500 mt-1">{errorProvince}</p>}
            </div>

            {/* City / Municipality */}
            <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                    City / Municipality {required && <span className="text-red-500">*</span>}
                    {loadingCities && <Loader2 className="w-3 h-3 animate-spin text-rose-500 ml-1" />}
                </label>
                <select
                    value={cityId}
                    onChange={handleCitySelect}
                    disabled={!provinceId || loadingCities}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">
                        {!provinceId ? 'Select Province first' : 'Select City/Municipality'}
                    </option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name} {city.is_city ? '(City)' : ''}
                        </option>
                    ))}
                </select>
                {errorCity && <p className="text-xs text-red-500 mt-1">{errorCity}</p>}
            </div>

            {/* Barangay */}
            <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                    Barangay {required && <span className="text-red-500">*</span>}
                    {loadingBarangays && <Loader2 className="w-3 h-3 animate-spin text-rose-500 ml-1" />}
                </label>
                <select
                    value={barangayId}
                    onChange={handleBarangaySelect}
                    disabled={!cityId || loadingBarangays}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">
                        {!cityId ? 'Select City/Municipality first' : 'Select Barangay'}
                    </option>
                    {barangays.map((brgy) => (
                        <option key={brgy.id} value={brgy.id}>
                            {brgy.name}
                        </option>
                    ))}
                </select>
                {errorBarangay && <p className="text-xs text-red-500 mt-1">{errorBarangay}</p>}
            </div>
        </div>
    );
}
