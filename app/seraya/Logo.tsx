export const LEAF_PATH =
  "M15.5 1C27 12 29.5 27 21 40.5 19 43.6 17.3 46.2 15.5 49 13.7 46.2 12 43.6 10 40.5 1.5 27 4 12 15.5 1Z";

// Seraya mark: a tall seraya leaf whose midrib curves into an S, beside the wordmark.
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size * 0.62} height={size} viewBox="0 0 31 50" aria-hidden="true">
      <path
        d="M15.5 1C27 12 29.5 27 21 40.5 19 43.6 17.3 46.2 15.5 49 13.7 46.2 12 43.6 10 40.5 1.5 27 4 12 15.5 1Z"
        fill="currentColor"
      />
      <path
        d="M20 13c-6.5 0-8.6 4.6-5.6 8.4 2.9 3.7 6.6 5.5 3.7 10.4-2 3.3-6.3 3.7-8.8 1.6"
        fill="none"
        stroke="var(--logo-vein, #f6eeeb)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M15.5 45V49" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">Seraya</span>
    </span>
  );
}
