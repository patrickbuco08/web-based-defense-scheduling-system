<?php

namespace Database\Seeders;

use Bocum\Models\Group;
use Bocum\Models\GroupMember;
use Bocum\Models\Term;
use Bocum\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

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

        // Create a group
        $group = Group::create([
            'term_id' => $term->id,
            'title' => 'Smart Campus Navigation System',
            'adviser_id' => $adviser->id,
            'critic_id' => null, // Can be set later if needed
        ]);

        // Add members to the group
        $members = [
            ['name' => 'Juan Dela Cruz', 'student_no' => '2023-0001'],
            ['name' => 'Maria Santos', 'student_no' => '2023-0002'],
            ['name' => 'Jose Reyes', 'student_no' => '2023-0003'],
            ['name' => 'Ana Martinez', 'student_no' => '2023-0004'],
        ];

        foreach ($members as $member) {
            GroupMember::create([
                'group_id' => $group->id,
                'student_name' => $member['name'],
                'student_no' => $member['student_no'],
            ]);
        }

        $this->command->info('Successfully created group with members.');
    }
}
