<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('defense_research_provider')) {
            Schema::table('defense_research_provider', function (Blueprint $table) {
                try {
                    $table->dropForeign('defense_research_provider_research_service_provider_id_foreign');
                } catch (\Throwable $e) {
                    // ignore if it doesn't exist
                }
                try {
                    $table->dropForeign(['research_service_provider_id']);
                } catch (\Throwable $e) {
                    // ignore if it doesn't exist
                }

                $table->foreign('research_service_provider_id', 'defense_research_provider_research_service_provider_id_foreign')
                    ->references('id')
                    ->on('research_service_providers')
                    ->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('defense_research_provider')) {
            Schema::table('defense_research_provider', function (Blueprint $table) {
                try {
                    $table->dropForeign('defense_research_provider_research_service_provider_id_foreign');
                } catch (\Throwable $e) {
                }
            });
        }
    }
};
