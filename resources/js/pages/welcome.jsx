import { Head, usePage } from '@inertiajs/react';
import Hero from '@/features/home/sections/hero';
import Philosophy from '@/features/home/sections/philosophy';
import Services from '@/features/home/sections/services';

export default function Welcome({ hero, philosophy, services }) {
    const { clinic } = usePage().props;

    const title = clinic?.name
        ? `${clinic.name} — ${clinic.tagline || 'Dedicated to Human-Centric Care.'}`
        : 'Lumina Wellness — Dedicated to Human-Centric Care.';

    return (
        <>
            <Head title={title} />
            {hero && <Hero hero={hero} />}
            {philosophy && <Philosophy philosophy={philosophy} />}
            {services && <Services services={services} />}
        </>
    );
}
