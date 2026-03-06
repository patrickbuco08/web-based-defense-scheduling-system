<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('defenses', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'approved', 
                'rejected', 
                'cancelled', 
                'reschedule', 
                'reappearance', 
                're-defense'
            ])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('defenses', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'approved', 
                'rejected', 
                'cancelled'
            ])->default('pending')->change();
        });
    }
};
