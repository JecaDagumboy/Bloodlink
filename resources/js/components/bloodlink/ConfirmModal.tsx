import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${danger ? 'bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'}`}>
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {title}
                        </h3>
                        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-xs transition flex items-center gap-1.5 ${
                            danger
                                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                                : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                        } disabled:opacity-50`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

