import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react';
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

export default function RequestShow({ request }) {
    const [confirming, setConfirming] = useState(false);

    return (
        <>
            <Head title={`Request from ${request.name}`} />

            <div className="flex-1 p-6 md:p-8 max-w-3xl w-full mx-auto space-y-6">
                <Link
                    href={adminRequests()}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    All requests
                </Link>

                <Heading
                    title={request.name}
                    description={`Received ${request.created_at}`}
                />

                <dl className="grid gap-4 rounded-xl border p-6 sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground text-xs uppercase">
                            Email
                        </dt>
                        <dd className="mt-1 text-sm">
                            <a
                                href={`mailto:${request.email}`}
                                className="text-primary hover:underline"
                            >
                                {request.email}
                            </a>
                        </dd>
                    </div>

                    <div>
                        <dt className="text-muted-foreground text-xs uppercase">
                            Phone
                        </dt>
                        <dd className="mt-1 text-sm">
                            {request.phone ? (
                                <a
                                    href={`tel:${request.phone}`}
                                    className="text-primary hover:underline"
                                >
                                    {request.phone}
                                </a>
                            ) : (
                                <span className="text-muted-foreground">
                                    Not provided
                                </span>
                            )}
                        </dd>
                    </div>

                    <div className="sm:col-span-2">
                        <dt className="text-muted-foreground text-xs uppercase">
                            Service of interest
                        </dt>
                        <dd className="mt-1 text-sm">
                            {request.service ?? (
                                <span className="text-muted-foreground">
                                    Not specified
                                </span>
                            )}
                        </dd>
                    </div>

                    <div className="sm:col-span-2">
                        <dt className="text-muted-foreground text-xs uppercase">
                            Message
                        </dt>
                        {/* Visitor-authored text: rendered as text, never HTML. */}
                        <dd className="mt-1 text-sm whitespace-pre-wrap">
                            {request.message}
                        </dd>
                    </div>
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild>
                        <a href={`mailto:${request.email}`}>
                            <Mail className="size-4" aria-hidden="true" />
                            Reply by email
                        </a>
                    </Button>

                    {request.phone ? (
                        <Button asChild variant="outline">
                            <a href={`tel:${request.phone}`}>
                                <Phone className="size-4" aria-hidden="true" />
                                Call
                            </a>
                        </Button>
                    ) : null}

                    <Button
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setConfirming(true)}
                    >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                    </Button>
                </div>
            </div>

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="gap-2">
                        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-6" aria-hidden="true" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            Are you sure you want to delete this request?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            The appointment request from “{request.name}” will be permanently
                            removed. This action cannot be undone.
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
                            onClick={() =>
                                router.delete(
                                    AppointmentRequestController.destroy.url(
                                        request.id,
                                    ),
                                )
                            }
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
RequestShow.layout = {
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
