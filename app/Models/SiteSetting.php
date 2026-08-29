<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'group', 'value', 'type'];

    protected static function booted(): void
    {
        $flush = fn () => Cache::forget(self::CACHE_KEY);

        static::saved($flush);
        static::deleted($flush);
    }

    public const CACHE_KEY = 'site_settings.all';

    /**
     * Every setting, keyed by its dot-notated key.
     *
     * @return array<string, mixed>
     */
    public static function all_values(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            return static::query()
                ->get()
                ->mapWithKeys(fn (SiteSetting $setting): array => [
                    $setting->key => $setting->casted_value,
                ])
                ->all();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $all = self::all_values();

        return $all[$key] ?? $default;
    }

    /**
     * Settings for one admin screen, as a flat key => value array.
     *
     * @return array<string, mixed>
     */
    public static function group(string $group): array
    {
        return static::query()
            ->where('group', $group)
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn (SiteSetting $setting): array => [
                $setting->key => $setting->casted_value,
            ])
            ->all();
    }

    /**
     * Decode the stored string according to the setting's type.
     */
    public function getCastedValueAttribute(): mixed
    {
        if ($this->type === 'list') {
            return json_decode((string) $this->value, true) ?: [];
        }

        return $this->value;
    }
}
