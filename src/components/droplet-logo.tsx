interface Props {
  className?: string
}

export function DropletLogo({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cospail-droplet" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9DE6FF" />
          <stop offset="1" stopColor="#66CCFF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5c2.8 3.6 6.5 7.4 6.5 11.3A6.5 6.5 0 0 1 5.5 13.8c0-3.9 3.7-7.7 6.5-11.3Z"
        fill="url(#cospail-droplet)"
      />
      <path
        d="M12 7c1.5 2 3.3 3.7 3.3 5.8a3.3 3.3 0 0 1-6.6 0c0-2.1 1.8-3.8 3.3-5.8Z"
        fill="#FFFFFF"
        opacity="0.55"
      />
    </svg>
  )
}
