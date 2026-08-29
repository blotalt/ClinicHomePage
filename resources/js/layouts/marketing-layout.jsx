import SiteFooter from '@/layouts/marketing/site-footer';
import SiteHeader from '@/layouts/marketing/site-header';
import { useFlashToast } from '@/shared/hooks/use-flash-toast';

/**
 * Frame for the public-facing pages (home, services, philosophy, contact).
 *
 * These pages are intentionally light-only: each band sets its own
 * background, so they look the same regardless of the visitor's dark-mode
 * preference.
 */
export default function MarketingLayout({ children }) {
    useFlashToast();

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans">
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
        </div>
    );
}
