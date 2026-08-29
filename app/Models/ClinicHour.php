<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicHour extends Model
{
    /** 0 = Sunday, matching Carbon's dayOfWeek. */
    public const DAYS = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday',
    ];

    protected $fillable = [
        'department_id', 'day_of_week', 'opens_at', 'closes_at', 'is_closed',
    ];

    protected function casts(): array
    {
        return ['is_closed' => 'boolean', 'day_of_week' => 'integer'];
    }

    public function getDayNameAttribute(): string
    {
        return self::DAYS[$this->day_of_week] ?? 'Unknown';
    }

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
