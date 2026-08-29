<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentItem;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContentItemController extends Controller
{
    public function index(string $collection): Response
    {
        $this->guard($collection);

        return Inertia::render('admin/content/index', [
            'collection' => $collection,
            'collectionLabel' => ContentItem::COLLECTIONS[$collection],
            'basePath' => "/admin/content/{$collection}",
            'items' => ContentItem::query()
                ->inCollection($collection)
                ->get()
                ->map(fn (ContentItem $item): array => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'body' => $item->body,
                    'icon' => $item->icon,
                    'position' => $item->position,
                    'is_published' => $item->is_published,
                    'meta' => $item->meta ?? [],
                ])
                ->values()
                ->all(),
        ]);
    }

    public function create(string $collection): Response
    {
        $this->guard($collection);

        return Inertia::render('admin/content/form', [
            'collection' => $collection,
            'collectionLabel' => ContentItem::COLLECTIONS[$collection],
            'basePath' => "/admin/content/{$collection}",
            'item' => null,
        ]);
    }

    public function edit(string $collection, ContentItem $item): Response
    {
        $this->guard($collection);
        abort_unless($item->collection === $collection, 404);

        return Inertia::render('admin/content/form', [
            'collection' => $collection,
            'collectionLabel' => ContentItem::COLLECTIONS[$collection],
            'basePath' => "/admin/content/{$collection}",
            'item' => [
                'id' => $item->id,
                'title' => $item->title,
                'body' => $item->body,
                'icon' => $item->icon,
                'image_path' => $item->image_path,
                'is_published' => $item->is_published,
                'meta' => $item->meta ?? [],
            ],
        ]);
    }

    public function store(Request $request, string $collection): RedirectResponse
    {
        $this->guard($collection);

        $data = $this->validated($request);

        $item = ContentItem::query()->create([
            ...$data,
            'collection' => $collection,
            'position' => (int) ContentItem::query()
                ->where('collection', $collection)
                ->max('position') + 1,
        ]);

        \App\Services\ActivityLogger::log(
            action: 'created',
            subjectType: 'ContentItem',
            subjectId: $item->id,
            subjectTitle: "{$item->title} ({$collection})",
            details: ['collection' => $collection, 'data' => $data]
        );

        return $this->done($collection, __('Item created.'));
    }

    public function update(
        Request $request,
        string $collection,
        ContentItem $item,
    ): RedirectResponse {
        $this->guard($collection);
        abort_unless($item->collection === $collection, 404);

        $data = $this->validated($request);
        $item->update($data);

        \App\Services\ActivityLogger::log(
            action: 'updated',
            subjectType: 'ContentItem',
            subjectId: $item->id,
            subjectTitle: "{$item->title} ({$collection})",
            details: ['collection' => $collection, 'updated_fields' => array_keys($data)]
        );

        return $this->done($collection, __('Item updated.'));
    }

    public function destroy(string $collection, ContentItem $item): RedirectResponse
    {
        $this->guard($collection);
        abort_unless($item->collection === $collection, 404);

        $title = $item->title;
        $id = $item->id;
        $item->delete();

        \App\Services\ActivityLogger::log(
            action: 'deleted',
            subjectType: 'ContentItem',
            subjectId: $id,
            subjectTitle: "{$title} ({$collection})",
            details: ['collection' => $collection]
        );

        return $this->done($collection, __('Item deleted.'));
    }

    /**
     * Persist a new drag-and-drop order.
     */
    public function reorder(Request $request, string $collection): RedirectResponse
    {
        $this->guard($collection);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        foreach ($validated['ids'] as $position => $id) {
            ContentItem::query()
                ->where('collection', $collection)
                ->whereKey($id)
                ->update(['position' => $position]);
        }

        \App\Services\ActivityLogger::log(
            action: 'reordered',
            subjectType: 'ContentItem',
            subjectId: null,
            subjectTitle: "Reordered {$collection} items",
            details: ['collection' => $collection, 'count' => count($validated['ids'])]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order saved.')]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:20000'],
            'icon' => ['nullable', 'string', 'max:64'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'is_published' => ['boolean'],
            'meta' => ['nullable', 'array'],
            'meta.tone' => ['nullable', 'string', 'max:64'],
            'meta.cta' => ['nullable', 'string', 'max:64'],
            'meta.badge' => ['nullable', 'string', 'max:64'],
            'meta.href' => ['nullable', 'string', 'max:255'],
            'meta.featured' => ['nullable', 'boolean'],
            'meta.show_on_home' => ['nullable', 'boolean'],
            'meta.lines' => ['nullable', 'array'],
            'meta.lines.*' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['body'] = HtmlSanitizer::clean($validated['body'] ?? null);
        $validated['is_published'] = (bool) ($validated['is_published'] ?? true);

        return $validated;
    }

    private function guard(string $collection): void
    {
        abort_unless(
            array_key_exists($collection, ContentItem::COLLECTIONS),
            404,
        );
    }

    private function done(string $collection, string $message): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return to_route('admin.content.index', $collection);
    }
}
