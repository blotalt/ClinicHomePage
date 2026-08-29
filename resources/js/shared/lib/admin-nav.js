import { dashboard } from '@/routes/admin';
import { index as contentIndex } from '@/routes/admin/content';
import { index as servicesIndex } from '@/routes/admin/services';
import { edit as pagesEdit } from '@/routes/admin/pages';
import {
    index as requestsIndex,
    show as requestsShow,
} from '@/routes/admin/requests';

/** Repeatable collections, in the order they appear in the sidebar. */
export const adminCollections = [
    { key: 'pillars', label: 'Philosophy pillars' },
    { key: 'faqs', label: 'Frequently asked questions' },
    { key: 'home_highlights', label: 'Home page highlights' },
    { key: 'clinic_details', label: 'Clinic details' },
];

/** Per-page copy screens. Must match PageContentController::GROUPS. */
export const adminPages = [
    { group: 'home', label: 'Home page', href: pagesEdit('home') },
    { group: 'services', label: 'Services page', href: pagesEdit('services') },
    {
        group: 'philosophy',
        label: 'Philosophy page',
        href: pagesEdit('philosophy'),
    },
    { group: 'faq', label: 'FAQ page', href: pagesEdit('faq') },
    { group: 'contact', label: 'Contact page', href: pagesEdit('contact') },
    { group: 'site', label: 'Site-wide', href: pagesEdit('site') },
];

export const adminHome = () => dashboard();
export const adminContent = (collection) => contentIndex(collection);
export const adminServices = () => servicesIndex();
export const adminPage = (group) => pagesEdit(group);
export const adminDatabase = () => ({ url: '/admin/database' });
export const adminHistory = () => ({ url: '/admin/history' });
export const adminRequests = (id) =>
    id === undefined ? requestsIndex() : requestsShow(id);
