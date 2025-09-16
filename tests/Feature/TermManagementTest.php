<?php

namespace Tests\Feature;

use Bocum\Models\Term;
use Bocum\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TermManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin role if it doesn't exist
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }
        
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    /** @test */
    public function admin_can_view_terms_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.terms.index'));
            
        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_create_a_term()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.terms.store'), [
                'school_year' => '2024-2025',
                'semester' => '1st',
                'is_current' => true,
            ]);

        $this->assertCount(1, Term::all());
        $this->assertEquals('2024-2025', Term::first()->school_year);
        $this->assertEquals('1st', Term::first()->semester);
        $this->assertTrue(Term::first()->is_current);
    }

    /** @test */
    public function only_one_term_can_be_current()
    {
        // Create first term as current
        $term1 = Term::create([
            'school_year' => '2024-2025',
            'semester' => '1st',
            'is_current' => true,
        ]);

        // Create second term as current
        $response = $this->actingAs($this->admin)
            ->post(route('admin.terms.store'), [
                'school_year' => '2024-2025',
                'semester' => '2nd',
                'is_current' => true,
            ]);

        // Refresh models from database
        $term1->refresh();
        $term2 = Term::where('semester', '2nd')->first();

        $this->assertFalse($term1->is_current);
        $this->assertTrue($term2->is_current);
    }

    /** @test */
    public function admin_can_update_a_term()
    {
        $term = Term::create([
            'school_year' => '2024-2025',
            'semester' => '1st',
            'is_current' => false,
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.terms.update', $term), [
                'school_year' => '2024-2025',
                'semester' => '1st',
                'is_current' => true,
            ]);

        $this->assertTrue($term->fresh()->is_current);
    }

    /** @test */
    public function admin_can_delete_a_term()
    {
        $term = Term::create([
            'school_year' => '2024-2025',
            'semester' => '1st',
            'is_current' => false,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.terms.destroy', $term));

        $this->assertCount(0, Term::all());
    }

    /** @test */
    public function cannot_delete_current_term()
    {
        $term = Term::create([
            'school_year' => '2024-2025',
            'semester' => '1st',
            'is_current' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.terms.destroy', $term));

        $response->assertSessionHas('error');
        $this->assertCount(1, Term::all());
    }
}
