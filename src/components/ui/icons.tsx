type IconProps = { className?: string };

export const HomeIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M10.6 3.5a2 2 0 0 1 2.8 0l7 6.4c.4.4.6.9.6 1.5V19a2 2 0 0 1-2 2h-3.5a1 1 0 0 1-1-1v-4.5h-5V20a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-7.6c0-.6.2-1.1.6-1.5z" />
  </svg>
);

export const PlayIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.8 6.2a.8.8 0 0 0-1.2.7v6.2c0 .6.7 1 1.2.7l5.2-3.1a.8.8 0 0 0 0-1.4z"
    />
  </svg>
);

export const GridIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <rect x="3" y="3" width="8" height="8" rx="2.5" />
    <rect x="13" y="3" width="8" height="8" rx="2.5" />
    <rect x="3" y="13" width="8" height="8" rx="2.5" />
    <rect x="13" y="13" width="8" height="8" rx="2.5" />
  </svg>
);
