import Prose from '@/shared/components/common/prose';
import { cn } from '@/shared/lib/utils';

/** Centred title + intro used at the top of the public pages. */
export default function PageHeading({ title, subtitle, tone = 'ink' }) {
    return (
        <div className="mx-auto max-w-3xl text-center">
            <h1
                className={cn(
                    'text-4xl font-semibold tracking-tight sm:text-5xl',
                    tone === 'brand' ? 'text-brand' : 'text-ink',
                )}
            >
                {title}
            </h1>
            <Prose
                html={subtitle}
                className="text-ink-soft mx-auto mt-6 max-w-2xl"
            />
        </div>
    );
}
