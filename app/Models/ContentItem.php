<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ContentItem extends Model
{
    /** Collections the admin can manage, mapped to their display name. */
    public const COLLECTIONS = [
        'pillars' => 'Philosophy pillars',
        'home_highlights' => 'Home page highlights',
        'clinic_details' => 'Clinic details',
        'faqs' => 'Frequently asked questions',
    ];

    protected $fillable = [
        'collection',
        'title',
        'body',
        'icon',
        'image_path',
        'meta',
        'position',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'is_published' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function scopeInCollection(Builder $query, string $collection): Builder
    {
        return $query->where('collection', $collection)->orderBy('position');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
