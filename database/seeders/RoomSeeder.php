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
                'room_number' => 'CS-101',
                'building' => 'Main Building',
                'is_active' => true
            ],
            [
                'room_number' => 'CS-102',
                'building' => 'Main Building',
                'is_active' => true
            ],
            [
                'room_number' => 'CS-201',
                'building' => 'Main Building',
                'is_active' => true
            ],
            [
                'room_number' => 'CS-202',
                'building' => 'Main Building',
                'is_active' => true
            ],
            [
                'room_number' => 'CS-201',
                'building' => 'Main Building',
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
