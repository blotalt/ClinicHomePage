import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';
import { cn } from '@/shared/lib/utils';

/** One of the small tinted service cards beside the featured image. */
export default function ServiceCard({ title, body, icon, tone }) {
    const Icon = resolveIcon(icon);

    return (
        <article
            className={cn(
                'flex flex-1 flex-col rounded-3xl p-7 transition-shadow hover:shadow-md',
                tone,
            )}
        >
            <span className="flex size-10 items-center justify-center rounded-full bg-white/60">
                <Icon className="text-brand size-5" aria-hidden="true" />
            </span>
            <h3 className="text-ink mt-auto pt-10 text-lg font-semibold">
                {title}
            </h3>
            <Prose html={body} className="text-ink-soft mt-2 text-sm" />
        </article>
    );
}
