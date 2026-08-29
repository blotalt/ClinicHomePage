import { contact, home, philosophy, services } from '@/routes';

/**
 * Structural links only. Clinic name, phone and email come from the
 * database as the shared `clinic` prop (Admin -> Site-wide).
 */

/**
 * Site-wide content: anything that appears on more than one page.
 *
 * Page-specific copy lives in that page's own feature folder, e.g.
 * `features/services/content.ts`.
 */
export const navLinks = [
    { label: 'Home', href: home().url },
    { label: 'Services', href: services().url },
    { label: 'Philosophy', href: philosophy().url },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: contact().url },
];
export const footerColumns = [
    {
        heading: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Accessibility', href: '#' },
        ],
    },
    {
        heading: 'Patients',
        links: [
            { label: 'Patient Portal', href: '#' },
            { label: 'Book Appointment', href: contact().url },
            { label: 'Contact Us', href: contact().url },
        ],
    },
];
