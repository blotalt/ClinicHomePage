import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { contact, home } from '@/routes';
import { navLinks } from '@/shared/content/site';
import { useCurrentUrl } from '@/shared/hooks/use-current-url';
import { cn } from '@/shared/lib/utils';

export default function SiteHeader() {
    const { isCurrentUrl } = useCurrentUrl();
    const { clinic } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="sticky top-3 sm:top-4 z-50 px-4 sm:px-6 lg:px-8 w-full transition-all duration-300 pointer-events-none">
            <div
                className={cn(
                    'pointer-events-auto mx-auto max-w-7xl flex h-16 sm:h-18 items-center justify-between gap-4 px-6 sm:px-8 rounded-full transition-all duration-300',
                    scrolled
                        ? 'bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg shadow-black/[0.03] ring-1 ring-black/[0.04]'
                        : 'bg-white/25 backdrop-blur-xl border border-white/50 shadow-sm shadow-black/[0.02] hover:bg-white/35',
                )}
            >
                {/* Brand Logo / Name */}
                <Link
                    href={home()}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <span className="size-3 rounded-full bg-[#104838] group-hover:scale-125 transition-transform" />
                    <span className="text-[#104838] text-xl font-bold tracking-tight">
                        {clinic.name || 'Lumina Wellness'}
                    </span>
                </Link>

                {/* Desktop Navigation Links (with Home) */}
                <nav className="hidden items-center gap-1.5 md:flex bg-white/25 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-2xs">
                    {navLinks.map((link) => {
                        const active = isCurrentUrl(link.href);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                                    active
                                        ? 'bg-[#104838] text-white shadow-xs'
                                        : 'text-[#104838]/80 hover:text-[#104838] hover:bg-black/5',
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Action: Book Appointment CTA */}
                <div className="flex items-center gap-3">
                    <Link
                        href={contact()}
                        className="bg-[#104838] hover:bg-[#165a46] inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Book Appointment</span>
                        <CalendarDays className="size-4" aria-hidden="true" />
                    </Link>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden size-10 rounded-full bg-black/5 flex items-center justify-center text-[#104838] hover:bg-black/10 transition-colors"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileOpen && (
                <div className="pointer-events-auto md:hidden mt-2 mx-auto max-w-7xl rounded-3xl bg-white/60 backdrop-blur-3xl border border-white/50 p-5 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
                    {navLinks.map((link) => {
                        const active = isCurrentUrl(link.href);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition-colors',
                                    active
                                        ? 'bg-[#104838] text-white'
                                        : 'text-[#104838] hover:bg-white/40',
                                )}
                            >
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
}
