<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core setup
            PermissionSeeder::class,
            
            // Create users and roles
            AdminUserSeeder::class,
            CoordinatorSeeder::class,
            AdviserSeeder::class,
            PanelistSeeder::class,
            
            // Create terms and rooms
            TermSeeder::class,
            RoomSeeder::class,
            
            // Create defenses with relationships
            DefenseSeeder::class,
        ]);
    }
}
