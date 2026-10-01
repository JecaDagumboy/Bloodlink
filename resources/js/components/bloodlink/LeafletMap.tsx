import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DonorCard, BloodEvent, HelpmePost } from '@/types/bloodlink';

interface LeafletMapProps {
    center?: [number, number];
    zoom?: number;
    userLocation?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    donors?: DonorCard[];
    events?: BloodEvent[];
    helpmePosts?: HelpmePost[];
    height?: string;
    onDonorSelect?: (donor: DonorCard) => void;
}

export function LeafletMap({
    center = [14.6091, 121.0223], // Metro Manila center as default
    zoom = 11,
    userLocation,
    donors = [],
    events = [],
    helpmePosts = [],
    height = '480px',
    onDonorSelect,
}: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Determine center
        const initialCenter: [number, number] = userLocation?.latitude && userLocation?.longitude
            ? [userLocation.latitude, userLocation.longitude]
            : center;

        // Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
            center: initialCenter,
            zoom,
            scrollWheelZoom: false,
        });

        mapInstanceRef.current = map;

        // OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | BloodLink PH',
            maxZoom: 19,
        }).addTo(map);

        const markers: L.Marker[] = [];

        // Custom HTML Icons
        const createUserIcon = () =>
            L.divIcon({
                className: 'custom-user-pin',
                html: `<div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-weight: bold; font-size: 11px;">You</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17],
            });

        const createDonorIcon = (bloodType: string) =>
            L.divIcon({
                className: 'custom-donor-pin',
                html: `<div style="background-color: #dc2626; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 8px -1px rgba(0,0,0,0.35); font-weight: 800; font-size: 11px;">${bloodType}</div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
            });

        const createEventIcon = () =>
            L.divIcon({
                className: 'custom-event-pin',
                html: `<div style="background-color: #d97706; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-weight: bold; font-size: 14px;">★</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17],
            });

        // Add user marker
        if (userLocation?.latitude && userLocation?.longitude) {
            const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
                icon: createUserIcon(),
            }).addTo(map);

            userMarker.bindPopup(`
                <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
                    <strong style="color: #1e3a8a; font-size: 14px;">Your Selected Location</strong>
                    <p style="margin: 4px 0 0 0; color: #4b5563;">${userLocation.address || 'Your current location'}</p>
                </div>
            `);

            markers.push(userMarker);
        }

        // Add donor markers
        donors.forEach((donor) => {
            const lat = donor.user?.latitude ?? (donor as any).latitude;
            const lng = donor.user?.longitude ?? (donor as any).longitude;
            const bloodType = donor.blood_type;
            const name = donor.user?.name ?? (donor as any).name ?? 'Verified Donor';
            const distance = (donor as any).distance_km;
            const distanceText = distance ? `${distance} km away` : 'Nearby';
            const locationName = donor.user?.location_string || 'Philippines';

            if (lat && lng) {
                const marker = L.marker([lat, lng], {
                    icon: createDonorIcon(bloodType),
                }).addTo(map);

                marker.bindPopup(`
                    <div style="font-family: inherit; font-size: 13px; min-width: 190px; line-height: 1.4;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <span style="background: #e11d48; color: white; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 12px;">Type ${bloodType}</span>
                            <span style="font-size: 11px; color: #059669; font-weight: 600;">Verified Donor</span>
                        </div>
                        <strong style="font-size: 14px; color: #111827;">${name}</strong>
                        <p style="margin: 3px 0; color: #4b5563; font-size: 12px;">📍 ${locationName}</p>
                        <p style="margin: 3px 0; color: #dc2626; font-size: 12px; font-weight: 600;">📏 ${distanceText}</p>
                        <div style="margin-top: 10px; display: flex; gap: 6px;">
                            <a href="/donors/${donor.id}" style="display: inline-block; background: #dc2626; color: white; padding: 5px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">Request Assistance</a>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #f3f4f6; color: #374151; padding: 5px 10px; border-radius: 6px; text-decoration: none; font-size: 12px;">Directions ↗</a>
                        </div>
                    </div>
                `);

                markers.push(marker);
            }
        });

        // Add blood event markers
        events.forEach((event) => {
            if (event.latitude && event.longitude) {
                const marker = L.marker([event.latitude, event.longitude], {
                    icon: createEventIcon(),
                }).addTo(map);

                marker.bindPopup(`
                    <div style="font-family: inherit; font-size: 13px; min-width: 200px; line-height: 1.4;">
                        <span style="background: #d97706; color: white; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 11px;">Blood Event</span>
                        <h4 style="margin: 6px 0 2px 0; font-size: 14px; font-weight: 700; color: #111827;">${event.title}</h4>
                        <p style="margin: 3px 0; color: #4b5563; font-size: 12px;">📍 ${event.venue}</p>
                        <p style="margin: 3px 0; color: #b45309; font-size: 12px; font-weight: 600;">📅 ${event.event_date} ${event.start_time || ''}</p>
                        <div style="margin-top: 8px;">
                            <a href="/events/${event.id}" style="display: inline-block; background: #d97706; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">View Event Details</a>
                        </div>
                    </div>
                `);

                markers.push(marker);
            }
        });

        // Fit map bounds if there are multiple markers
        if (markers.length > 1) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.15));
        }

        return () => {
            map.remove();
        };
    }, [userLocation, donors, events, helpmePosts]);

    return (
        <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
            <div ref={mapContainerRef} style={{ height, width: '100%' }} />
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs text-[11px] px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> You
                </span>
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> Donors
                </span>
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> Blood Drives
                </span>
            </div>
        </div>
    );
}

