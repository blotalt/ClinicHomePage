import { AppContent } from '@/shared/components/app/app-content';
import { AppHeader } from '@/shared/components/app/app-header';
import { AppShell } from '@/shared/components/app/app-shell';

export default function AppHeaderLayout({ children, breadcrumbs }) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
