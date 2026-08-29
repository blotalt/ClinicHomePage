import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import Prose from '@/shared/components/common/prose';
import { adminHome } from '@/shared/lib/admin-nav';
import { resolveIcon } from '@/shared/lib/icons';

/**
 * Shared list screen for both /admin/services and the CMS collections.
 * `basePath` comes from the controller, so this file needs no route logic.
 */
export default function ContentIndex({ collectionLabel, basePath, items }) {
    // Read this with optional chaining below: the React Compiler hoists
    // property reads out of handlers into render-time memo dependencies.
    const [pendingDelete, setPendingDelete] = useState(null);

    const move = (index, direction) => {
        const next = [...items];
        const target = index + direction;

        if (target < 0 || target >= next.length) {
            return;
        }

        [next[index], next[target]] = [next[target], next[index]];

        router.post(
            `${basePath}/reorder`,
            { ids: next.map((item) => item.id) },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={collectionLabel} />

            <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title={collectionLabel}
                        description="Shown on the public site in this order."
                    />
                    <Button asChild>
                        <Link href={`${basePath}/create`}>
                            <Plus className="size-4" aria-hidden="true" />
                            Add item
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <p className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
                        Nothing here yet.
                    </p>
                ) : (
                    <ul className="bg-card divide-y rounded-xl border shadow-xs">
                        {items.map((item, index) => {
                            const Icon = resolveIcon(item.icon);

                            return (
                                <li
                                    key={item.id}
                                    className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <button
                                            type="button"
                                            aria-label="Move up"
                                            disabled={index === 0}
                                            onClick={() => move(index, -1)}
                                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5 rounded hover:bg-muted"
                                        >
                                            <ChevronUp className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Move down"
                                            disabled={
                                                index === items.length - 1
                                            }
                                            onClick={() => move(index, 1)}
                                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5 rounded hover:bg-muted"
                                        >
                                            <ChevronDown className="size-4" />
                                        </button>
                                    </div>

                                    <span className="bg-accent text-accent-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="flex flex-wrap items-center gap-2 font-medium">
                                            {item.title}
                                            {item.badge ? (
                                                <Tag>{item.badge}</Tag>
                                            ) : null}
                                            {!item.is_published ? (
                                                <Tag muted>Hidden</Tag>
                                            ) : null}
                                            {item.meta?.featured ? (
                                                <Tag>Featured</Tag>
                                            ) : null}
                                            {item.meta?.show_on_home ? (
                                                <Tag>On home</Tag>
                                            ) : null}
                                        </p>
                                        <Prose
                                            html={item.body}
                                            className="text-muted-foreground mt-1 line-clamp-2 text-sm"
                                        />
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5"
                                        >
                                            <Link
                                                href={`${basePath}/${item.id}/edit`}
                                                aria-label={`Edit ${item.title}`}
                                            >
                                                <Pencil className="size-3.5" />
                                                <span>Edit</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            aria-label={`Delete ${item.title}`}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 transition-colors"
                                            onClick={() =>
                                                setPendingDelete(item)
                                            }
                                        >
                                            <Trash2 className="size-3.5" />
                                            <span>Delete</span>
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
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
                            Are you sure you want to delete this {collectionLabel ? collectionLabel.toLowerCase().replace(/s$/, '') : 'item'}?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            “{pendingDelete?.title}” will be permanently removed from the
                            public site. This action cannot be undone.
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
                                    `${basePath}/${pendingDelete?.id}`,
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

function Tag({ children, muted }) {
    return (
        <span
            className={
                'rounded px-1.5 py-0.5 text-xs font-normal ' +
                (muted
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary')
            }
        >
            {children}
        </span>
    );
}
ContentIndex.layout = {
    breadcrumbs: [
        {
            title: 'Content admin',
            href: adminHome(),
        },
    ],
};
