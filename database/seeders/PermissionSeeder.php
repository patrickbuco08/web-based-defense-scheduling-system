<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'manage defenses',
            'view defenses',
            'create defenses',
            'edit defenses',
            'delete defenses',
            'manage schedule',
            'view calendar'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create coordinator role if it doesn't exist
        $coordinatorRole = Role::firstOrCreate(['name' => 'coordinator', 'guard_name' => 'web']);

        // Assign all permissions to coordinator role
        $coordinatorRole->syncPermissions($permissions);
    }
}
