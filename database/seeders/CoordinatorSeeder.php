<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CoordinatorSeeder extends Seeder
{
    public function run()
    {
        // Create test coordinator user
        $coordinator = User::firstOrCreate(
            ['email' => 'coordinator@example.com'],
            [
                'name' => 'Test Coordinator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $permission = Permission::firstOrCreate(['name' => 'manage defenses']);


        // Assign coordinator role if it exists
        if ($role = Role::where('name', 'coordinator')->first()) {
            $coordinator->assignRole($role);
            $coordinator->givePermissionTo($permission);
        }

        $this->command->info('Test coordinator user created:');
        $this->command->info('Email: coordinator@example.com');
        $this->command->info('Password: password');
    }
}
