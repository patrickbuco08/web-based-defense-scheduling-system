<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdviserSeeder extends Seeder
{
    public function run(): void
    {
        $adviserRole = Role::firstOrCreate(['name' => 'adviser']);
        $adviserPermissions = [
            'manage groups',
        ];

        foreach ($adviserPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $advisers = [
            ['name' => 'Test Adviser', 'email' => 'adviser@example.com'],
            ['name' => 'Prof. Ricardo Cruz', 'email' => 'rcruz@example.com'],
            ['name' => 'Dr. Melissa Lim', 'email' => 'mlim@example.com'],
            ['name' => 'Prof. Daniel Reyes', 'email' => 'dreyes@example.com'],
            ['name' => 'Dr. Jennifer Sy', 'email' => 'jsy@example.com'],
            ['name' => 'Prof. Antonio Garcia', 'email' => 'agarcia@example.com'],
            ['name' => 'Dr. Caroline Wong', 'email' => 'cwong@example.com'],
            ['name' => 'Prof. Miguel Santos', 'email' => 'msantos@example.com'],
            ['name' => 'Dr. Patricia Go', 'email' => 'pgo@example.com'],
            ['name' => 'Prof. Ferdinand Ong', 'email' => 'fong@example.com'],
        ];

        foreach ($advisers as $adviser) {
            $user = User::firstOrCreate(
                ['email' => $adviser['email']],
                [
                    'name' => $adviser['name'],
                    'password' => Hash::make('password'), // Default password
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole($adviserRole);
            $user->syncPermissions($adviserPermissions);    
        }
    }
}
