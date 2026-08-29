<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AppointmentRequest;
use App\Models\ContentItem;
use App\Models\Doctor;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'services' => Service::query()->count(),
                'doctors' => Doctor::query()->count(),
                'pillars' => ContentItem::query()
                    ->where('collection', 'pillars')->count(),
                'requests' => AppointmentRequest::query()->count(),
                'unread' => AppointmentRequest::query()
                    ->whereNull('read_at')->count(),
            ],
            'recentRequests' => AppointmentRequest::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (AppointmentRequest $r): array => [
                    'id' => $r->id,
                    'name' => $r->name,
                    'email' => $r->email,
                    'service' => $r->service,
                    'created_at' => $r->created_at?->diffForHumans(),
                    'is_read' => $r->read_at !== null,
                ])
                ->all(),
            'recentActivities' => ActivityLog::query()
                ->latest()
                ->limit(6)
                ->get()
                ->map(fn (ActivityLog $log): array => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'subject_type' => $log->subject_type,
                    'subject_title' => $log->subject_title,
                    'user_name' => $log->user_name,
                    'created_at' => $log->created_at?->diffForHumans(),
                ])
                ->all(),
        ]);
    }
}
