import { Link } from '@inertiajs/react';
import { ArrowRight, Sprout } from 'lucide-react';
import { contact, philosophy } from '@/routes';
import Prose from '@/shared/components/common/prose';

export default function Hero({ hero = {} }) {
    const image = hero?.image || '/images/home/hero-bg.svg';
    const badge = hero?.badge || 'Human-Centric Care';
    const titleLead = hero?.titleLead || 'Healthcare that feels like';
    const titleAccent = hero?.titleAccent || 'home.';
    const description = hero?.description || '<p>Experience a new standard of personalized medicine. We blend clinical excellence with domestic comfort.</p>';
    const primaryCta = hero?.primaryCta || 'Start Your Journey';
    const secondaryCta = hero?.secondaryCta || 'Our Philosophy';
    const cardTitle = hero?.cardTitle || 'A Sanctuary for Healing';
    const cardSubtitle = hero?.cardSubtitle || 'Designed for calm, clarity & comfort';

    return (
        <section className="relative isolate overflow-hidden">
            <img
                src={image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-10 size-full object-cover"
            />
            {/*
             * Keeps the headline readable over the photo: opaque on the left
             * where the copy sits, clear on the right where the room shows.
             */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/70 to-transparent"
            />

            <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-10 lg:py-36">
                <div className="max-w-2xl">
                    <span className="bg-mint text-brand inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase">
                        {badge}
                    </span>

                    <h1 className="text-ink mt-7 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        {titleLead}{' '}
                        <em className="text-brand italic">
                            {titleAccent}
                        </em>
                    </h1>

                    <Prose
                        html={description}
                        className="text-ink-soft mt-6 max-w-md text-base"
                    />

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link
                            href={contact()}
                            className="bg-brand hover:bg-brand-dark inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-colors"
                        >
                            {primaryCta}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href={philosophy()}
                            className="border-brand/25 text-ink hover:border-brand/50 inline-flex items-center rounded-full border bg-white/80 px-7 py-3.5 text-sm font-medium transition-colors hover:bg-white"
                        >
                            {secondaryCta}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute right-6 bottom-8 hidden items-center gap-3 rounded-2xl bg-white/85 py-3 pr-6 pl-3 shadow-lg backdrop-blur-sm lg:flex">
                <span className="bg-brand flex size-11 items-center justify-center rounded-full">
                    <Sprout className="size-5 text-white" aria-hidden="true" />
                </span>
                <span>
                    <span className="text-ink block text-sm font-semibold">
                        {cardTitle}
                    </span>
                    <span className="text-ink-soft block text-xs">
                        {cardSubtitle}
                    </span>
                </span>
            </div>
        </section>
    );
}
