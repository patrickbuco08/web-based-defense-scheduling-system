<?php

namespace Database\Seeders;

use Bocum\Models\Term;
use Illuminate\Database\Seeder;

class TermSeeder extends Seeder
{
    public function run(): void
    {
        Term::firstOrCreate(
            ['school_year' => '2025-2026', 'semester' => '1st'],
            ['is_current' => true]
        );
    }
}
