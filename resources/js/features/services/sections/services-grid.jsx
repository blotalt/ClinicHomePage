import FeaturedServiceCard from '@/features/services/components/featured-service-card';
import ServiceCard from '@/features/services/components/service-card';

export default function ServicesGrid({ items, featured }) {
    return (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((service, idx) => (
                <ServiceCard key={service.id} index={idx} {...service} />
            ))}
            {featured ? (
                <FeaturedServiceCard index={items.length} featured={featured} />
            ) : null}
        </div>
    );
}
