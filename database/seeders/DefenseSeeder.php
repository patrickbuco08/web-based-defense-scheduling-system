<?php

namespace Database\Seeders;

use Bocum\Models\Defense;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Bocum\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DefenseSeeder extends Seeder
{
    public function run(): void
    {
        $term = Term::first();
        $room = Room::first();
        $advisers = User::role('adviser')->get();
        $panelists = User::role('panelist')->get();

        if ($advisers->isEmpty() || $panelists->isEmpty()) {
            $this->command->warn('No advisers or panelists found. Please run AdviserSeeder and PanelistSeeder first.');
            return;
        }

        $defenses = [
            [
                'title' => 'Capstone A: Smart Campus Navigation System',
                'group_code' => 'CAP-2025-001',
                'start_at' => Carbon::now()->addDays(2)->setTime(9, 0),
                'end_at' => Carbon::now()->addDays(2)->setTime(10, 0),
                'status' => 'approved',
                'description' => 'An AI-powered navigation system for campus visitors',
            ],
            [
                'title' => 'Thesis B: E-Learning Platform with AI Tutor',
                'group_code' => 'THS-2025-002',
                'start_at' => Carbon::now()->addDays(3)->setTime(13, 0),
                'end_at' => Carbon::now()->addDays(3)->setTime(14, 30),
                'status' => 'pending',
                'description' => 'An intelligent e-learning platform with personalized AI tutor',
            ],
            [
                'title' => 'Capstone C: Smart Parking System',
                'group_code' => 'CAP-2025-003',
                'start_at' => Carbon::now()->addDays(5)->setTime(10, 0),
                'end_at' => Carbon::now()->addDays(5)->setTime(11, 30),
                'status' => 'approved',
                'description' => 'IoT-based parking availability system',
            ],
        ];

        foreach ($defenses as $defenseData) {
            $defense = Defense::create([
                'title' => $defenseData['title'],
                'group_code' => $defenseData['group_code'],
                'room_id' => $room->id,
                'term_id' => $term->id,
                'adviser_id' => $advisers->random()->id,
                'start_at' => $defenseData['start_at'],
                'end_at' => $defenseData['end_at'],
                'status' => $defenseData['status'],
                'description' => $defenseData['description'],
            ]);

            // Assign 3 random panelists to each defense
            $defense->panelists()->attach(
                $panelists->random(3)->pluck('id')->toArray()
            );
        }
    }
}
