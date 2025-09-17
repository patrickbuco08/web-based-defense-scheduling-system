<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * This seeder is a wrapper that runs all demo data seeders
     * in the correct order to establish relationships
     */
    public function run(): void
    {
        $this->call([
            // Create terms and rooms first
            TermSeeder::class,
            RoomSeeder::class,
            
            // Then create users with their roles
            AdminUserSeeder::class,
            CoordinatorSeeder::class,
            AdviserSeeder::class,
            PanelistSeeder::class,
            
            // Finally, create defenses with relationships
            DefenseSeeder::class,
        ]);
    }
}
