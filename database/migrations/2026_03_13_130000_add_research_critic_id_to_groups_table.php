<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('groups')) {
            Schema::table('groups', function (Blueprint $table) {
                if (!Schema::hasColumn('groups', 'research_critic_id')) {
                    $table->foreignId('research_critic_id')
                        ->nullable()
                        ->constrained('research_service_providers')
                        ->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('groups') && Schema::hasColumn('groups', 'research_critic_id')) {
            Schema::table('groups', function (Blueprint $table) {
                $table->dropConstrainedForeignId('research_critic_id');
            });
        }
    }
};
