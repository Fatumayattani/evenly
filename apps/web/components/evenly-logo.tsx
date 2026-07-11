interface EvenlyLogoProps {
  compact?: boolean;
  light?: boolean;
  className?: string;
}

export function EvenlyLogo({
  compact = false,
  light = false,
  className = "",
}: EvenlyLogoProps) {
  const classes = [
    "evenly-logo",
    compact ? "evenly-logo--compact" : "",
    light ? "evenly-logo--light" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="img" aria-label="Evenly">
      <svg
        className="evenly-logo__mark"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <circle className="evenly-logo__coin" cx="32" cy="11" r="10" />

        <text
          className="evenly-logo__currency"
          x="32"
          y="15"
          textAnchor="middle"
        >
          $
        </text>

        <path
          className="evenly-logo__flow"
          d="M32 23v7M32 30H13c-4 0-6 2-6 6v2M32 30h19c4 0 6 2 6 6v2M32 30v8"
        />

        <path
          className="evenly-logo__flow"
          d="m3.5 35 3.5 3.5 3.5-3.5M28.5 35l3.5 3.5 3.5-3.5M53.5 35l3.5 3.5 3.5-3.5"
        />

        <path
          className="evenly-logo__bucket evenly-logo__bucket--one"
          d="M1 42h16v5c0 7-3 12-8 12S1 54 1 47v-5Z"
        />

        <path
          className="evenly-logo__bucket evenly-logo__bucket--two"
          d="M24 42h16v5c0 7-3 12-8 12s-8-5-8-12v-5Z"
        />

        <path
          className="evenly-logo__bucket evenly-logo__bucket--three"
          d="M47 42h16v5c0 7-3 12-8 12s-8-5-8-12v-5Z"
        />
      </svg>

      {!compact && (
        <span className="evenly-logo__wordmark">Evenly</span>
      )}
    </div>
  );
}