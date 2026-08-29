import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppointmentRequestController from '@/actions/App/Http/Controllers/Admin/AppointmentRequestController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Heading from '@/shared/components/common/heading';
import { adminRequests } from '@/shared/lib/admin-nav';

export default function RequestsIndex({ requests }) {
    const [pendingDelete, setPendingDelete] = useState(null);

    return (
        <>
            <Head title="Appointment requests" />

            <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                <Heading
                    title="Appointment requests"
                    description="Submissions from the contact form."
                />

                {requests.data.length === 0 ? (
                    <p className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
                        No requests yet.
                    </p>
                ) : (
                    <ul className="bg-card divide-y rounded-xl border shadow-xs">
                        {requests.data.map((request) => (
                            <li
                                key={request.id}
                                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                                <Link
                                    href={adminRequests(request.id)}
                                    className="min-w-0 flex-1"
                                >
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        {request.name}
                                        {!request.is_read ? (
                                            <span
                                                className="bg-primary size-2 rounded-full"
                                                aria-label="Unread"
                                            />
                                        ) : null}
                                    </span>
                                    <span className="text-muted-foreground block truncate text-xs">
                                        {request.email}
                                        {request.phone
                                            ? ' · ' + request.phone
                                            : ''}
                                        {request.service
                                            ? ' · ' + request.service
                                            : ''}
                                    </span>
                                </Link>

                                <div className="flex shrink-0 items-center gap-3">
                                    <span className="text-muted-foreground text-xs">
                                        {request.created_at}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label={`Delete request from ${request.name}`}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 transition-colors"
                                        onClick={() => setPendingDelete(request)}
                                    >
                                        <Trash2 className="size-3.5" />
                                        <span>Delete</span>
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {requests.links.length > 3 ? (
                    <nav className="flex flex-wrap gap-1">
                        {requests.links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.url ?? ''}
                                disabled={!link.url}
                                className={
                                    'rounded border px-3 py-1.5 text-sm ' +
                                    (link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent')
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                ) : null}
            </div>

            <Dialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="gap-2">
                        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-6" aria-hidden="true" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            Are you sure you want to delete this request?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            The appointment request from “{pendingDelete?.name}” will be
                            permanently removed. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline">
                                No, keep it
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                router.delete(
                                    AppointmentRequestController.destroy.url(
                                        pendingDelete?.id,
                                    ),
                                );
                                setPendingDelete(null);
                            }}
                        >
                            <Trash2 className="size-4" />
                            Yes, delete it
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
RequestsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Content admin',
            href: adminRequests(),
        },
        {
            title: 'Appointment requests',
            href: adminRequests(),
        },
    ],
};
