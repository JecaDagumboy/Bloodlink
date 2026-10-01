import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordInputWithToggleProps {
    id?: string;
    name?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    showStrengthIndicator?: boolean;
    autoComplete?: string;
}

export function PasswordInputWithToggle({
    id,
    name,
    label,
    value,
    onChange,
    placeholder = '••••••••',
    error,
    required = true,
    showStrengthIndicator = false,
    autoComplete,
}: PasswordInputWithToggleProps) {
    const [showPassword, setShowPassword] = useState(false);

    const hasMinLength = value.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const isStrong = hasMinLength && hasLetter && hasNumber;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label htmlFor={id} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            </div>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition p-1"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}

            {showStrengthIndicator && value.length > 0 && (
                <div className="mt-2.5 p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px] mb-1">
                        Password Requirements:
                    </p>
                    <div className="flex items-center gap-1.5">
                        {hasMinLength ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                            <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        )}
                        <span className={hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-zinc-500'}>
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {hasLetter ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                            <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        )}
                        <span className={hasLetter ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-zinc-500'}>
                            Contains letters (a-z, A-Z)
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {hasNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                            <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        )}
                        <span className={hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-zinc-500'}>
                            Contains numbers (0-9)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

