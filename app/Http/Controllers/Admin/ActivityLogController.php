<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $action = $request->query('action');
        $module = $request->query('module');
        $search = $request->query('search');

        $query = ActivityLog::query()->latest();

        if (! empty($action) && $action !== 'all') {
            $query->where('action', $action);
        }

        if (! empty($module) && $module !== 'all') {
            $query->where('subject_type', $module);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('subject_title', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        $logs = $query->paginate(25)->through(fn (ActivityLog $log): array => [
            'id' => $log->id,
            'user_name' => $log->user_name,
            'action' => $log->action,
            'subject_type' => $log->subject_type,
            'subject_id' => $log->subject_id,
            'subject_title' => $log->subject_title,
            'details' => $log->details,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->format('M j, Y g:i A'),
            'created_ago' => $log->created_at?->diffForHumans(),
        ]);

        $stats = [
            'total' => ActivityLog::query()->count(),
            'created' => ActivityLog::query()->where('action', 'created')->count(),
            'updated' => ActivityLog::query()->where('action', 'updated')->count(),
            'deleted' => ActivityLog::query()->where('action', 'deleted')->count(),
        ];

        return Inertia::render('admin/history', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => [
                'action' => $action ?? 'all',
                'module' => $module ?? 'all',
                'search' => $search ?? '',
            ],
        ]);
    }

    public function clear(): RedirectResponse
    {
        ActivityLog::query()->truncate();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Activity history cleared.'),
        ]);

        return to_route('admin.history.index');
    }
}
