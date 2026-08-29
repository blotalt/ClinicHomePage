import { Head } from '@inertiajs/react';
import DiscoveryCta from '@/features/services/sections/discovery-cta';
import ServicesGrid from '@/features/services/sections/services-grid';
import PageHeading from '@/shared/components/marketing/page-heading';

export default function Services({ page = {}, items = [], featured = null, discovery = {} }) {
    return (
        <>
            <Head title="Services" />

            <div className="bg-mist flex-1">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
                    <PageHeading
                        title={page?.title || 'Our Services'}
                        subtitle={page?.subtitle || 'Holistic and clinical treatments.'}
                    />
                    <ServicesGrid items={items} featured={featured} />
                    <DiscoveryCta discovery={discovery} />
                </div>
            </div>
        </>
    );
}
