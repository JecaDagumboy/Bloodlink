import React, { useState } from 'react';
import { Flag, X, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportableType: 'user' | 'helpme_post' | 'community_post' | 'blood_event';
    reportableId: number;
    title?: string;
}

export function ReportModal({
    isOpen,
    onClose,
    reportableType,
    reportableId,
    title = 'Submit Report',
}: ReportModalProps) {
    const [reason, setReason] = useState<string>('false_information');
    const [details, setDetails] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            '/reports',
            {
                reportable_type: reportableType,
                reportable_id: reportableId,
                reason,
                details,
            },
            {
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                },
                onError: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                        <Flag className="w-5 h-5" />
                        <span>{title}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Reason for Reporting <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        >
                            <option value="false_information">False or Unverified Information</option>
                            <option value="misleading_blood_info">Misleading Blood or Medical Claims</option>
                            <option value="fraud_scam">Fraud, Financial Solicitation, or Scam</option>
                            <option value="abuse">Harassment or Abusive Behavior</option>
                            <option value="spam">Spam or Irrelevant Advertisement</option>
                            <option value="inappropriate_content">Inappropriate Content</option>
                            <option value="other">Other Violation</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Additional Details
                        </label>
                        <textarea
                            rows={3}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Please provide any context to assist moderators in investigating this report..."
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

