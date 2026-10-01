import React from 'react';
import { BloodType } from '@/types/bloodlink';

interface BloodTypeBadgeProps {
    bloodType: BloodType | string;
    size?: 'sm' | 'md' | 'lg';
    showTag?: boolean;
}

export function BloodTypeBadge({ bloodType, size = 'md', showTag = false }: BloodTypeBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3.5 py-1.5 font-bold',
    };

    const isUniversalDonor = bloodType === 'O-';
    const isUniversalRecipient = bloodType === 'AB+';

    return (
        <div className="inline-flex items-center gap-1.5">
            <span className={`inline-flex items-center justify-center font-bold rounded-lg border shadow-xs tracking-wider transition ${sizeClasses[size]} bg-rose-600 dark:bg-rose-700 text-white border-rose-700 dark:border-rose-600`}>
                <span className="drop-shadow-xs">{bloodType}</span>
            </span>
            {showTag && isUniversalDonor && (
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
                    Universal Donor
                </span>
            )}
            {showTag && isUniversalRecipient && (
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-800 uppercase tracking-wider">
                    Universal Recipient
                </span>
            )}
        </div>
    );
}

