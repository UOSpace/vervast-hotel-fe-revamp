interface LotusIconProps {
  size?: number;
  className?: string;
}

/**
 * Lotus flower SVG icon – used as the Spa menu item icon.
 * Accepts `size` and `className` props to match @solar-icons/react API.
 */
export function LotusIcon({ size = 24, className = '' }: LotusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Center petal - tall upright */}
      <path d="M12 20 C12 20 8 15 8 10 C8 6.5 10 4 12 3 C14 4 16 6.5 16 10 C16 15 12 20 12 20Z" />
      {/* Left inner petal */}
      <path d="M12 20 C12 20 6 16 5 11 C4.5 8 6 5.5 8.5 5 C9.5 7 10.5 9 11 11 C11.5 14 12 20 12 20Z" />
      {/* Right inner petal */}
      <path d="M12 20 C12 20 18 16 19 11 C19.5 8 18 5.5 15.5 5 C14.5 7 13.5 9 13 11 C12.5 14 12 20 12 20Z" />
      {/* Left outer petal */}
      <path d="M12 20 C12 20 4.5 17 3 12 C2 9 3.5 6.5 6 6.5 C7 8.5 8.5 11 9.5 13.5 C10.5 16 12 20 12 20Z" />
      {/* Right outer petal */}
      <path d="M12 20 C12 20 19.5 17 21 12 C22 9 20.5 6.5 18 6.5 C17 8.5 15.5 11 14.5 13.5 C13.5 16 12 20 12 20Z" />
      {/* Stem */}
      <path d="M12 20 L12 22" />
      {/* Left leaf */}
      <path d="M12 21 C12 21 8 22 6 20 C7 19 9.5 20 12 21Z" />
      {/* Right leaf */}
      <path d="M12 21 C12 21 16 22 18 20 C17 19 14.5 20 12 21Z" />
    </svg>
  );
}
