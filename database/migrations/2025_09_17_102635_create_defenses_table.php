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
        Schema::create('defenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('adviser_id')->nullable()->constrained('users');
            $table->foreignId('proposed_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_id')->nullable()->constrained('users')->nullOnDelete();

            $table->foreignId('term_id')->nullable()->constrained('terms')->nullOnDelete();
        
            $table->string('title');         // thesis/capstone title
            $table->string('group_code')->nullable(); // identifier if you want
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->string('status')->default('approved'); // MVP: approved/pending
            $table->string('description')->nullable();
        
            $table->timestamps();
        
            $table->index(['room_id', 'start_at', 'end_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defenses');
    }
};
