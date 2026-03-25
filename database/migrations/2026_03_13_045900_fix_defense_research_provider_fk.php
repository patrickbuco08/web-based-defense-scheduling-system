<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('defense_research_provider') && Schema::hasColumn('defense_research_provider', 'research_service_provider_id')) {
            // Drop any existing foreign keys on the column, regardless of their constraint name
            $database = DB::getDatabaseName();
            $constraints = DB::select(
                "SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " .
                "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'defense_research_provider' " .
                "AND COLUMN_NAME = 'research_service_provider_id' AND REFERENCED_TABLE_NAME IS NOT NULL",
                [$database]
            );

            foreach ($constraints as $constraint) {
                // Drop the discovered foreign key constraint by its actual name
                DB::statement("ALTER TABLE `defense_research_provider` DROP FOREIGN KEY `{$constraint->CONSTRAINT_NAME}`");
            }

            // Re-add the correct foreign key referencing the proper table
            Schema::table('defense_research_provider', function (Blueprint $table) {
                $table->foreign('research_service_provider_id')
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
