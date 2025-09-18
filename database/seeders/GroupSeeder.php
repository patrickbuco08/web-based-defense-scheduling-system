<?php

namespace Database\Seeders;

use Bocum\Models\Group;
use Bocum\Models\GroupMember;
use Bocum\Models\Term;
use Bocum\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Bocum\Models\Department;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the current term
        $term = Term::first();
        if (!$term) {
            $this->command->warn('No term found. Please run TermSeeder first.');
            return;
        }

        // Get an adviser
        $adviser = User::role('adviser')->first();
        if (!$adviser) {
            $this->command->warn('No advisers found. Please run AdviserSeeder first.');
            return;
        }

        $csDepartment = Department::inRandomOrder()->first();

        // Create CS Thesis Group
        $csGroup = Group::create([
            'department_id' => $csDepartment->id,
            'term_id' => $term->id,
            'group_code' => 'CS-THESIS-2025',
            'adviser_id' => $adviser->id,
            'critic_id' => null,
        ]);

        // Add members to CS group
        $csMembers = [
            ['name' => 'Juan Dela Cruz'],
            ['name' => 'Maria Santos'],
            ['name' => 'Jose Reyes'],
            ['name' => 'Ana Martinez'],
        ];

        foreach ($csMembers as $member) {
            GroupMember::create([
                'group_id' => $csGroup->id,
                'student_name' => $member['name'],
            ]);
        }

        $itDepartment = Department::inRandomOrder()->first();

        // Create IT Thesis Group
        $itGroup = Group::create([
            'department_id' => $itDepartment->id,
            'term_id' => $term->id,
            'group_code' => 'IT-THESIS-2025',
            'adviser_id' => $adviser->id,
            'critic_id' => null,
        ]);

        // Add members to IT group
        $itMembers = [
            ['name' => 'Pedro Bautista'],
            ['name' => 'Sofia Reyes'],
            ['name' => 'Miguel Santiago'],
            ['name' => 'Isabella Cruz'],
        ];

        foreach ($itMembers as $member) {
            GroupMember::create([
                'group_id' => $itGroup->id,
                'student_name' => $member['name'],
            ]);
        }

        $this->command->info('Successfully created 2 groups with members.');
    }
}
