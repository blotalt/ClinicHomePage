import { Heart } from 'lucide-react';
import Prose from '@/shared/components/common/prose';
import { resolveIcon } from '@/shared/lib/icons';
import { cn } from '@/shared/lib/utils';

export default function Values({ values }) {
    const items = values?.items ?? [];

    return (
        <section aria-labelledby="values-heading">
            <div className="flex items-center justify-center gap-2 text-[#104838] font-bold text-lg sm:text-xl mb-6 sm:mb-8 text-center">
                <Heart className="size-5 shrink-0" aria-hidden="true" />
                <h2 id="values-heading">{values?.title || 'Core Values'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((item, index) => {
                    const Icon = resolveIcon(item.icon);

                    return (
                        <div
                            key={item.id || index}
                            style={{ animationDelay: `${index * 80}ms` }}
                            className="animate-fade-in-up bg-[#f8fbfb] border border-sky-100/90 rounded-3xl p-8 text-center flex flex-col items-center shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#104838]/5"
                        >
                            <div
                                className={cn(
                                    'size-14 rounded-2xl flex items-center justify-center mb-6 shrink-0 shadow-xs',
                                    item.tone || 'bg-[#104838] text-white',
                                )}
                            >
                                <Icon className="size-6" aria-hidden="true" />
                            </div>

                            <h3 className="text-[#104838] text-xl font-bold tracking-tight">
                                {item.title}
                            </h3>

                            <Prose
                                html={item.body}
                                className="text-muted-foreground mt-3 text-sm leading-relaxed"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
