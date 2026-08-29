import { AppContent } from '@/shared/components/app/app-content';
import { AppShell } from '@/shared/components/app/app-shell';
import { AppSidebar } from '@/shared/components/app/app-sidebar';
import { AppSidebarHeader } from '@/shared/components/app/app-sidebar-header';
import { useFlashToast } from '@/shared/hooks/use-flash-toast';

export default function AppSidebarLayout({ children, breadcrumbs = [] }) {
    useFlashToast();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip overflow-y-auto min-h-svh">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex-1 min-h-0">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
