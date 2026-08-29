import ServiceCard from '@/features/home/components/service-card';
import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';

export default function Services({ services = {} }) {
    const featured = services?.featured || {};
    const FeaturedIcon = resolveIcon(featured?.icon || 'Sparkles');
    const title = services?.title || 'Our Core Services';
    const subtitle = services?.subtitle || '<p>Comprehensive care tailored to your needs.</p>';
    const cards = Array.isArray(services?.cards) ? services.cards : [];

    return (
        <section className="bg-mist">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
                        {title}
                    </h2>
                    <Prose
                        html={subtitle}
                        className="text-ink-soft mt-4"
                    />
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    {/* Featured service: photo with the copy overlaid. */}
                    {featured?.title && (
                        <article className="group relative isolate overflow-hidden rounded-3xl">
                            <img
                                src={featured?.image || '/images/home/consulting-room.svg'}
                                alt="A doctor reviewing results with a patient"
                                className="size-full min-h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-7">
                                <span className="bg-brand flex size-10 items-center justify-center rounded-full">
                                    <FeaturedIcon
                                        className="size-5 text-white"
                                        aria-hidden="true"
                                    />
                                </span>
                                <h3 className="mt-4 text-xl font-semibold text-white">
                                    {featured.title}
                                </h3>
                                <Prose
                                    html={featured.body}
                                    className="mt-2 max-w-md text-sm text-white/85"
                                />
                            </div>
                        </article>
                    )}

                    <div className="flex flex-col gap-6">
                        {cards.map((service) => (
                            <ServiceCard key={service.id} {...service} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
