<?php

namespace Tests\Feature\Admin;

use App\Models\AppointmentRequest;
use App\Models\ContentItem;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentAdminTest extends TestCase
{
    use RefreshDatabase;

    /**
     * is_admin is deliberately not mass-assignable, so set it explicitly.
     */
    private function admin(): User
    {
        $user = User::factory()->create();
        $user->forceFill(['is_admin' => true])->save();

        return $user;
    }

    // ---------------------------------------------------------------- access

    public function test_guests_are_redirected_from_the_admin()
    {
        $this->get('/admin')->assertRedirect(route('login'));
    }

    public function test_non_admin_users_are_forbidden()
    {
        $this->actingAs(User::factory()->create());

        $this->get('/admin')->assertForbidden();
        $this->get(route('admin.services.index'))->assertForbidden();
        $this->get(route('admin.requests.index'))->assertForbidden();
    }

    public function test_admins_can_open_the_dashboard()
    {
        $this->actingAs($this->admin());

        $this->get('/admin')->assertOk();
    }

    // --------------------------------------------------------------- content

    public function test_an_admin_can_create_a_service()
    {
        $this->actingAs($this->admin());

        $response = $this->post(route('admin.services.store'), [
            'title' => 'Physiotherapy',
            'body' => '<p>Hands-on rehabilitation.</p>',
            'icon' => 'Bone',
            'is_published' => true,
        ]);

        $response->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'title' => 'Physiotherapy',
            'slug' => 'physiotherapy',
            'icon' => 'Bone',
        ]);
    }

    public function test_creating_a_service_requires_a_title()
    {
        $this->actingAs($this->admin());

        $this->post(route('admin.services.store'), ['title' => ''])
            ->assertSessionHasErrors('title');
    }

    public function test_an_admin_can_update_and_delete_an_item()
    {
        $this->actingAs($this->admin());

        $item = ContentItem::query()->create([
            'collection' => 'pillars',
            'title' => 'Old title',
            'body' => '<p>Old.</p>',
        ]);

        $this->put(route('admin.content.update', ['pillars', $item]), [
            'title' => 'New title',
            'body' => '<p>New.</p>',
            'is_published' => true,
        ])->assertRedirect();

        $this->assertSame('New title', $item->fresh()->title);

        $this->delete(route('admin.content.destroy', ['pillars', $item]))
            ->assertRedirect();

        $this->assertDatabaseMissing('content_items', ['id' => $item->id]);
    }

    public function test_items_can_be_reordered()
    {
        $this->actingAs($this->admin());

        $first = ContentItem::query()->create(['collection' => 'pillars', 'title' => 'A', 'position' => 0]);
        $second = ContentItem::query()->create(['collection' => 'pillars', 'title' => 'B', 'position' => 1]);

        $this->post(route('admin.content.reorder', 'pillars'), [
            'ids' => [$second->id, $first->id],
        ])->assertRedirect();

        $this->assertSame(0, $second->fresh()->position);
        $this->assertSame(1, $first->fresh()->position);
    }

    public function test_an_unknown_collection_is_a_404()
    {
        $this->actingAs($this->admin());

        $this->get(route('admin.content.index', 'nonsense'))->assertNotFound();
    }

    public function test_an_item_cannot_be_edited_through_the_wrong_collection()
    {
        $this->actingAs($this->admin());

        $highlight = ContentItem::query()->create([
            'collection' => 'home_highlights',
            'title' => 'A highlight',
        ]);

        $this->get(route('admin.content.edit', ['pillars', $highlight]))
            ->assertNotFound();
    }

    // ------------------------------------------------------------ sanitising

    public function test_scripts_are_stripped_from_submitted_rich_text()
    {
        $this->actingAs($this->admin());

        $this->post(route('admin.services.store'), [
            'title' => 'Nasty',
            'body' => '<p onclick="alert(1)">Hi</p><script>alert(2)</script>',
            'is_published' => true,
        ]);

        $body = Service::query()->where('title', 'Nasty')->value('body');

        $this->assertSame('<p>Hi</p>', $body);
        $this->assertStringNotContainsString('script', (string) $body);
        $this->assertStringNotContainsString('onclick', (string) $body);
    }

    // ------------------------------------------------------------ page copy

    public function test_an_admin_can_update_page_copy()
    {
        $this->seed(SiteContentSeeder::class);
        $this->actingAs($this->admin());

        $this->put(route('admin.pages.update', 'home'), [
            'values' => [
                'home.hero.badge' => 'Compassionate Care',
                'home.hero.description' => '<p>Updated <em>intro</em>.</p>',
            ],
        ])->assertRedirect(route('admin.pages.edit', 'home'));

        $this->assertSame(
            'Compassionate Care',
            SiteSetting::query()->where('key', 'home.hero.badge')->value('value'),
        );
    }

    public function test_an_unknown_page_group_is_a_404()
    {
        $this->actingAs($this->admin());

        $this->get(route('admin.pages.edit', 'nonsense'))->assertNotFound();
    }

    // -------------------------------------------------------------- requests

    public function test_opening_a_request_marks_it_read_and_it_can_be_deleted()
    {
        $this->actingAs($this->admin());

        $request = AppointmentRequest::query()->create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello.',
        ]);

        $this->assertNull($request->read_at);

        $this->get(route('admin.requests.show', $request))->assertOk();
        $this->assertNotNull($request->fresh()->read_at);

        $this->delete(route('admin.requests.destroy', $request))
            ->assertRedirect(route('admin.requests.index'));

        $this->assertDatabaseMissing('appointment_requests', [
            'id' => $request->id,
        ]);
    }
}
