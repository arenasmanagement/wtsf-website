interface PhotoPlaceholderProps {
  label: string;
  description?: string;
  className?: string;
  aspectRatio?: string;
}

export default function PhotoPlaceholder({
  label,
  description,
  className = "",
  aspectRatio = "aspect-video",
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`photo-placeholder w-full ${aspectRatio} ${className}`}
      role="img"
      aria-label={`Photo placeholder: ${label}`}
    >
      <svg
        className="w-8 h-8 mb-2 opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        style={{ color: "#B8901F" }}
      >
        <path
          strokeLinecap="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75A.75.75 0 013.75 9h.75M3.75 9a.75.75 0 01.75-.75h.75M3.75 9v.75M3.75 9.75A.75.75 0 003 9.75"
        />
        <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={1.5} />
      </svg>
      <span className="font-bold">{label}</span>
      {description && (
        <span className="text-xs mt-1 opacity-75 font-normal normal-case tracking-normal" style={{ color: "#8B7355" }}>
          {description}
        </span>
      )}
    </div>
  );
}
