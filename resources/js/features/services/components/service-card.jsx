import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { contact } from '@/routes';
import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';

export default function ServiceCard({ title, body, icon, index = 0 }) {
    const Icon = resolveIcon(icon);

    return (
        <article
            style={{ animationDelay: `${index * 80}ms` }}
            className="animate-fade-in-up flex flex-col rounded-3xl bg-white p-8 sm:p-9 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#104838]/5"
        >
            <span className="bg-sky flex size-12 items-center justify-center rounded-2xl">
                <Icon className="text-brand size-5.5" aria-hidden="true" />
            </span>

            <h2 className="text-ink mt-8 text-xl font-bold tracking-tight">{title}</h2>
            <Prose html={body} className="text-ink-soft mt-3 text-sm leading-relaxed" />

            <Link
                href={contact()}
                className="text-brand hover:text-brand-dark mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold group cursor-pointer"
            >
                <span>Learn more</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
        </article>
    );
}
