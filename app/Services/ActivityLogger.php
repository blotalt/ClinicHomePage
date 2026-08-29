<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Record an administrative CRUD activity log.
     */
    public static function log(
        string $action,
        string $subjectType,
        ?int $subjectId,
        string $subjectTitle,
        array $details = []
    ): ActivityLog {
        $user = Auth::user();

        return ActivityLog::query()->create([
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'Admin',
            'action' => strtolower($action),
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'subject_title' => $subjectTitle,
            'details' => $details,
            'ip_address' => Request::ip(),
        ]);
    }
}
