export default function RegisterLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F5EDD4" }}
    >
      <div className="text-center">
        <svg
          className="w-10 h-10 animate-spin mx-auto mb-4"
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
          Loading Registration
        </p>
      </div>
    </div>
  );
}
