<?php

namespace Database\Seeders;

use Bocum\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class PanelistSeeder extends Seeder
{
    public function run(): void
    {
        $panelistRole = Role::firstOrCreate(['name' => 'panelist']);
        
        $panelists = [
            ['name' => 'Dr. Maria Santos', 'email' => 'msantos@example.com'],
            ['name' => 'Prof. Juan Dela Cruz', 'email' => 'jdelacruz@example.com'],
            ['name' => 'Dr. Robert Lim', 'email' => 'rlim@example.com'],
            ['name' => 'Prof. Anna Reyes', 'email' => 'areyes@example.com'],
            ['name' => 'Dr. Michael Tan', 'email' => 'mtan@example.com'],
            ['name' => 'Prof. Sofia Garcia', 'email' => 'sgarcia@example.com'],
            ['name' => 'Dr. Carlos Ramirez', 'email' => 'cramirez@example.com'],
            ['name' => 'Prof. Lourdes Mendoza', 'email' => 'lmendoza@example.com'],
            ['name' => 'Dr. Richard Chen', 'email' => 'rchen@example.com'],
            ['name' => 'Prof. Patricia Ong', 'email' => 'pong@example.com'],
        ];

        foreach ($panelists as $panelist) {
            $user = User::firstOrCreate(
                ['email' => $panelist['email']],
                [
                    'name' => $panelist['name'],
                    'password' => Hash::make('password'), // Default password
                    'email_verified_at' => now(),
                ]
            );
            
            $user->assignRole($panelistRole);
        }
    }
}