export default function DashboardLoading() {
  return (
    <div style={{ backgroundColor: "#F5EDD4" }} className="min-h-screen">
      {/* Header skeleton */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-32 rounded mb-2" style={{ backgroundColor: "rgba(212,168,39,0.3)" }} />
          <div className="h-5 w-48 rounded" style={{ backgroundColor: "rgba(245,237,212,0.2)" }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 animate-pulse"
              style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}
            >
              <div className="h-2 w-24 rounded mb-3" style={{ backgroundColor: "#E8DFC8" }} />
              <div className="h-8 w-12 rounded" style={{ backgroundColor: "#E8DFC8" }} />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="flex justify-center py-16">
          <div className="text-center">
            <svg
              className="w-8 h-8 animate-spin mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#2C4A2E" strokeWidth="4" />
              <path className="opacity-75" fill="#2C4A2E" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#8B7355", letterSpacing: "0.2em" }}
            >
              Loading submissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
