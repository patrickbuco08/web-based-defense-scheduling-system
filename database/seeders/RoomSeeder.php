<?php

namespace Database\Seeders;

use Bocum\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => '101',
                'building' => 'Main Building',
                'capacity' => 30,
                'is_active' => true
            ],
            [
                'room_number' => '102',
                'building' => 'Main Building',
                'capacity' => 30,
                'is_active' => true
            ],
            [
                'room_number' => '201',
                'building' => 'Main Building',
                'capacity' => 25,
                'is_active' => true
            ],
            [
                'room_number' => '202',
                'building' => 'Main Building',
                'capacity' => 25,
                'is_active' => true
            ],
            [
                'room_number' => 'AUD-1',
                'building' => 'Annex Building',
                'capacity' => 100,
                'is_active' => true
            ],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(
                ['room_number' => $room['room_number'], 'building' => $room['building']],
                $room
            );
        }
    }
}
