import { Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

function InstagramIcon({ className = 'size-5' }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function FacebookIcon({ className = 'size-5' }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.676 5H18V0h-3.808C10.59 0 9 1.583 9 4.615V8z" />
        </svg>
    );
}

function TelegramIcon({ className = 'size-5' }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}

function XIcon({ className = 'size-5' }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function TikTokIcon({ className = 'size-5' }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.33 0 .64.06.94.16V9.45a6.37 6.37 0 0 0-.94-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 3.76.92v-3.45a4.8 4.8 0 0 1-.03.51z" />
        </svg>
    );
}

export default function SiteFooter() {
    const { clinic } = usePage().props;
    const year = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Instagram',
            href: clinic.social?.instagram || 'https://instagram.com',
            icon: InstagramIcon,
        },
        {
            name: 'Facebook',
            href: clinic.social?.facebook || 'https://facebook.com',
            icon: FacebookIcon,
        },
        {
            name: 'TikTok',
            href: clinic.social?.tiktok || 'https://tiktok.com/@luminawellness',
            icon: TikTokIcon,
        },
        {
            name: 'Telegram',
            href: clinic.social?.telegram || 'https://t.me/LuminaWellnessBot',
            icon: TelegramIcon,
        },
        {
            name: 'X (Twitter)',
            href: clinic.social?.x || 'https://x.com',
            icon: XIcon,
        },
    ];

    const quickLinks = [
        { label: 'Home', href: '/' },
        { label: 'Our Services', href: '/services' },
        { label: 'Philosophy & Team', href: '/philosophy' },
        { label: 'Help & FAQ', href: '/faq' },
        { label: 'Request Appointment', href: '/contact' },
        { label: 'Patient Portal', href: '/login' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Accessibility', href: '#' },
        { label: 'Admin Login', href: '/login' },
    ];

    return (
        <footer className="relative isolate overflow-hidden bg-gradient-to-br from-[#08221a] via-[#0d3c30] to-[#0b2b3a] text-white border-t border-emerald-500/20">
            {/* Ambient Multi-Color Gradient Mesh: Light Green + White Glow + Blue + Dark Green */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
            >
                {/* Light Green / Mint Aurora Orb */}
                <div className="absolute -top-32 -left-20 size-[32rem] rounded-full bg-[#86efac]/20 blur-[100px] mix-blend-screen" />

                {/* Sky Blue Aurora Orb */}
                <div className="absolute top-10 right-0 size-[36rem] rounded-full bg-[#38bdf8]/20 blur-[120px] mix-blend-screen" />

                {/* Soft White Luminous Core Highlight */}
                <div className="absolute -bottom-20 left-1/3 size-[28rem] rounded-full bg-white/15 blur-[90px] mix-blend-overlay" />

                {/* Cyan / Teal Deep Blend */}
                <div className="absolute bottom-0 right-1/4 size-[24rem] rounded-full bg-[#2dd4bf]/20 blur-[110px] mix-blend-screen" />
            </div>

            <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-10 space-y-12">
                {/* 4-Column Detailed Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Col 1: Brand, Tagline & Social Media (4 cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <span className="size-3.5 rounded-full bg-[#86efac] shadow-sm shadow-[#86efac]/50 group-hover:scale-125 transition-transform" />
                            <span className="text-white text-2xl font-bold tracking-tight">
                                {clinic.name || 'Lumina Wellness'}
                            </span>
                        </Link>

                        <p className="text-[#e2f3ec]/85 text-sm leading-relaxed max-w-sm">
                            {clinic.description ||
                                'Dedicated to Human-Centric Care. Holistic, human-centered medical care blending clinical excellence with domestic comfort.'}
                        </p>

                        {/* Social Media Links with dynamic URLs from backend */}
                        <div className="pt-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#a7f3d0] mb-3">
                                Connect With Us
                            </p>
                            <div className="flex items-center gap-3">
                                {socialLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={item.name}
                                            className="size-10 rounded-full bg-white/10 hover:bg-white border border-white/20 hover:border-white flex items-center justify-center text-white hover:text-[#08221a] transition-all duration-200 shadow-sm hover:scale-110 backdrop-blur-md"
                                        >
                                            <Icon className="size-4.5" />
                                            <span className="sr-only">{item.name}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Quick Links (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#a7f3d0]">
                            Explore & Care
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[#e2f3ec]/80 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Detailed Clinic Location & Contacts (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#7dd3fc]">
                            Clinic Details
                        </h4>
                        <ul className="space-y-3 text-sm text-[#e2f3ec]/85">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="size-4.5 text-[#86efac] shrink-0 mt-0.5" />
                                <span>{clinic.address || '123 Tranquil Lane, Portland, OR 97204'}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="size-4.5 text-[#86efac] shrink-0" />
                                <a
                                    href={clinic.phoneHref || `tel:${clinic.phone || '+15035550199'}`}
                                    className="hover:text-white font-medium transition-colors text-[#bae6fd]"
                                >
                                    {clinic.phone || '(503) 555-0199'}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="size-4.5 text-[#86efac] shrink-0" />
                                <a
                                    href={`mailto:${clinic.email || 'care@luminawellness.com'}`}
                                    className="hover:text-white font-medium transition-colors text-[#bae6fd]"
                                >
                                    {clinic.email || 'care@luminawellness.com'}
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Clock className="size-4.5 text-[#86efac] shrink-0 mt-0.5" />
                                <span className="text-xs">
                                    {clinic.hours || 'Mon – Fri: 9:00 AM – 6:00 PM (Sat & Sun Closed)'}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Telegram Live Chat CTA (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#38bdf8]">
                            Direct Support
                        </h4>
                        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 shadow-lg space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#86efac]">
                                <TelegramIcon className="size-4 text-[#38bdf8]" />
                                <span>Telegram Desk</span>
                            </div>
                            <p className="text-[11px] text-[#e2f3ec]/90 leading-relaxed">
                                Get immediate answers and schedule consultations.
                            </p>
                            <a
                                href={clinic.social?.telegram || 'https://t.me/LuminaWellnessBot'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg bg-white/90 py-2 px-3 text-xs font-bold text-[#08221a] hover:bg-white transition-all shadow-sm hover:scale-105"
                            >
                                <span>Open Telegram</span>
                                <ArrowUpRight className="size-3.5 text-[#08221a]" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e2f3ec]/70">
                    <p>
                        © {year} {clinic.name || 'Lumina Wellness'}. {clinic.tagline || 'Dedicated to Human-Centric Care.'}
                    </p>

                    <ul className="flex flex-wrap items-center gap-6">
                        {legalLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
