type IconProps = { className?: string };

export function LogoMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5 21.5 7 12 11.5 2.5 7 12 2.5Z" fill="#8b7df6" />
      <path
        d="M3.6 11.2 12 15.2l8.4-4 1.1.5L12 16.3 2.5 11.7l1.1-.5Z"
        fill="#7c6cf5"
      />
      <path
        d="M3.6 15.4 12 19.4l8.4-4 1.1.5L12 20.5 2.5 15.9l1.1-.5Z"
        fill="#6a5ae0"
      />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function ChevronUpDownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m8 10 4-4 4 4" />
      <path d="m8 14 4 4 4-4" />
    </svg>
  );
}

export function TriangleUpIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2.5 10.5 9.5h-9L6 2.5Z" />
    </svg>
  );
}

/** Calendar-with-lens glyph from the reference layout, reused as a filter toggle. */
export function FilterGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v5" />
      <path d="M4 6.5V18a1.5 1.5 0 0 0 1.5 1.5h6" />
      <path d="M8 3.5v3M16 3.5v3M4 9.5h16" />
      <circle cx="16.5" cy="16" r="2.6" />
      <path d="m18.6 18.2 1.9 1.9" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}
