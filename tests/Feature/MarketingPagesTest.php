<?php

namespace Tests\Feature;

use App\Models\AppointmentRequest;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketingPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // The public pages read their copy from the database now.
        $this->seed(SiteContentSeeder::class);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function pageProvider(): array
    {
        return [
            'home' => ['home', 'welcome'],
            'services' => ['services', 'services'],
            'philosophy' => ['philosophy', 'philosophy'],
            'contact' => ['contact', 'contact'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('pageProvider')]
    public function test_public_pages_render_for_guests(
        string $routeName,
        string $component,
    ) {
        $response = $this->get(route($routeName));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component($component),
        );
    }

    public function test_an_appointment_request_can_be_submitted()
    {
        $response = $this->post(route('contact.store'), [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '(555) 123-4567',
            'service' => 'Wellness Exams',
            'message' => 'I would like to book a check-up.',
        ]);

        $response->assertRedirect(route('contact'));
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('appointment_requests', [
            'email' => 'jane@example.com',
            'service' => 'Wellness Exams',
        ]);
    }

    public function test_the_home_page_renders_content_from_the_database()
    {
        $response = $this->get(route('home'));

        $response->assertInertia(
            fn ($page) => $page
                ->where('hero.badge', 'Human-Centric Care')
                ->has('philosophy.highlights', 3)
                ->has('services.cards', 2),
        );
    }

    public function test_unpublished_items_are_hidden_from_the_public_site()
    {
        \App\Models\Service::query()->update(['is_published' => false]);

        $this->get(route('services'))->assertInertia(
            fn ($page) => $page->has('items', 0),
        );
    }

    public function test_an_appointment_request_requires_a_name_email_and_message()
    {
        $response = $this->post(route('contact.store'), []);

        $response->assertSessionHasErrors([
            'first_name',
            'last_name',
            'email',
            'message',
        ]);
    }

    public function test_an_appointment_request_rejects_an_invalid_email()
    {
        $response = $this->post(route('contact.store'), [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'not-an-email',
            'message' => 'Hello.',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_the_phone_and_service_fields_are_optional()
    {
        $response = $this->post(route('contact.store'), [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello.',
        ]);

        $response->assertSessionHasNoErrors();
    }
}
