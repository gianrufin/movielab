export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Flask body doubling as a reel: the flask neck tapers into a
          circular reel rim with two sprocket holes — one mark, two
          readings, instead of two icons glued together. */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10.5 3.5H15.5"
          stroke="#F4F5F7"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M11.5 3.5V8.8L6.2 18.4C5.5 19.7 6.4 21.3 7.9 21.3H18.1C19.6 21.3 20.5 19.7 19.8 18.4L14.5 8.8V3.5"
          stroke="#F4F5F7"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="15.5" r="4.3" stroke="#5EE6C1" strokeWidth="1.4" />
        <circle cx="13" cy="12.4" r="0.9" fill="#5EE6C1" />
        <circle cx="10.4" cy="17" r="0.9" fill="#5EE6C1" />
        <circle cx="15.6" cy="17" r="0.9" fill="#5EE6C1" />
      </svg>
      <span className="font-display font-semibold text-lg tracking-tight text-ink-100">
        MovieLab
      </span>
    </div>
  );
}
