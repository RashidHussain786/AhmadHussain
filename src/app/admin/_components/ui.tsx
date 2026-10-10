"use client";

import { useCallback, useEffect, useState } from "react";
import type { Localized } from "@/lib/i18n";

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-4 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/** English + Hindi inputs side by side. Fill one or both. */
export function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: Localized | undefined;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  placeholder?: Partial<Localized>;
}) {
  const v = value ?? { en: "", hi: "" };
  const Input = multiline ? "textarea" : "input";
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          aria-label={`${label} (English)`}
          className={`${inputClass} ${multiline ? "min-h-24" : ""}`}
          placeholder={placeholder?.en ?? "English"}
          value={v.en}
          onChange={(e) => onChange({ ...v, en: e.target.value })}
        />
        <Input
          aria-label={`${label} (Hindi)`}
          lang="hi"
          className={`${inputClass} ${multiline ? "min-h-24" : ""}`}
          placeholder={placeholder?.hi ?? "हिंदी"}
          value={v.hi}
          onChange={(e) => onChange({ ...v, hi: e.target.value })}
        />
      </div>
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}) {
  const styles = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "border border-line bg-white text-ink hover:border-brand-200 hover:text-brand-700",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    ghost: "text-muted hover:bg-soft hover:text-ink",
  }[variant];
  return (
    <button
      type="button"
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export type Notice = { type: "success" | "error"; text: string } | null;

/** Small message at the bottom of the screen ("Saved ✓" / errors). */
export function Toast({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  useEffect(() => {
    if (notice?.type !== "success") return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [notice, onClose]);
  if (!notice) return null;
  return (
    <div
      role={notice.type === "error" ? "alert" : "status"}
      className={`fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl sm:bottom-6 ${
        notice.type === "success" ? "bg-ink text-white" : "bg-red-600 text-white"
      }`}
    >
      <span className="flex-1">{notice.text}</span>
      <button type="button" onClick={onClose} aria-label="Close" className="opacity-70 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

export function useNotice() {
  const [notice, setNotice] = useState<Notice>(null);
  const clear = useCallback(() => setNotice(null), []);
  return { notice, setNotice, clear };
}

/** Warn before leaving the page with unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
