import { useId } from "react";

/**
 * Shop logo: "AH" monogram — the A and H share one crossbar.
 * Same drawing as src/app/icon.svg (the browser tab icon).
 */
export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2711c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${id})`} />
      <g fill="none" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 37 L16.5 11 L25 37" />
        <path d="M30.5 11 V37 M40 11 V37" />
        <path d="M11 28 H40" />
      </g>
    </svg>
  );
}
