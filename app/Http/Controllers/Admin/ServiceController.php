<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Service;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Services are a first-class table (doctors, appointments and testimonials
 * point at them), so they get their own screens rather than riding along
 * with the generic content collections.
 */
class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/content/index', [
            'collection' => 'services',
            'collectionLabel' => 'Services',
            'basePath' => '/admin/services',
            'items' => Service::query()
                ->ordered()
                ->with('department:id,name')
                ->get()
                ->map(fn (Service $service): array => [
                    'id' => $service->id,
                    'title' => $service->title,
                    'body' => $service->body,
                    'icon' => $service->icon,
                    'position' => $service->position,
                    'is_published' => $service->is_published,
                    'meta' => $service->meta ?? [],
                    'badge' => $service->department?->name,
                ])
                ->values()
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/content/form', [
            'collection' => 'services',
            'collectionLabel' => 'Services',
            'basePath' => '/admin/services',
            'item' => null,
            'departments' => $this->departments(),
            'doctors' => $this->doctors(),
        ]);
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('admin/content/form', [
            'collection' => 'services',
            'collectionLabel' => 'Services',
            'basePath' => '/admin/services',
            'item' => [
                'id' => $service->id,
                'title' => $service->title,
                'body' => $service->body,
                'icon' => $service->icon,
                'image_path' => $service->image_path,
                'is_published' => $service->is_published,
                'meta' => $service->meta ?? [],
                'department_id' => $service->department_id,
                'duration_minutes' => $service->duration_minutes,
                'price' => $service->price,
                'doctor_ids' => $service->doctors()->pluck('doctors.id')->all(),
            ],
            'departments' => $this->departments(),
            'doctors' => $this->doctors(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $service = Service::query()->create([
            ...$data['attributes'],
            'position' => (int) Service::query()->max('position') + 1,
        ]);

        $service->doctors()->sync($data['doctor_ids']);

        \App\Services\ActivityLogger::log(
            action: 'created',
            subjectType: 'Service',
            subjectId: $service->id,
            subjectTitle: $service->title,
            details: ['price' => $service->price, 'duration' => $service->duration_minutes]
        );

        return $this->done(__('Service created.'));
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $data = $this->validated($request);

        $service->update($data['attributes']);
        $service->doctors()->sync($data['doctor_ids']);

        \App\Services\ActivityLogger::log(
            action: 'updated',
            subjectType: 'Service',
            subjectId: $service->id,
            subjectTitle: $service->title,
            details: ['updated_attributes' => array_keys($data['attributes'])]
        );

        return $this->done(__('Service updated.'));
    }

    public function destroy(Service $service): RedirectResponse
    {
        $title = $service->title;
        $id = $service->id;
        $service->delete();

        \App\Services\ActivityLogger::log(
            action: 'deleted',
            subjectType: 'Service',
            subjectId: $id,
            subjectTitle: $title,
            details: []
        );

        return $this->done(__('Service deleted.'));
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        foreach ($validated['ids'] as $position => $id) {
            Service::query()->whereKey($id)->update(['position' => $position]);
        }

        \App\Services\ActivityLogger::log(
            action: 'reordered',
            subjectType: 'Service',
            subjectId: null,
            subjectTitle: 'Reordered services list',
            details: ['count' => count($validated['ids'])]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order saved.')]);

        return back();
    }

    /**
     * @return array{attributes: array<string, mixed>, doctor_ids: list<int>}
     */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:20000'],
            'icon' => ['nullable', 'string', 'max:64'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'duration_minutes' => ['nullable', 'integer', 'min:0', 'max:1440'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:999999'],
            'is_published' => ['boolean'],
            'doctor_ids' => ['nullable', 'array'],
            'doctor_ids.*' => ['integer', 'exists:doctors,id'],
            'meta' => ['nullable', 'array'],
            'meta.tone' => ['nullable', 'string', 'max:64'],
            'meta.cta' => ['nullable', 'string', 'max:64'],
            'meta.featured' => ['nullable', 'boolean'],
            'meta.show_on_home' => ['nullable', 'boolean'],
        ]);

        $doctorIds = array_map('intval', $validated['doctor_ids'] ?? []);
        unset($validated['doctor_ids']);

        $validated['body'] = HtmlSanitizer::clean($validated['body'] ?? null);
        $validated['is_published'] = (bool) ($validated['is_published'] ?? true);

        return ['attributes' => $validated, 'doctor_ids' => $doctorIds];
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function departments(): array
    {
        return Department::query()
            ->orderBy('position')
            ->get(['id', 'name'])
            ->map(fn (Department $d): array => ['id' => $d->id, 'name' => $d->name])
            ->all();
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function doctors(): array
    {
        return Doctor::query()
            ->orderBy('position')
            ->get(['id', 'name'])
            ->map(fn (Doctor $d): array => ['id' => $d->id, 'name' => $d->name])
            ->all();
    }

    private function done(string $message): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return to_route('admin.services.index');
    }
}
