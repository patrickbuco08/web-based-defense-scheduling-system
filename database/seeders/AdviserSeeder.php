<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Bocum\Models\Department;

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
            ['name' => 'Adviser', 'email' => 'adviser@example.com'],
            ['name' => 'Adviser 1', 'email' => 'adviser1@example.com'],
            ['name' => 'Adviser 2', 'email' => 'adviser2@example.com'],
            ['name' => 'Adviser 3', 'email' => 'adviser3@example.com'],
            ['name' => 'Adviser 4', 'email' => 'adviser4@example.com'],
            ['name' => 'Adviser 5', 'email' => 'adviser5@example.com'],
            ['name' => 'Adviser 6', 'email' => 'adviser6@example.com'],
            ['name' => 'Adviser 7', 'email' => 'adviser7@example.com'],
            ['name' => 'Adviser 8', 'email' => 'adviser8@example.com'],
            ['name' => 'Adviser 9', 'email' => 'adviser9@example.com'],
        ];

        foreach ($advisers as $adviser) {
            // Get a random department
            $department = Department::inRandomOrder()->first();
            
            $user = User::firstOrCreate(
                ['email' => $adviser['email']],
                [
                    'name' => $adviser['name'],
                    'password' => Hash::make('password'), // Default password
                    'email_verified_at' => now(),
                    'department_id' => $department ? $department->id : null,
                ]
            );
        
            $user->assignRole($adviserRole);
            $user->syncPermissions($adviserPermissions);
        }
    }
}
