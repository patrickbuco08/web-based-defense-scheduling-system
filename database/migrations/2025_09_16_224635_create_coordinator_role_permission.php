<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't remove permissions as they might be used by other roles
        Role::where('name', 'coordinator')->delete();
    }
};
