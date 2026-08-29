<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Services were CMS blocks in `content_items`. They are now a first-class
 * table so doctors, appointments and testimonials can point at them.
 */
return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('content_items')
            ->where('collection', 'services')
            ->orderBy('position')
            ->get();

        foreach ($rows as $row) {
            DB::table('services')->insert([
                'title' => $row->title,
                'slug' => $this->uniqueSlug($row->title),
                'body' => $row->body,
                'icon' => $row->icon,
                'image_path' => $row->image_path,
                'meta' => $row->meta,
                'position' => $row->position,
                'is_published' => $row->is_published,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ]);
        }

        DB::table('content_items')->where('collection', 'services')->delete();
    }

    public function down(): void
    {
        $rows = DB::table('services')->orderBy('position')->get();

        foreach ($rows as $row) {
            DB::table('content_items')->insert([
                'collection' => 'services',
                'title' => $row->title,
                'body' => $row->body,
                'icon' => $row->icon,
                'image_path' => $row->image_path,
                'meta' => $row->meta,
                'position' => $row->position,
                'is_published' => $row->is_published,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ]);
        }

        DB::table('services')->delete();
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'service';
        $slug = $base;
        $suffix = 2;

        while (DB::table('services')->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
};
