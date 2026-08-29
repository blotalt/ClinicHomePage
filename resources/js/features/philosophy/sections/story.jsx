import { BookOpen } from 'lucide-react';
import Prose from '@/shared/components/common/prose';

export default function Story({ story }) {
    return (
        <section aria-labelledby="story-heading">
            <div className="flex items-center gap-2 text-[#104838] font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                <BookOpen className="size-5 shrink-0" aria-hidden="true" />
                <h2 id="story-heading">{story?.title || 'Our Story'}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Left Card: Story Text */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-border/70 p-7 sm:p-10 shadow-xs flex flex-col justify-center">
                    <Prose
                        html={story?.body}
                        className="text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4"
                    />
                </div>

                {/* Right Card: Story Image */}
                <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-xs border border-border/50 bg-[#efeae1] aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto">
                    <img
                        src={story?.image || '/images/philosophy/story-lounge.svg'}
                        alt="Serene Hearth clinic welcoming lounge"
                        className="size-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
