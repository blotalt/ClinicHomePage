import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Database,
    FileText,
    FolderGit2,
    History,
    Inbox,
    LayoutGrid,
    Sparkles,
} from 'lucide-react';
import AppLogo from '@/shared/components/app/app-logo';
import { NavFooter } from '@/shared/components/app/nav-footer';
import { NavMain } from '@/shared/components/app/nav-main';
import { NavUser } from '@/shared/components/app/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import {
    adminCollections,
    adminContent,
    adminDatabase,
    adminHistory,
    adminHome,
    adminRequests,
    adminServices,
} from '@/shared/lib/admin-nav';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

/** Only rendered for accounts flagged as administrators. */
const adminNavItems = [
    { title: 'Content admin', href: adminHome(), icon: FileText },
    { title: 'Services', href: adminServices(), icon: Sparkles },
    ...adminCollections.map((collection) => ({
        title: collection.label,
        href: adminContent(collection.key),
        icon: Sparkles,
    })),
    { title: 'Appointment requests', href: adminRequests(), icon: Inbox },
    { title: 'Activity History', href: adminHistory(), icon: History },
    { title: 'Database & ERD', href: adminDatabase(), icon: Database },
];
const footerNavItems = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
export function AppSidebar() {
    const { auth } = usePage().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {auth?.isAdmin ? (
                    <NavMain items={adminNavItems} label="Site content" />
                ) : null}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
