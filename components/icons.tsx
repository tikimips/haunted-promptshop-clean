// components/icons.tsx
'use client';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function HeartOutline({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M20.84 4.61c-1.54-1.4-3.97-1.4-5.5 0L12 7.35 8.66 4.61c-1.53-1.4-3.96-1.4-5.5 0-1.8 1.64-1.88 4.57-.2 6.29L12 21.35l9.04-10.45c1.68-1.72 1.6-4.65-.2-6.29z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartSolid({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M20.84 4.61c-1.54-1.4-3.97-1.4-5.5 0L12 7.35 8.66 4.61c-1.53-1.4-3.96-1.4-5.5 0-1.8 1.64-1.88 4.57-.2 6.29L12 21.35l9.04-10.45c1.68-1.72 1.6-4.65-.2-6.29z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ClipboardIcon({ size = 18, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function BookmarkPlusIcon({ size = 18, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M12 7v6M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
