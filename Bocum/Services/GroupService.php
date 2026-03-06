<?php

namespace Bocum\Services;

use Bocum\Models\Group;
use Bocum\Models\Department;

class GroupService
{
    /**
     * Generate a unique group code in format: <department_code><count>-THESIS-<current_year>
     * 
     * @param int $departmentId
     * @return string
     */
    public function generateGroupCode(int $departmentId): string
    {
        $department = Department::findOrFail($departmentId);
        $departmentCode = $this->getDepartmentCode($department->name);
        $currentYear = date('Y');
        
        // Get the count of existing groups for this department in the current year
        $count = Group::where('department_id', $departmentId)
            ->whereYear('created_at', $currentYear)
            ->count();
        
        // Increment count for the new group
        $newCount = $count + 1;
        
        // Format: <department_code><count>-THESIS-<current_year>
        // Example: BSCS001-THESIS-2025, BSCS010-THESIS-2025, BSCS999-THESIS-2025
        return sprintf('%s%03d-THESIS-%d', $departmentCode, $newCount, $currentYear);
    }
    
    /**
     * Get department code based on department name
     * 
     * @param string $departmentName
     * @return string
     */
    private function getDepartmentCode(string $departmentName): string
    {
        // Map department names to codes
        $departmentCodes = [
            'Computer Science' => 'BSCS',
            'Information Technology' => 'BSIT',
            'Software Engineering' => 'BSSE',
            'Computer Engineering' => 'BSCpE',
            'Information Systems' => 'BSIS',
            'Data Science' => 'BSDS',
            'Cybersecurity' => 'BSCY',
            'Artificial Intelligence' => 'BSAI',
            'Business Administration' => 'BSBA',
            'Accountancy' => 'BSA',
            'Marketing' => 'BSMK',
            'Human Resources' => 'BSHR',
            'Finance' => 'BSFN',
            'Economics' => 'BSEC',
            'Psychology' => 'BSPSY',
            'Education' => 'BSED',
            'Nursing' => 'BSN',
            'Medicine' => 'MD',
            'Engineering' => 'BSE',
            'Architecture' => 'BSAR',
            'Law' => 'LAW',
            'Mass Communication' => 'BSCOM',
            'Biology' => 'BSBIO',
            'Chemistry' => 'BSCHEM',
            'Physics' => 'BSPHYS',
            'Mathematics' => 'BSMATH',
            'English' => 'BSEN',
            'History' => 'BSHIST',
            'Political Science' => 'BSPOL',
            'Sociology' => 'BSSOC',
        ];
        
        // Try to find exact match first
        if (isset($departmentCodes[$departmentName])) {
            return $departmentCodes[$departmentName];
        }
        
        // If not found, create code from first letters of words
        $words = explode(' ', $departmentName);
        $code = '';
        
        foreach ($words as $word) {
            if (!empty($word)) {
                $code .= strtoupper(substr($word, 0, 1));
            }
        }
        
        // If no words or single word, use first 2 letters
        if (empty($code) || strlen($code) === 1) {
            $code = strtoupper(substr($departmentName, 0, 2));
        }
        
        return $code;
    }
}
