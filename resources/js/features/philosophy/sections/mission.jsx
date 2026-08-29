import { Sprout } from 'lucide-react';
import Prose from '@/shared/components/common/prose';

export default function Mission({ mission }) {
    return (
        <section className="bg-sky">
            <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
                <Sprout
                    className="text-brand mx-auto size-8"
                    aria-hidden="true"
                />

                <blockquote className="text-ink mt-8 text-xl leading-relaxed font-medium text-balance sm:text-2xl sm:leading-relaxed">
                    <Prose html={mission.quote} />
                </blockquote>

                <p className="text-ink-soft mt-8 text-sm">
                    — {mission.attribution}
                </p>
            </div>
        </section>
    );
}
