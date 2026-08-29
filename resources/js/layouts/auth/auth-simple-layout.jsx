import { Link } from '@inertiajs/react';
import { home } from '@/routes';

export default function AuthSimpleLayout({ children, title, description }) {
    return (
        <div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10 bg-[#faf9f6]/80 overflow-hidden">
            {/* Ambient soft glow background */}
            <div className="absolute top-0 right-0 size-96 rounded-full bg-[#bde8e2]/30 blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 size-96 rounded-full bg-[#eaf4f4]/50 blur-3xl pointer-events-none -z-10" />

            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    {/* Brand Header */}
                    <div className="flex flex-col items-center text-center gap-1.5 mb-2">
                        <Link
                            href={home()}
                            className="text-[#104838] text-2xl sm:text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity"
                        >
                            Lumina Wellness
                        </Link>
                        <p className="text-muted-foreground text-xs font-medium tracking-wide">
                            Dedicated to Human-Centric Care.
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-2xl border border-border/70 p-7 sm:p-9 shadow-xs">
                        {title && (
                            <div className="mb-6">
                                <h1 className="text-xl font-bold text-ink">{title}</h1>
                                {description && (
                                    <p className="text-muted-foreground text-sm mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                        {children}
                    </div>

                    {/* Footer note */}
                    <div className="text-center text-xs text-muted-foreground space-x-3">
                        <Link href="/faq" className="hover:text-[#104838] transition-colors">
                            Need help?
                        </Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-[#104838] transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
