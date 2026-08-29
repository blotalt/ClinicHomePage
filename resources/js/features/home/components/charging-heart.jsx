export default function ChargingHeart({ className = 'size-11' }) {
    return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
            {/* Ambient Pulse Glow Halo */}
            <div
                aria-hidden="true"
                className="absolute inset-0 size-full rounded-full bg-emerald-300/35 blur-lg pointer-events-none animate-heart-glow"
            />

            {/* Base Outlined Heart (Empty / Transparent Glass Container) */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 size-full text-white/40 drop-shadow-xs"
                aria-hidden="true"
            >
                <path
                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(255, 255, 255, 0.08)"
                />
            </svg>

            {/* Charging & Filling Heart (Charges from Down 0% to Up 100% and beats when full) */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative size-full text-white animate-heart-charge"
                aria-hidden="true"
            >
                <path
                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
