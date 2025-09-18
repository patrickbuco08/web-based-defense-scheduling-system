<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Bocum\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CoordinatorSeeder extends Seeder
{
    public function run()
    {
        // Get the manage defenses permission
        $permission = Permission::firstOrCreate(['name' => 'manage defenses']);
        $role = Role::where('name', 'coordinator')->first();

        if (!$role) {
            $this->command->error('Coordinator role not found. Please run the role seeder first.');
            return;
        }

        $coordinators = [
            ['name' => 'Coordinator', 'email' => 'coordinator@example.com'],
            ['name' => 'Coordinator 1', 'email' => 'coordinator1@example.com'],
            ['name' => 'Coordinator 2', 'email' => 'coordinator2@example.com'],
            ['name' => 'Coordinator 3', 'email' => 'coordinator3@example.com'],
            ['name' => 'Coordinator 4', 'email' => 'coordinator4@example.com'],
            ['name' => 'Coordinator 5', 'email' => 'coordinator5@example.com'],
            ['name' => 'Coordinator 6', 'email' => 'coordinator6@example.com'],
            ['name' => 'Coordinator 7', 'email' => 'coordinator7@example.com'],
            ['name' => 'Coordinator 8', 'email' => 'coordinator8@example.com'],
            ['name' => 'Coordinator 9', 'email' => 'coordinator9@example.com'],
        ];

        foreach ($coordinators as $index => $coordinatorData) {
            // Get a random department
            $department = Department::inRandomOrder()->first();
            
            $coordinator = User::firstOrCreate(
                ['email' => $coordinatorData['email']],
                [
                    'name' => $coordinatorData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'department_id' => $department ? $department->id : null,
                ]
            );

            // Assign role and permission
            $coordinator->assignRole($role);
            $coordinator->givePermissionTo($permission);

            $this->command->info(sprintf(
                'Coordinator created - Name: %s, Email: %s, Department: %s',
                $coordinatorData['name'],
                $coordinatorData['email'],
                $department ? $department->name : 'None'
            ));
        }
    }
}
