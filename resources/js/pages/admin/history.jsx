import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    History,
    Search,
    Filter,
    Trash2,
    Clock,
    PlusCircle,
    Edit3,
    AlertTriangle,
    Eye,
    ArrowUpDown,
    CheckCircle2,
    Shield,
    Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

export default function AdminHistory({ logs, stats, filters }) {
    const [selectedLog, setSelectedLog] = useState(null);
    const [pendingClear, setPendingClear] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [actionFilter, setActionFilter] = useState(filters?.action || 'all');
    const [moduleFilter, setModuleFilter] = useState(filters?.module || 'all');

    const handleFilterChange = (newAction, newModule, newSearch) => {
        router.get(
            '/admin/history',
            {
                action: newAction !== 'all' ? newAction : undefined,
                module: newModule !== 'all' ? newModule : undefined,
                search: newSearch ? newSearch : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange(actionFilter, moduleFilter, search);
    };

    const handleClearHistory = () => {
        router.delete('/admin/history', {
            onSuccess: () => setPendingClear(false),
        });
    };

    const getActionBadge = (action) => {
        switch (action) {
            case 'created':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <PlusCircle className="size-3.5" />
                        CREATED
                    </span>
                );
            case 'updated':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                        <Edit3 className="size-3.5" />
                        UPDATED
                    </span>
                );
            case 'deleted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                        <Trash2 className="size-3.5" />
                        DELETED
                    </span>
                );
            case 'reordered':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                        <ArrowUpDown className="size-3.5" />
                        REORDERED
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {action.toUpperCase()}
                    </span>
                );
        }
    };

    return (
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <Head title="Activity & Audit History" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                        Activity & Audit History
                    </h1>
                    <p className="text-base text-muted-foreground mt-1">
                        Track, audit, and monitor all creations, updates, saves, and deletions in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPendingClear(true)}
                        disabled={stats?.total === 0}
                        className="gap-2 text-xs"
                    >
                        <Trash2 className="size-4" />
                        Clear History
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                        <History className="size-4 text-primary" />
                        Total Actions
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-ink">{stats?.total ?? 0}</div>
                </div>

                <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
                        <PlusCircle className="size-4 text-emerald-600" />
                        Created
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats?.created ?? 0}</div>
                </div>

                <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-2">
                        <Edit3 className="size-4 text-sky-600" />
                        Updated / Saved
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-sky-800">{stats?.updated ?? 0}</div>
                </div>

                <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
                        <Trash2 className="size-4 text-rose-600" />
                        Deleted
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-rose-800">{stats?.deleted ?? 0}</div>
                </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs space-y-4">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 relative">
                        <Search className="size-4 text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title, author, action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={actionFilter}
                            onChange={(e) => {
                                setActionFilter(e.target.value);
                                handleFilterChange(e.target.value, moduleFilter, search);
                            }}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">All Actions</option>
                            <option value="created">Created</option>
                            <option value="updated">Updated</option>
                            <option value="deleted">Deleted</option>
                            <option value="reordered">Reordered</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={moduleFilter}
                            onChange={(e) => {
                                setModuleFilter(e.target.value);
                                handleFilterChange(actionFilter, e.target.value, search);
                            }}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">All Modules</option>
                            <option value="Service">Services</option>
                            <option value="ContentItem">Content Items</option>
                            <option value="PageContent">Page Copy</option>
                            <option value="AppointmentRequest">Appointment Requests</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* History Table */}
            <div className="bg-card border border-border/70 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-muted/50 border-b border-border/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="py-3 px-4">Action</th>
                                <th className="py-3 px-4">Target Title / Item</th>
                                <th className="py-3 px-4">Module</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {logs?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                        <History className="size-10 text-muted-foreground/40 mx-auto mb-2" />
                                        <p className="font-semibold">No activity logs recorded yet</p>
                                        <p className="text-xs mt-1">Actions performed on services, content, and settings will appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs?.data?.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-ink max-w-xs truncate">
                                            {log.subject_title}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {log.subject_type}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                                            {log.user_name}
                                        </td>
                                        <td className="py-3.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                                            <div>{log.created_at}</div>
                                            <div className="text-[11px] text-muted-foreground/70">{log.created_ago}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedLog(log)}
                                                className="gap-1.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary"
                                            >
                                                <Eye className="size-3.5" />
                                                Inspect
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs?.links && logs.links.length > 3 && (
                    <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                            Showing {logs.from} to {logs.to} of {logs.total} entries
                        </div>
                        <div className="flex items-center gap-1">
                            {logs.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    className={cn(
                                        'px-3 py-1.5 rounded-md border transition-colors',
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-primary font-bold'
                                            : 'border-border hover:bg-muted text-ink',
                                        !link.url && 'opacity-40 pointer-events-none',
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Inspect Details Modal */}
            <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="size-5 text-primary" />
                            Activity Log Details #{selectedLog?.id}
                        </DialogTitle>
                        <DialogDescription>
                            Detailed record payload, modified attributes, and actor information.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 text-xs">
                                <div>
                                    <span className="text-muted-foreground block">Action:</span>
                                    <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Module:</span>
                                    <span className="font-semibold text-ink">{selectedLog.subject_type}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Target Title:</span>
                                    <span className="font-semibold text-ink">{selectedLog.subject_title}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Actor / User:</span>
                                    <span className="font-semibold text-ink">{selectedLog.user_name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Recorded At:</span>
                                    <span className="text-ink">{selectedLog.created_at}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">IP Address:</span>
                                    <span className="font-mono text-ink">{selectedLog.ip_address || '127.0.0.1'}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Changes & Payload Data
                                </h4>
                                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-64 leading-relaxed">
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Clear History Confirmation Dialog */}
            <Dialog open={pendingClear} onOpenChange={setPendingClear}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="size-5" />
                            Clear Activity Log History?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete all activity history logs? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleClearHistory}>
                            Yes, Clear All History
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

AdminHistory.layout = {
    breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Activity History', href: '/admin/history' },
    ],
};
