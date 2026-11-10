export default function HeartbeatBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Slowly drifting color blobs — kept running on every page */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-blue/25 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-yellow/25 blur-3xl animate-float [animation-delay:4s]" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl animate-float [animation-delay:1s]" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-brand-green/15 blur-3xl animate-float [animation-delay:3s]" />

      {/* Continuous heartbeat line, looping across the width of the screen */}
      <svg
        className="absolute bottom-8 left-0 h-16 w-[200%] text-brand-green/60 animate-heartbeat-scroll"
        viewBox="0 0 400 60"
        fill="none"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,30 40,30 55,10 70,50 85,20 100,30 180,30 195,10 210,50 225,20 240,30 320,30 335,10 350,50 365,20 380,30 400,30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Small pulsing dot for extra life */}
      <div className="absolute right-1/4 top-1/4 h-3 w-3 rounded-full bg-brand-blue/40 animate-heartbeat" />
      <div className="absolute left-1/4 top-2/3 h-2 w-2 rounded-full bg-brand-yellow/50 animate-heartbeat [animation-delay:0.6s]" />
    </div>
  );
}
