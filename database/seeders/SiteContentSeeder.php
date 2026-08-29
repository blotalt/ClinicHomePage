<?php

namespace Database\Seeders;

use App\Models\ContentItem;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

/**
 * Seeds the public site with the copy that used to live in the React
 * content files. Safe to re-run: settings are upserted by key, and each
 * content collection is only filled when it is empty.
 */
class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSettings();
        $this->seedServices();
        $this->seedCollection('pillars', $this->pillars());
        $this->seedCollection('home_highlights', $this->highlights());
        $this->seedCollection('clinic_details', $this->clinicDetails());
        $this->seedCollection('faqs', $this->faqs());
    }

    /**
     * Services are a first-class table, not a CMS collection.
     */
    private function seedServices(): void
    {
        if (Service::query()->exists()) {
            return;
        }

        foreach ($this->services() as $position => $service) {
            Service::query()->create([...$service, 'position' => $position]);
        }
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function seedCollection(string $collection, array $items): void
    {
        if (ContentItem::query()->where('collection', $collection)->exists()) {
            return;
        }

        foreach ($items as $position => $item) {
            ContentItem::query()->create([
                ...$item,
                'collection' => $collection,
                'position' => $position,
            ]);
        }
    }

    private function seedSettings(): void
    {
        foreach ($this->settings() as $group => $entries) {
            foreach ($entries as $key => [$type, $value]) {
                SiteSetting::query()->updateOrCreate(
                    ['key' => $key],
                    [
                        'group' => $group,
                        'type' => $type,
                        'value' => $type === 'list' ? json_encode($value) : $value,
                    ],
                );
            }
        }
    }

    /**
     * @return array<string, array<string, array{string, mixed}>>
     */
    private function settings(): array
    {
        return [
            'site' => [
                'site.name' => ['text', 'Lumina Wellness'],
                'site.tagline' => ['text', 'Dedicated to Human-Centric Care.'],
                'site.description' => ['text', 'Holistic, human-centered medical care blending clinical excellence with domestic comfort to nurture mind, body, and spirit.'],
                'site.phone' => ['text', '(503) 555-0199'],
                'site.phone_href' => ['text', 'tel:+15035550199'],
                'site.email' => ['text', 'care@luminawellness.com'],
                'site.address' => ['text', '123 Tranquil Lane, Portland, OR 97204'],
                'site.hours' => ['text', 'Mon – Fri: 9:00 AM – 6:00 PM (Sat & Sun Closed)'],
                'site.instagram_url' => ['text', 'https://instagram.com/luminawellness'],
                'site.facebook_url' => ['text', 'https://facebook.com/luminawellness'],
                'site.telegram_url' => ['text', 'https://t.me/LuminaWellnessBot'],
                'site.x_url' => ['text', 'https://x.com/luminawellness'],
                'site.tiktok_url' => ['text', 'https://tiktok.com/@luminawellness'],
            ],
            'home' => [
                'home.hero.badge' => ['text', 'Human-Centric Care'],
                'home.hero.title_lead' => ['text', 'Healthcare that feels like'],
                'home.hero.title_accent' => ['text', 'home.'],
                'home.hero.description' => ['html', '<p>Experience a new standard of personalized medicine. We blend clinical excellence with domestic comfort to provide holistic, attentive care tailored specifically to you.</p>'],
                'home.hero.primary_cta' => ['text', 'Start Your Journey'],
                'home.hero.secondary_cta' => ['text', 'Meet Our Team'],
                'home.hero.image' => ['text', '/images/home/hero.svg'],
                'home.hero.card_title' => ['text', 'Holistic Approach'],
                'home.hero.card_subtitle' => ['text', 'Mind, Body, & Spirit'],
                'home.philosophy.title' => ['text', 'Redefining the Clinic Experience'],
                'home.philosophy.body' => ['html', '<p>We believe that healing begins the moment you walk through our doors. Our space is designed to reduce anxiety and promote tranquility, moving away from sterile environments to embrace a warm, boutique aesthetic.</p><p>Every patient is unique, and our unhurried consultations ensure we understand your full health story. We prioritize your time, your comfort, and your specific wellness goals.</p>'],
                'home.philosophy.link' => ['text', 'Read our full philosophy'],
                'home.philosophy.stat_value' => ['text', '98%'],
                'home.philosophy.stat_label' => ['text', 'Patient Satisfaction'],
                'home.philosophy.image_hands' => ['text', '/images/home/care-hands.svg'],
                'home.philosophy.image_room' => ['text', '/images/home/consulting-room.svg'],
                'home.services.title' => ['text', 'Comprehensive Care Offerings'],
                'home.services.subtitle' => ['html', '<p>Tailored medical services designed to support you at every stage of life, housed within a serene environment.</p>'],
                'home.services.featured_title' => ['text', 'Primary & Family Medicine'],
                'home.services.featured_body' => ['html', '<p>Continuous, comprehensive healthcare for the individual and family across all ages, genders, and diseases.</p>'],
                'home.services.featured_icon' => ['text', 'Users'],
                'home.services.featured_image' => ['text', '/images/home/consultation.svg'],
            ],
            'services' => [
                'services.page.title' => ['text', 'Comprehensive Care for Your Wellbeing'],
                'services.page.subtitle' => ['html', '<p>Experience healthcare designed around you. We combine clinical excellence with a welcoming environment to provide holistic services for you and your family.</p>'],
                'services.discovery.title' => ['text', 'Not sure which service you need?'],
                'services.discovery.body' => ['html', '<p>Schedule a brief discovery call with our care coordinators to discuss your needs and find the right path for your wellness journey.</p>'],
                'services.discovery.cta' => ['text', 'Book a Consultation'],
            ],
            'philosophy' => [
                'philosophy.page.title' => ['text', 'About Serene Hearth'],
                'philosophy.page.subtitle' => ['text', 'Healing begins where you feel most comfortable. We envisioned a clinic that feels less like a facility and more like a sanctuary.'],
                'philosophy.story.badge' => ['text', 'Our Story'],
                'philosophy.story.title' => ['text', 'Our Story'],
                'philosophy.story.body' => ['html', '<p>It started with a simple observation: clinical environments often induce anxiety rather than alleviate it. Founded in a repurposed historic home, Serene Hearth was born from the desire to offer world-class holistic care in a setting that feels like a welcoming living room.</p><p>We replaced sterile white walls with warm, earthy tones, harsh fluorescent lights with soft natural illumination, and cold waiting rooms with cozy, plant-filled spaces. Our journey has always been about putting the human experience at the center of wellness.</p>'],
                'philosophy.story.image_label' => ['text', 'Our Philosophy'],
                'philosophy.story.image' => ['text', '/images/philosophy/story-lounge.svg'],
                'philosophy.values.title' => ['text', 'Core Values'],
                'philosophy.team.title' => ['text', 'Meet The Team'],
            ],
            'faq' => [
                'faq.page.title' => ['text', 'How can we support your wellness journey?'],
                'faq.page.subtitle' => ['text', 'Find answers to common questions about our services, booking process, and clinic policies. We\'re here to make your experience as seamless as possible.'],
                'faq.hero.search_placeholder' => ['text', 'Search for answers...'],
                'faq.contact_card.title' => ['text', 'Still have questions?'],
                'faq.contact_card.body' => ['text', 'Our care team is always here to assist you with anything not covered in our FAQ.'],
                'faq.contact_card.cta' => ['text', 'Contact Us'],
                'faq.contact_card.image' => ['text', '/images/faq/reception.svg'],
            ],
            'contact' => [
                'contact.page.title' => ['text', 'Let\'s Connect'],
                'contact.page.subtitle' => ['html', '<p>We\'re here to answer your questions and help you begin your journey to holistic wellness in a comfortable, home-like setting.</p>'],
                'contact.form.title' => ['text', 'Request an Appointment'],
                'contact.form.submit' => ['text', 'Send Request'],
                'contact.map.image' => ['text', '/images/contact/map.svg'],
                'contact.map.alt' => ['text', 'Map showing the clinic location in Portland'],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function services(): array
    {
        return [
            [
                'title' => 'General Consultation',
                'icon' => 'Stethoscope',
                'body' => '<p>Comprehensive assessments to address your immediate health concerns, manage chronic conditions, and establish a baseline for your overall wellness journey.</p>',
            ],
            [
                'title' => 'Wellness Exams',
                'icon' => 'Heart',
                'body' => '<p>Proactive health screenings tailored to your age and lifestyle. We focus on preventative care to help you maintain optimal health and vitality.</p>',
                'meta' => ['show_on_home' => true, 'tone' => 'bg-mint'],
            ],
            [
                'title' => 'Minor Procedures',
                'icon' => 'BriefcaseMedical',
                'body' => '<p>Safe and efficient in-clinic procedures performed by our skilled practitioners in a comfortable, sterile environment, minimizing your need for hospital visits.</p>',
            ],
            [
                'title' => 'Telehealth',
                'icon' => 'Video',
                'body' => '<p>Convenient virtual consultations from the comfort of your home. Ideal for follow-ups, minor acute illnesses, and ongoing health management.</p>',
            ],
            [
                'title' => 'Nutritional Counseling',
                'icon' => 'Apple',
                'body' => '<p>Personalized dietary guidance to support your health goals, manage chronic diseases, and foster a healthy relationship with food.</p>',
                'meta' => ['show_on_home' => true, 'tone' => 'bg-sage'],
            ],
            [
                'title' => 'Holistic Therapy',
                'icon' => 'Sprout',
                'body' => '<p>Integrative approaches combining traditional medicine with evidence-based alternative therapies for comprehensive mind-body wellness.</p>',
                'image_path' => '/images/home/consulting-room.svg',
                'meta' => ['featured' => true, 'cta' => 'Explore therapies'],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pillars(): array
    {
        return [
            [
                'title' => 'Holistic Understanding',
                'icon' => 'Sprout',
                'meta' => ['tone' => 'bg-brand text-white'],
                'body' => '<p>We look at the interconnectedness of your lifestyle, environment, and physical health to uncover the root causes of imbalance.</p>',
            ],
            [
                'title' => 'Collaborative Care',
                'icon' => 'Handshake',
                'meta' => ['tone' => 'bg-mint text-brand'],
                'body' => '<p>Your health journey is a partnership. We prioritize active listening and shared decision-making to empower you.</p>',
            ],
            [
                'title' => 'A Comforting Environment',
                'icon' => 'House',
                'meta' => ['tone' => 'bg-sky text-brand'],
                'body' => '<p>We have designed our clinic to feel like a warm extension of your home, reducing clinical anxiety and promoting relaxation.</p>',
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function highlights(): array
    {
        return [
            ['title' => 'Extended consultation times for thorough care.'],
            ['title' => 'Direct access to your dedicated care team.'],
            ['title' => 'Integrated wellness plans focusing on prevention.'],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function clinicDetails(): array
    {
        return [
            [
                'title' => 'Location',
                'icon' => 'MapPin',
                'meta' => [
                    'lines' => ['123 Tranquil Lane', 'Portland, OR 97204'],
                    'badge' => 'By Appointment Only',
                ],
            ],
            [
                'title' => 'Phone',
                'icon' => 'Phone',
                'meta' => [
                    'lines' => ['(503) 555-0199'],
                    'href' => 'tel:+15035550199',
                ],
            ],
            [
                'title' => 'Email',
                'icon' => 'Mail',
                'meta' => [
                    'lines' => ['care@luminawellness.com'],
                    'href' => 'mailto:care@luminawellness.com',
                ],
            ],
            [
                'title' => 'Hours',
                'icon' => 'Clock',
                'meta' => [
                    'lines' => ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat & Sun: Closed'],
                ],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function faqs(): array
    {
        return [
            // Appointments
            [
                'title' => 'How do I schedule my first consultation?',
                'icon' => 'Calendar',
                'meta' => ['category' => 'appointments', 'category_label' => 'Appointments'],
                'body' => '<p>You can schedule your first consultation directly online through our Contact page, or by calling our care coordinator at (503) 555-0199. We will guide you through choosing the right practitioner and preparing for your initial appointment.</p>',
            ],
            [
                'title' => 'What should I bring to my first appointment?',
                'icon' => 'Clock',
                'meta' => ['category' => 'appointments', 'category_label' => 'Appointments'],
                'body' => '<p>Please bring a photo ID, any current medications or supplements you are taking, and recent lab results or health records. We also recommend arriving 10 minutes early to settle into our reception lounge with a cup of herbal tea.</p>',
            ],
            [
                'title' => 'How long do consultations typically last?',
                'icon' => 'Clock',
                'meta' => ['category' => 'appointments', 'category_label' => 'Appointments'],
                'body' => '<p>Initial comprehensive consultations last between 45 to 60 minutes. Follow-up visits range from 20 to 45 minutes, ensuring unhurried time to review your progress and adjust your care plan.</p>',
            ],

            // Services
            [
                'title' => 'Do you offer holistic nutrition counseling?',
                'icon' => 'Leaf',
                'meta' => ['category' => 'services', 'category_label' => 'Services'],
                'body' => '<p>Yes! Our registered dietitian and naturopathic doctors provide comprehensive, personalized nutritional assessments, meal planning, and gut health optimization tailored to your body\'s specific metabolic needs.</p>',
            ],
            [
                'title' => 'What is the difference between naturopathy and conventional medicine?',
                'icon' => 'Sprout',
                'meta' => ['category' => 'services', 'category_label' => 'Services'],
                'body' => '<p>Naturopathic medicine focuses on addressing root causes and supporting the body\'s natural self-healing mechanisms using gentle, evidence-based therapies, while working in full harmony with conventional medical treatments when needed.</p>',
            ],
            [
                'title' => 'Can I combine acupuncture with herbal therapies?',
                'icon' => 'Sparkles',
                'meta' => ['category' => 'services', 'category_label' => 'Services'],
                'body' => '<p>Absolutely. Our licensed acupuncturist and herbalist frequently pairs gentle acupuncture sessions with customized herbal formulations to maximize restorative benefits and promote holistic healing.</p>',
            ],

            // Insurance & Billing
            [
                'title' => 'Do you accept health insurance?',
                'icon' => 'CreditCard',
                'meta' => ['category' => 'billing', 'category_label' => 'Insurance & Billing'],
                'body' => '<p>We are an out-of-network clinic to ensure unrestricted, personalized patient care. We provide itemized superbills after each appointment that you can submit directly to your insurance company for reimbursement or HSA/FSA claims.</p>',
            ],
            [
                'title' => 'What payment methods do you accept?',
                'icon' => 'Receipt',
                'meta' => ['category' => 'billing', 'category_label' => 'Insurance & Billing'],
                'body' => '<p>We accept all major credit cards, debit cards, HSA (Health Savings Account) cards, FSA cards, and contactless electronic payments at checkout.</p>',
            ],

            // Clinic Policies
            [
                'title' => 'What is your cancellation and rescheduling policy?',
                'icon' => 'ShieldCheck',
                'meta' => ['category' => 'policies', 'category_label' => 'Clinic Policies'],
                'body' => '<p>We kindly request at least 24 hours advance notice for cancellations or rescheduling so we can offer the appointment time to other patients waiting for care.</p>',
            ],
            [
                'title' => 'Are appointments available via telehealth?',
                'icon' => 'Video',
                'meta' => ['category' => 'policies', 'category_label' => 'Clinic Policies'],
                'body' => '<p>Yes, many routine follow-up consultations, nutrition coaching, and lab reviews can be conducted securely over video through our telehealth portal.</p>',
            ],
        ];
    }
}
