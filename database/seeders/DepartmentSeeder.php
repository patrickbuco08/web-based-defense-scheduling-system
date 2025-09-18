<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Bocum\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $departments = [
            ['code' => 'CS', 'name' => 'Computer Science'],
            ['code' => 'IT', 'name' => 'Information Technology'],
            ['code' => 'IS', 'name' => 'Information Systems'],
            ['code' => 'ACT', 'name' => 'Accountancy'],
            ['code' => 'BA', 'name' => 'Business Administration'],
        ];
    
        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
