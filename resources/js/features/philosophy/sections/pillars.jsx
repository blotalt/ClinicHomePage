import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';
import { cn } from '@/shared/lib/utils';

export default function Pillars({ pillars }) {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
                <h2 className="text-brand text-center text-2xl font-semibold tracking-tight">
                    {pillars.title}
                </h2>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {pillars.items.map((pillar) => {
                        const Icon = resolveIcon(pillar.icon);

                        return (
                            <article
                                key={pillar.id}
                                className="rounded-2xl bg-white p-8 ring-1 ring-black/5"
                            >
                                <span
                                    className={cn(
                                        'flex size-11 items-center justify-center rounded-full',
                                        pillar.tone,
                                    )}
                                >
                                    <Icon
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </span>

                                <h3 className="text-ink mt-7 text-lg font-semibold">
                                    {pillar.title}
                                </h3>
                                <Prose
                                    html={pillar.body}
                                    className="text-ink-soft mt-3 text-sm"
                                />
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
