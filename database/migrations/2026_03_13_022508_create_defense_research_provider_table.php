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
        Schema::create('defense_research_provider', function (Blueprint $table) {
            $table->id();
            $table->foreignId('defense_id')->constrained()->cascadeOnDelete();
            $table->foreignId('research_service_provider_id')->constrained('research_service_providers')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['defense_id', 'research_service_provider_id'], 'defense_provider_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defense_research_provider');
    }
};
