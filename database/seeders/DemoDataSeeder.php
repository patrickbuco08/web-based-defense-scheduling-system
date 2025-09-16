<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Bocum\Models\Room;
use Bocum\Models\Term;
use Bocum\Models\Defense;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $term = Term::firstOrCreate(
            ['school_year' => '2025-2026', 'semester' => '1st'],
            ['is_current' => true]
        );

        $r101 = Room::firstOrCreate(['name' => 'Room 101'], ['capacity' => 30, 'is_active' => true]);
        $r102 = Room::firstOrCreate(['name' => 'Room 102'], ['capacity' => 30, 'is_active' => true]);

        Defense::factory()->create([
            'title' => 'Capstone A',
            'room_id' => $r101->id,
            'term_id' => $term->id,
            'start_at' => Carbon::now()->addDays(2)->setTime(9, 0),
            'end_at'   => Carbon::now()->addDays(2)->setTime(10, 0),
            'status'   => 'approved',
        ]);
    }
}
