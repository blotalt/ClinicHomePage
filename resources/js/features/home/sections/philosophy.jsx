import { Link } from '@inertiajs/react';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { philosophy as philosophyRoute } from '@/routes';
import Prose from '@/shared/components/common/prose';
import ChargingHeart from '@/features/home/components/charging-heart';

export default function Philosophy({ philosophy = {} }) {
    const imageHands = philosophy?.imageHands || '/images/home/holding-hands.svg';
    const imageRoom = philosophy?.imageRoom || '/images/home/consulting-room.svg';
    const statValue = philosophy?.statValue || '98%';
    const statLabel = philosophy?.statLabel || 'Patient Satisfaction';
    const title = philosophy?.title || 'Our Philosophy';
    const body = philosophy?.body || '<p>We believe in medicine that cares for the whole person.</p>';
    const highlights = Array.isArray(philosophy?.highlights) ? philosophy.highlights : [];
    const link = philosophy?.link || 'Explore our approach';

    return (
        <section className="bg-sky">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
                {/* Image collage: offset portrait left, stacked pair right. */}
                <div className="grid grid-cols-2 items-start gap-5">
                    <img
                        src={imageHands}
                        alt="A clinician holding a patient's hands"
                        className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-sm"
                    />
                    <div className="flex flex-col gap-5">
                        <img
                            src={imageRoom}
                            alt="A consulting room overlooking the garden"
                            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
                        />
                        <div className="bg-brand-soft group relative overflow-hidden flex aspect-square flex-col items-center justify-center rounded-2xl p-6 text-center text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <ChargingHeart className="size-11" />
                            <p className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                                {statValue}
                            </p>
                            <p className="mt-1.5 text-xs sm:text-sm text-white/85 font-medium tracking-wide">
                                {statLabel}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:pt-6">
                    <h2 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
                        {title}
                    </h2>

                    <Prose
                        html={body}
                        className="text-ink-soft mt-6"
                    />

                    {highlights.length > 0 && (
                        <ul className="mt-8 space-y-4">
                            {highlights.map((highlight) => (
                                <li
                                    key={highlight}
                                    className="text-ink flex items-start gap-3 text-sm"
                                >
                                    <CircleCheck
                                        className="fill-brand mt-0.5 size-5 shrink-0 text-white"
                                        aria-hidden="true"
                                    />
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link
                        href={philosophyRoute()}
                        className="text-brand hover:text-brand-dark mt-9 inline-flex items-center gap-2 text-sm font-medium"
                    >
                        {link}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
