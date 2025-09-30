<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        $roles = [
            ['name' => 'admin', 'guard_name' => 'web'],
            ['name' => 'coordinator', 'guard_name' => 'web'],
            ['name' => 'adviser', 'guard_name' => 'web'],
            ['name' => 'critic', 'guard_name' => 'web'],
            ['name' => 'panelist', 'guard_name' => 'web'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }
}
