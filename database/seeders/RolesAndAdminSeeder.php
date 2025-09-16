<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Bocum\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $coord = Role::firstOrCreate(['name' => 'coordinator']);

        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'System Admin', 'password' => Hash::make('password')]
        );
        $user->assignRole($admin);
    }
}
