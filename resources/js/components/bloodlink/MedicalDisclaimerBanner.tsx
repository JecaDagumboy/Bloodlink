import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
    dismissible?: boolean;
    compact?: boolean;
}

export function MedicalDisclaimerBanner({ dismissible = false, compact = false }: MedicalDisclaimerBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) {
        return null;
    }

    if (compact) {
        return (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-3 rounded-r-md text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <span className="font-semibold">Medical Safety Notice:</span> BloodLink coordinates donor connections only. Official blood testing, compatibility, crossmatching, and release must be performed by authorized hospital or blood bank professionals.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 shadow-xs relative">
            <div className="flex items-start gap-3.5">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-6">
                    <h4 className="text-sm font-semibold text-rose-950 dark:text-rose-200 flex items-center gap-2">
                        Important Medical Disclaimer & Donor Coordination Safety
                    </h4>
                    <p className="mt-1 text-xs text-rose-900/80 dark:text-rose-300/80 leading-relaxed">
                        BloodLink is a coordination platform and does not replace professional medical advice, hospital procedures, blood-bank verification, blood typing, crossmatching, or medical eligibility assessment. Blood donation and transfusion decisions must be handled by qualified medical professionals and authorized facilities.
                    </p>
                    <p className="mt-1.5 text-xs text-rose-800 dark:text-rose-400 font-medium">
                        • Blood cards represent verified donor profiles for coordination, never transfer of personal medical identity.
                    </p>
                </div>
                {dismissible && (
                    <button
                        type="button"
                        onClick={() => setDismissed(true)}
                        className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1 transition"
                        title="Dismiss notice"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

