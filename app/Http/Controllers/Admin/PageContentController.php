<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    /** Groups the admin may edit, mapped to their heading. */
    public const GROUPS = [
        'home' => 'Home page',
        'services' => 'Services page',
        'philosophy' => 'Philosophy page',
        'faq' => 'FAQ page',
        'contact' => 'Contact page',
        'site' => 'Site-wide',
    ];

    public function edit(string $group): Response
    {
        abort_unless(array_key_exists($group, self::GROUPS), 404);

        return Inertia::render('admin/page-content', [
            'group' => $group,
            'groupLabel' => self::GROUPS[$group],
            'fields' => $this->fields($group),
        ]);
    }

    public function update(Request $request, string $group): RedirectResponse
    {
        abort_unless(array_key_exists($group, self::GROUPS), 404);

        $settings = SiteSetting::query()->where('group', $group)->get();

        $validated = $request->validate([
            'values' => ['required', 'array'],
            'values.*' => ['nullable', 'string', 'max:20000'],
        ]);

        foreach ($settings as $setting) {
            if (! array_key_exists($setting->key, $validated['values'])) {
                continue;
            }

            $value = $validated['values'][$setting->key];

            $setting->update([
                'value' => $setting->type === 'html'
                    ? HtmlSanitizer::clean($value)
                    : $value,
            ]);
        }

        \App\Services\ActivityLogger::log(
            action: 'updated',
            subjectType: 'PageContent',
            subjectId: null,
            subjectTitle: self::GROUPS[$group],
            details: ['group' => $group, 'updated_keys' => array_keys($validated['values'])]
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __(':page updated.', ['page' => self::GROUPS[$group]]),
        ]);

        return to_route('admin.pages.edit', $group);
    }

    /**
     * The settings in a group, shaped for the admin form.
     *
     * @return list<array<string, mixed>>
     */
    private function fields(string $group): array
    {
        return SiteSetting::query()
            ->where('group', $group)
            ->orderBy('key')
            ->get()
            ->map(fn (SiteSetting $setting): array => [
                'key' => $setting->key,
                'label' => $this->labelFor($setting->key),
                'section' => $this->sectionFor($setting->key),
                'type' => $setting->type,
                'value' => $setting->value,
            ])
            ->values()
            ->all();
    }

    /**
     * "home.hero.title_lead" -> "Title lead"
     */
    private function labelFor(string $key): string
    {
        $parts = explode('.', $key);

        return ucfirst(str_replace('_', ' ', (string) end($parts)));
    }

    /**
     * "home.hero.title_lead" -> "Hero"; groups fields on the form.
     */
    private function sectionFor(string $key): string
    {
        $parts = explode('.', $key);

        return count($parts) >= 3
            ? ucfirst(str_replace('_', ' ', $parts[1]))
            : 'General';
    }
}
