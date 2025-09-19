<?php

namespace Database\Seeders;

use Bocum\Models\Defense;
use Bocum\Models\Group;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Bocum\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DefenseSeeder extends Seeder
{
    public function run(): void
    {
        // Get required models
        $term = Term::first();
        $room = Room::first();
        $panelists = User::role('panelist')->get();
        $group = Group::with('adviser')->first();

        if (!$group) {
            $this->command->warn('No groups found. Please run GroupSeeder first.');
            return;
        }

        if ($panelists->isEmpty()) {
            $this->command->warn('No panelists found. Please run PanelistSeeder first.');
            return;
        }

        // Get the coordinator user
        $coordinator = User::role('coordinator')->first();
        
        if (!$coordinator) {
            $this->command->warn('No coordinator found. Please create a coordinator user first.');
            return;
        }

        // Create proposal defense
        $proposalDefense = [
            'title' => 'Proposal Defense: ' . $group->title,
            'group_id' => $group->id,
            'adviser_id' => $group->adviser_id,
            'proposed_by_id' => $coordinator->id,
            'approved_by_id' => $coordinator->id,
            'start_at' => Carbon::now()->addDays(2)->setTime(9, 0),
            'end_at' => Carbon::now()->addDays(2)->setTime(10, 30),
            'room_id' => $room->id,
            'status' => 'approved',
            'notes' => 'Initial proposal defense for the Smart Campus Navigation System project.',
        ];

        // Create final defense (for future use)
        $finalDefense = [
            'title' => 'Final Defense: ' . $group->title,
            'group_id' => $group->id,
            'adviser_id' => $group->adviser_id,
            'proposed_by_id' => $coordinator->id,
            'approved_by_id' => $coordinator->id,
            'start_at' => Carbon::now()->addDays(30)->setTime(9, 0),
            'end_at' => Carbon::now()->addDays(30)->setTime(11, 0),
            'room_id' => $room->id,
            'status' => 'pending',
            'notes' => 'Final defense for the Smart Campus Navigation System project.',
        ];

        $defenses = [$proposalDefense, $finalDefense];

        foreach ($defenses as $defenseData) {
            // Create defense with all necessary fields
            $defense = Defense::create([
                'title' => $defenseData['title'],
                'group_id' => $defenseData['group_id'],
                'adviser_id' => $defenseData['adviser_id'],
                'proposed_by_id' => $defenseData['proposed_by_id'],
                'approved_by_id' => $defenseData['approved_by_id'],
                'start_at' => $defenseData['start_at'],
                'end_at' => $defenseData['end_at'],
                'room_id' => $defenseData['room_id'],
                'status' => $defenseData['status'],
                'notes' => $defenseData['notes'],
            ]);

            // Assign 3 random panelists to the defense
            $defense->panelists()->attach(
                $panelists->random(3)->pluck('id')->toArray()
            );
            
            $this->command->info('Created defense: ' . $defense->title);
        }
    }
}
