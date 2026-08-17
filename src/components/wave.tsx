interface Props {
  className?: string
}

export function Wave({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1440 64"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 28 C 240 0, 480 56, 720 28 S 1200 56, 1440 28 V64 H0 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AnimatedWave({ className }: Props) {
  return (
    <svg
      viewBox="0 0 2880 64"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 48 C 240 28, 480 68, 720 48 S 1200 68, 1440 48 S 2160 68, 2880 48 V64 H0 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M0 40 C 200 8, 520 72, 720 40 S 1240 72, 1440 40 S 2200 72, 2880 40 V64 H0 Z"
        fill="currentColor"
      />
    </svg>
  )
}
