import { Head, Link } from '@inertiajs/react';
import {
    Inbox,
    LayoutTemplate,
    MailOpen,
    Sparkles,
    Stethoscope,
} from 'lucide-react';
import Heading from '@/shared/components/common/heading';
import {
    adminContent,
    adminPages,
    adminRequests,
    adminServices,
} from '@/shared/lib/admin-nav';

export default function AdminDashboard({ stats, recentRequests = [], recentActivities = [] }) {
    const tiles = [
        {
            label: 'Services',
            value: stats.services,
            icon: Sparkles,
            href: adminServices(),
        },
        {
            label: 'Practitioners',
            value: stats.doctors,
            icon: Stethoscope,
            href: adminServices(),
        },
        {
            label: 'Philosophy pillars',
            value: stats.pillars,
            icon: LayoutTemplate,
            href: adminContent('pillars'),
        },
        {
            label: 'Appointment requests',
            value: stats.requests,
            icon: Inbox,
            href: adminRequests(),
        },
        {
            label: 'Unread requests',
            value: stats.unread,
            icon: MailOpen,
            href: adminRequests(),
        },
    ];

    return (
        <>
            <Head title="Admin" />

            <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
                <Heading
                    title="Content admin"
                    description="Edit what appears on the public site."
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {tiles.map((tile) => (
                        <Link
                            key={tile.label}
                            href={tile.href}
                            className="hover:border-primary/40 rounded-xl border p-5 transition-colors bg-card shadow-2xs"
                        >
                            <tile.icon
                                className="text-muted-foreground size-5"
                                aria-hidden="true"
                            />
                            <p className="mt-4 text-2xl font-semibold">
                                {tile.value}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {tile.label}
                            </p>
                        </Link>
                    ))}
                </div>

                <section>
                    <h2 className="text-lg font-semibold">Page copy</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Headings, intros and button labels for each page.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {adminPages.map((page) => (
                            <Link
                                key={page.group}
                                href={page.href}
                                className="hover:border-primary/40 rounded-lg border px-4 py-3 text-sm font-medium transition-colors bg-card"
                            >
                                {page.label}
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Latest appointment requests */}
                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Latest appointment requests
                            </h2>
                            <Link
                                href={adminRequests()}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {recentRequests.length === 0 ? (
                            <p className="text-muted-foreground mt-4 rounded-lg border border-dashed p-6 text-center text-sm">
                                No requests yet. Submissions from the contact form
                                land here.
                            </p>
                        ) : (
                            <ul className="mt-4 divide-y rounded-lg border bg-card">
                                {recentRequests.map((request) => (
                                    <li key={request.id}>
                                        <Link
                                            href={adminRequests(request.id)}
                                            className="hover:bg-accent/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors"
                                        >
                                            <span>
                                                <span className="block text-sm font-medium">
                                                    {request.name}
                                                    {!request.is_read ? (
                                                        <span className="bg-primary ml-2 inline-block size-2 rounded-full align-middle" />
                                                    ) : null}
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    {request.email}
                                                    {request.service
                                                        ? ` · ${request.service}`
                                                        : ''}
                                                </span>
                                            </span>
                                            <span className="text-muted-foreground shrink-0 text-xs">
                                                {request.created_at}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Recent Activity History */}
                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Recent CRUD Activity
                            </h2>
                            <Link
                                href="/admin/history"
                                className="text-primary text-sm hover:underline"
                            >
                                View audit log
                            </Link>
                        </div>

                        {recentActivities.length === 0 ? (
                            <p className="text-muted-foreground mt-4 rounded-lg border border-dashed p-6 text-center text-sm">
                                No activity recorded yet. Creations, edits, and deletions will show here.
                            </p>
                        ) : (
                            <ul className="mt-4 divide-y rounded-lg border bg-card">
                                {recentActivities.map((activity) => (
                                    <li key={activity.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                                                    activity.action === 'created'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : activity.action === 'deleted'
                                                        ? 'bg-rose-100 text-rose-800'
                                                        : 'bg-sky-100 text-sky-800'
                                                }`}
                                            >
                                                {activity.action}
                                            </span>
                                            <span className="text-sm font-medium text-ink truncate">
                                                {activity.subject_title}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                                            {activity.created_at}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Content admin',
            href: adminHome(),
        },
    ],
};
