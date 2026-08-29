import { Head } from '@inertiajs/react';
import AppointmentForm from '@/features/contact/sections/appointment-form';
import ClinicDetails from '@/features/contact/sections/clinic-details';
import PageHeading from '@/shared/components/marketing/page-heading';

export default function Contact({ page = {}, form = {}, serviceOptions = [], details = {}, map = {} }) {
    return (
        <>
            <Head title="Contact" />

            <div className="bg-mist flex-1">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
                    <PageHeading
                        title={page?.title || 'Get In Touch'}
                        subtitle={page?.subtitle || 'We would love to hear from you.'}
                        tone="brand"
                    />

                    <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
                        <AppointmentForm
                            form={form}
                            serviceOptions={serviceOptions}
                        />
                        <ClinicDetails details={details} map={map} />
                    </div>
                </div>
            </div>
        </>
    );
}
