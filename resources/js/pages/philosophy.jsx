import { Head } from '@inertiajs/react';
import Story from '@/features/philosophy/sections/story';
import Team from '@/features/philosophy/sections/team';
import Values from '@/features/philosophy/sections/values';

export default function Philosophy({ page, story, values, team }) {
    return (
        <>
            <Head title={page?.title || 'About Serene Hearth'} />

            <div className="bg-[#fcfbf9]/60 min-h-screen py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-24">
                    {/* Header / Hero Section */}
                    <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
                        <h1 className="text-[#104838] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
                            {page?.title || 'About Serene Hearth'}
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                            {page?.subtitle ||
                                'Healing begins where you feel most comfortable. We envisioned a clinic that feels less like a facility and more like a sanctuary.'}
                        </p>
                    </div>

                    {/* Section 1: Our Story */}
                    <Story story={story} />

                    {/* Section 2: Core Values */}
                    <Values values={values} />

                    {/* Section 3: Meet The Team */}
                    <Team team={team} />
                </div>
            </div>
        </>
    );
}
