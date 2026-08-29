import { Link } from '@inertiajs/react';
import { contact } from '@/routes';
import Prose from '@/shared/components/common/prose';

/** The photo-backed card that closes the service grid. */
export default function FeaturedServiceCard({ featured, index = 0 }) {
    return (
        <article
            style={{ animationDelay: `${index * 80}ms` }}
            className="animate-fade-in-up relative isolate flex flex-col justify-end overflow-hidden rounded-3xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#104838]/5"
        >
            <img
                src={featured.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-white/85 to-white/25"
            />

            <div className="p-8 sm:p-9">
                <h2 className="text-ink text-xl font-bold tracking-tight">
                    {featured.title}
                </h2>
                <Prose
                    html={featured.body}
                    className="text-ink-soft mt-3 text-sm leading-relaxed"
                />
                <Link
                    href={contact()}
                    className="text-ink hover:bg-brand mt-6 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-black/10 transition-all hover:text-white hover:scale-105 shadow-xs"
                >
                    {featured.cta}
                </Link>
            </div>
        </article>
    );
}
