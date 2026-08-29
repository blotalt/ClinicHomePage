import { Send } from 'lucide-react';
import { resolveIcon } from '@/shared/lib/icons';

export default function ClinicDetails({ details, map }) {
    return (
        <div className="space-y-6">
            {/* Direct Telegram Support Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#104838] to-[#1d6b53] p-7 text-white shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                        <Send className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">
                            Direct Telegram Support
                        </h3>
                        <p className="text-xs text-white/80">
                            Instant replies from our care coordinators
                        </p>
                    </div>
                </div>

                <p className="text-xs text-white/90 leading-relaxed">
                    Prefer messaging on Telegram? Connect directly with our clinic desk to ask quick questions or follow up on your visit.
                </p>

                <a
                    href="https://t.me/LuminaWellnessBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-white py-2.5 px-4 text-xs font-bold text-[#104838] hover:bg-white/95 transition-colors shadow-xs"
                >
                    <Send className="size-4 text-[#104838]" aria-hidden="true" />
                    Message on Telegram (@LuminaWellnessBot)
                </a>
            </div>

            {/* Clinic Details List */}
            <section className="bg-sky rounded-3xl p-8">
                <h2 className="text-brand text-xl font-semibold">
                    Clinic Details
                </h2>

                <dl className="mt-8 space-y-7">
                    {details.map((detail) => {
                        const Icon = resolveIcon(detail.icon);

                        return (
                            <div key={detail.id} className="flex gap-4">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                                    <Icon
                                        className="text-brand size-5"
                                        aria-hidden="true"
                                    />
                                </span>

                                <div>
                                    <dt className="text-ink font-medium">
                                        {detail.label}
                                    </dt>
                                    <dd className="text-ink-soft mt-1 text-sm">
                                        {detail.lines.map((line) => (
                                            <span key={line} className="block">
                                                {detail.href ? (
                                                    <a
                                                        href={detail.href}
                                                        className="hover:text-brand"
                                                    >
                                                        {line}
                                                    </a>
                                                ) : (
                                                    line
                                                )}
                                            </span>
                                        ))}

                                        {detail.badge ? (
                                            <span className="bg-mint text-brand mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
                                                {detail.badge}
                                            </span>
                                        ) : null}
                                    </dd>
                                </div>
                            </div>
                        );
                    })}
                </dl>
            </section>

            <img
                src={map.image}
                alt={map.alt}
                className="w-full rounded-3xl ring-1 ring-black/5"
            />
        </div>
    );
}
