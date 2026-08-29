<?php

namespace App\Support;

use App\Models\ContentItem;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Support\Collection;

/**
 * Builds the props each public page needs out of the database.
 *
 * Keys here mirror the shape the React pages expect, so the sections stay
 * dumb: they render what they are handed.
 */
class SiteContent
{
    /**
     * @return array<string, mixed>
     */
    public static function shared(): array
    {
        return [
            'name' => self::get('site.name', 'Lumina Wellness'),
            'tagline' => self::get('site.tagline', 'Dedicated to Human-Centric Care.'),
            'description' => self::get('site.description', 'Holistic, human-centered medical care blending clinical excellence with domestic comfort to nurture mind, body, and spirit.'),
            'phone' => self::get('site.phone', '(503) 555-0199'),
            'phoneHref' => self::get('site.phone_href', 'tel:+15035550199'),
            'email' => self::get('site.email', 'care@luminawellness.com'),
            'address' => self::get('site.address', '123 Tranquil Lane, Portland, OR 97204'),
            'hours' => self::get('site.hours', 'Mon – Fri: 9:00 AM – 6:00 PM (Sat & Sun Closed)'),
            'social' => [
                'instagram' => self::get('site.instagram_url', 'https://instagram.com/luminawellness'),
                'facebook' => self::get('site.facebook_url', 'https://facebook.com/luminawellness'),
                'telegram' => self::get('site.telegram_url', 'https://t.me/LuminaWellnessBot'),
                'x' => self::get('site.x_url', 'https://x.com/luminawellness'),
                'tiktok' => self::get('site.tiktok_url', 'https://tiktok.com/@luminawellness'),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function home(): array
    {
        return [
            'hero' => [
                'badge' => self::get('home.hero.badge'),
                'titleLead' => self::get('home.hero.title_lead'),
                'titleAccent' => self::get('home.hero.title_accent'),
                'description' => self::get('home.hero.description'),
                'primaryCta' => self::get('home.hero.primary_cta'),
                'secondaryCta' => self::get('home.hero.secondary_cta'),
                'image' => self::get('home.hero.image'),
                'cardTitle' => self::get('home.hero.card_title'),
                'cardSubtitle' => self::get('home.hero.card_subtitle'),
            ],
            'philosophy' => [
                'title' => self::get('home.philosophy.title'),
                'body' => self::get('home.philosophy.body'),
                'link' => self::get('home.philosophy.link'),
                'statValue' => self::get('home.philosophy.stat_value'),
                'statLabel' => self::get('home.philosophy.stat_label'),
                'imageHands' => self::get('home.philosophy.image_hands'),
                'imageRoom' => self::get('home.philosophy.image_room'),
                'highlights' => self::items('home_highlights')
                    ->pluck('title')
                    ->all(),
            ],
            'services' => [
                'title' => self::get('home.services.title'),
                'subtitle' => self::get('home.services.subtitle'),
                'featured' => [
                    'title' => self::get('home.services.featured_title'),
                    'body' => self::get('home.services.featured_body'),
                    'icon' => self::get('home.services.featured_icon'),
                    'image' => self::get('home.services.featured_image'),
                ],
                'cards' => self::publishedServices()
                    ->filter(fn (Service $service): bool => (bool) ($service->meta['show_on_home'] ?? false))
                    ->take(2)
                    ->map(fn (Service $service): array => [
                        'id' => $service->id,
                        'title' => $service->title,
                        'body' => $service->body,
                        'icon' => $service->icon,
                        'tone' => $service->meta['tone'] ?? 'bg-mint',
                    ])
                    ->values()
                    ->all(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function services(): array
    {
        $services = self::publishedServices();

        $featured = $services->first(
            fn (Service $service): bool => (bool) ($service->meta['featured'] ?? false),
        );

        return [
            'page' => [
                'title' => self::get('services.page.title'),
                'subtitle' => self::get('services.page.subtitle'),
            ],
            'discovery' => [
                'title' => self::get('services.discovery.title'),
                'body' => self::get('services.discovery.body'),
                'cta' => self::get('services.discovery.cta'),
            ],
            // The featured item renders as the photo card, so it is kept out
            // of the plain grid to avoid showing it twice.
            'items' => $services
                ->reject(fn (Service $s): bool => $featured !== null && $s->is($featured))
                ->map(fn (Service $service): array => [
                    'id' => $service->id,
                    'title' => $service->title,
                    'body' => $service->body,
                    'icon' => $service->icon,
                ])
                ->values()
                ->all(),
            'featured' => $featured === null ? null : [
                'id' => $featured->id,
                'title' => $featured->title,
                'body' => $featured->body,
                'icon' => $featured->icon,
                'image' => $featured->image_path,
                'cta' => $featured->meta['cta'] ?? 'Learn more',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function philosophy(): array
    {
        $values = [
            'title' => self::get('philosophy.values.title', 'Core Values'),
            'items' => self::items('pillars')
                ->map(fn (ContentItem $item): array => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'body' => $item->body,
                    'icon' => $item->icon,
                    'tone' => $item->meta['tone'] ?? 'bg-[#104838] text-white',
                ])
                ->values()
                ->all(),
        ];

        return [
            'page' => [
                'title' => self::get('philosophy.page.title', 'About Serene Hearth'),
                'subtitle' => self::get('philosophy.page.subtitle', 'Healing begins where you feel most comfortable. We envisioned a clinic that feels less like a facility and more like a sanctuary.'),
            ],
            'story' => [
                'badge' => self::get('philosophy.story.badge', 'Our Story'),
                'title' => self::get('philosophy.story.title', 'Our Story'),
                'body' => self::get('philosophy.story.body', '<p>It started with a simple observation: clinical environments often induce anxiety rather than alleviate it. Founded in a repurposed historic home, Serene Hearth was born from the desire to offer world-class holistic care in a setting that feels like a welcoming living room.</p><p>We replaced sterile white walls with warm, earthy tones, harsh fluorescent lights with soft natural illumination, and cold waiting rooms with cozy, plant-filled spaces. Our journey has always been about putting the human experience at the center of wellness.</p>'),
                'imageLabel' => self::get('philosophy.story.image_label', 'Our Philosophy'),
                'image' => self::get('philosophy.story.image', '/images/philosophy/story-lounge.svg'),
            ],
            'values' => $values,
            'pillars' => $values,
            'team' => [
                'title' => self::get('philosophy.team.title', 'Meet The Team'),
                'members' => Doctor::query()
                    ->published()
                    ->orderBy('position')
                    ->get()
                    ->map(fn (Doctor $doctor): array => [
                        'id' => $doctor->id,
                        'name' => $doctor->name,
                        'title' => $doctor->title,
                        'bio' => $doctor->bio,
                        'photo' => $doctor->photo_path,
                    ])
                    ->values()
                    ->all(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function faq(): array
    {
        return [
            'page' => [
                'title' => self::get('faq.page.title', 'How can we support your wellness journey?'),
                'subtitle' => self::get('faq.page.subtitle', 'Find answers to common questions about our services, booking process, and clinic policies. We\'re here to make your experience as seamless as possible.'),
                'searchPlaceholder' => self::get('faq.hero.search_placeholder', 'Search for answers...'),
            ],
            'contactCard' => [
                'title' => self::get('faq.contact_card.title', 'Still have questions?'),
                'body' => self::get('faq.contact_card.body', 'Our care team is always here to assist you with anything not covered in our FAQ.'),
                'cta' => self::get('faq.contact_card.cta', 'Contact Us'),
                'image' => self::get('faq.contact_card.image', '/images/faq/reception.svg'),
            ],
            'categories' => [
                [
                    'id' => 'appointments',
                    'label' => 'Appointments',
                    'icon' => 'Calendar',
                    'tone' => 'bg-[#bde8e2] text-[#104838]',
                ],
                [
                    'id' => 'services',
                    'label' => 'Services',
                    'icon' => 'Sparkles',
                    'tone' => 'bg-[#bde8e2] text-[#104838]',
                ],
                [
                    'id' => 'billing',
                    'label' => 'Insurance & Billing',
                    'icon' => 'CreditCard',
                    'tone' => 'bg-[#bde8e2] text-[#104838]',
                ],
                [
                    'id' => 'policies',
                    'label' => 'Clinic Policies',
                    'icon' => 'Building2',
                    'tone' => 'bg-[#bde8e2] text-[#104838]',
                ],
            ],
            'faqs' => self::items('faqs')
                ->map(fn (ContentItem $item): array => [
                    'id' => $item->id,
                    'category' => $item->meta['category'] ?? 'appointments',
                    'categoryLabel' => $item->meta['category_label'] ?? 'Appointments',
                    'question' => $item->title,
                    'answer' => $item->body,
                    'icon' => $item->icon,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function contact(): array
    {
        return [
            'page' => [
                'title' => self::get('contact.page.title'),
                'subtitle' => self::get('contact.page.subtitle'),
            ],
            'form' => [
                'title' => self::get('contact.form.title'),
                'submit' => self::get('contact.form.submit'),
            ],
            'map' => [
                'image' => self::get('contact.map.image'),
                'alt' => self::get('contact.map.alt'),
            ],
            'serviceOptions' => self::publishedServices()->pluck('title')->all(),
            'details' => self::items('clinic_details')
                ->map(fn (ContentItem $item): array => [
                    'id' => $item->id,
                    'label' => $item->title,
                    'icon' => $item->icon,
                    'lines' => $item->meta['lines'] ?? [],
                    'badge' => $item->meta['badge'] ?? null,
                    'href' => $item->meta['href'] ?? null,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Published services, in admin-defined order.
     *
     * @return Collection<int, Service>
     */
    private static function publishedServices(): Collection
    {
        return Service::query()->published()->ordered()->get();
    }

    /**
     * Published items in a collection, in admin-defined order.
     *
     * @return Collection<int, ContentItem>
     */
    private static function items(string $collection): Collection
    {
        return ContentItem::query()
            ->inCollection($collection)
            ->published()
            ->get();
    }

    private static function get(string $key, ?string $default = null): ?string
    {
        // all_values() is cached until a setting is saved, so repeated
        // lookups within a request stay cheap without a second cache here.
        $value = SiteSetting::all_values()[$key] ?? $default;

        return is_string($value) ? $value : $default;
    }
}
