import { Link, usePage } from '@inertiajs/react';
import { contact } from '@/routes';
import Prose from '@/shared/components/common/prose';

export default function DiscoveryCta({ discovery }) {
    const { clinic } = usePage().props;

    return (
        <section className="from-sky via-sky to-mint mx-auto mt-24 max-w-4xl rounded-3xl bg-gradient-to-br px-6 py-14 text-center">
            <h2 className="text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
                {discovery.title}
            </h2>
            <Prose
                html={discovery.body}
                className="text-ink-soft mx-auto mt-4 max-w-xl"
            />

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                    href={contact()}
                    className="bg-brand hover:bg-brand-dark inline-flex items-center rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-colors"
                >
                    {discovery.cta}
                </Link>
                <a
                    href={clinic.phoneHref}
                    className="border-brand/25 text-ink hover:border-brand/50 inline-flex items-center rounded-full border bg-white px-7 py-3.5 text-sm font-medium transition-colors"
                >
                    Call {clinic.phone}
                </a>
            </div>
        </section>
    );
}
