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
            RoleSeeder::class,
            AdminUserSeeder::class,
            
            // Create terms and rooms
            TermSeeder::class,
            RoomSeeder::class,

            DemoDataSeeder::class
        ]);
    }
}
