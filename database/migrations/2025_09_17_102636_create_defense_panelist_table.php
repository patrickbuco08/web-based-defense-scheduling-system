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
        Schema::create('defense_panelist', function (Blueprint $table) {
            $table->id();
            $table->foreignId('defense_id')->constrained()->cascadeOnDelete();
            $table->foreignId('panelist_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            
            // Ensure a panelist can't be assigned to the same defense twice
            $table->unique(['defense_id', 'panelist_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defense_panelist');
    }
};
