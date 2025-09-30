<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Create admin role and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Create permissions
        $permissions = [
            'manage terms',
            'manage rooms',
            'manage coordinators',
            'manage defenses',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign all permissions to admin role
        $adminRole->syncPermissions($permissions);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@cct.edu.ph'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role to admin user
        $admin->assignRole('admin');
    }
}
