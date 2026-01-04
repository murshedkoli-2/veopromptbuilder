import React from 'react';
import { cn } from '@/lib/utils';

export function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
            {children}
        </div>
    );
}

export function FormGroup({ label, helperText, children }: { label: string; helperText?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            {children}
            {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
        </div>
    );
}

export function Select({
    options,
    value,
    onChange,
    placeholder = "Select an option..."
}: {
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative group">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:bg-secondary/70 text-foreground cursor-pointer"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

export function Input({
    value,
    onChange,
    placeholder,
    type = "text"
}: {
    value: string | number;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:bg-secondary/70 text-foreground placeholder:text-muted-foreground"
        />
    );
}

export function Textarea({
    value,
    onChange,
    placeholder,
    maxLength = 500
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    maxLength?: number;
}) {
    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={4}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:bg-secondary/70 text-foreground placeholder:text-muted-foreground resize-none"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground uppercase tracking-widest tabular-nums">
                {value.length} / {maxLength}
            </div>
        </div>
    );
}
