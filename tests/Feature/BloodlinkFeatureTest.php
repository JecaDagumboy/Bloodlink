<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BloodlinkFeatureTest extends TestCase
{
    public function test_welcome_page_is_accessible(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_user_can_authenticate_and_access_dashboard(): void
    {
        $user = User::where('email', 'pedro.reyes@bloodlink.ph')->first();
        if (! $user) {
            $user = User::factory()->create(['role' => 'user', 'status' => 'active']);
        }

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_user_can_access_donors_search(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/donors');
        $response->assertStatus(200);
    }

    public function test_user_can_access_my_blood_card(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/my-blood-card');
        $response->assertStatus(200);
    }

    public function test_user_can_toggle_blood_card_availability(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->post('/my-blood-card/toggle');
        $response->assertRedirect();
    }

    public function test_user_can_access_helpme_page(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/helpme');
        $response->assertStatus(200);
    }

    public function test_user_can_access_events_page(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/events');
        $response->assertStatus(200);
    }

    public function test_user_can_access_community_posts(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/posts');
        $response->assertStatus(200);
    }

    public function test_user_can_access_requests(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/requests');
        $response->assertStatus(200);
    }

    public function test_user_can_access_settings(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get('/settings');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_admin_portal(): void
    {
        $admin = User::where('email', 'admin@bloodlink.ph')->first();
        if (! $admin) {
            $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        }

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);

        $usersResponse = $this->actingAs($admin)->get('/admin/users');
        $usersResponse->assertStatus(200);

        $verifResponse = $this->actingAs($admin)->get('/admin/verifications');
        $verifResponse->assertStatus(200);
    }

    public function test_regular_user_cannot_access_admin_portal(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }
}
