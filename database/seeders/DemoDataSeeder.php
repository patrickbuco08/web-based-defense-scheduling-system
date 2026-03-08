<?php

namespace Database\Seeders;

use Bocum\Models\Department;
use Bocum\Models\User;
use Bocum\Models\Group;
use Bocum\Models\GroupMember;
use Bocum\Models\Defense;
use Bocum\Models\Term;
use Bocum\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * This seeder is a wrapper that runs all demo data seeders
     * in the correct order to establish relationships
     */
    public function run()
    {
        $this->command->info('🚀 Starting DemoDataSeeder...');
        
        $term = Term::where('is_current', true)->first();
        $rooms = Room::all();
        
        $this->command->info("📅 Current Term: {$term->school_year} - {$term->semester}");
        $this->command->info("🏢 Available Rooms: {$rooms->count()}");
        $this->command->newLine();

        $this->seedDemoData($term, $rooms);
        
        $this->command->newLine();
        $this->command->info('✅ Demo data seeding completed successfully!');
    }

    private function seedDemoData($term, $rooms)
    {
        $departments = [
            ['code' => 'BSCS', 'name' => 'Computer Studies'],
            ['code' => 'BSE', 'name' => 'Education'],
            ['code' => 'BSHTM', 'name' => 'Hospitality and Tourism Management'],
            ['code' => 'BSM', 'name' => 'Business and Management'],
            ['code' => 'BSAS', 'name' => 'Arts and Sciences'],
        ];

        $seededDepartments = [];

        foreach ($departments as $deptData) {
            $department = Department::firstOrCreate($deptData);
            $seededDepartments[] = $department;
            $this->command->info("\n🏫 Department: {$department->name} ({$department->code})");

            $this->seedDepartmentUsers($department, $term, $rooms);
        }

        $this->seedRoomDepartments($rooms, $seededDepartments);

        $this->seedMultiDepartmentAdviserFixture($seededDepartments, $term, $rooms);
    }

    private function seedDepartmentUsers($department, $term, $rooms)
    {
        $users = [];
        $deptCode = $department->code;
        
        // Create 3 Advisers
        $this->command->info("  👨‍🏫 Creating Advisers...");
        for ($i = 1; $i <= 3; $i++) {
            $adviser = User::firstOrCreate(
                ['email' => strtolower("adviser{$i}.{$deptCode}@cct.edu.ph")],
                [
                    'name' => "Adviser {$i} ({$deptCode})",
                    'password' => Hash::make('password'),
                    'department_id' => $department->id,
                ]
            );
            $adviser->assignRole('adviser');
            $this->syncUserDepartments($adviser, [$department->id]);
            $users['advisers'][] = $adviser;
            $this->command->info("     ✓ {$adviser->name} ({$adviser->email})");
            
            $this->seedAdviserGroups($adviser, $department, $term, $rooms, $i);
        }

        // Create 3 Critics
        $this->command->info("  🔍 Creating Critics...");
        for ($i = 1; $i <= 3; $i++) {
            $critic = User::firstOrCreate(
                ['email' => strtolower("critic{$i}.{$deptCode}@cct.edu.ph")],
                [
                    'name' => "Critic {$i} ({$deptCode})",
                    'password' => Hash::make('password'),
                    'department_id' => $department->id,
                ]
            );
            $critic->assignRole('critic');
            $this->syncUserDepartments($critic, [$department->id]);
            $users['critics'][] = $critic;
            $this->command->info("     ✓ {$critic->name} ({$critic->email})");
        }

        // Create 3 Panelists
        $this->command->info("  👥 Creating Panelists...");
        for ($i = 1; $i <= 3; $i++) {
            $panelist = User::firstOrCreate(
                ['email' => strtolower("panelist{$i}.{$deptCode}@cct.edu.ph")],
                [
                    'name' => "Panelist {$i} ({$deptCode})",
                    'password' => Hash::make('password'),
                    'department_id' => $department->id,
                ]
            );
            $panelist->assignRole('panelist');
            $this->syncUserDepartments($panelist, [$department->id]);
            $users['panelists'][] = $panelist;
            $this->command->info("     ✓ {$panelist->name} ({$panelist->email})");
        }

        // Create 1 Coordinator
        $this->command->info("  📋 Creating Coordinator...");
        $coordinator = User::firstOrCreate(
            ['email' => strtolower("coordinator.{$deptCode}@cct.edu.ph")],
            [
                'name' => "Coordinator ({$deptCode})",
                'password' => Hash::make('password'),
                'department_id' => $department->id,
            ]
        );
        $coordinator->assignRole('coordinator');
        $this->syncUserDepartments($coordinator, [$department->id]);
        $users['coordinators'][] = $coordinator;
        $this->command->info("     ✓ {$coordinator->name} ({$coordinator->email})");
    }

    private function seedAdviserGroups($adviser, $department, $term, $rooms, $adviserIndex)
    {
        $deptCode = $department->code;
        $thesisTopics = $this->getThesisTopics($deptCode);
        
        // Get a random critic from the same department
        $critic = User::whereHas('roles', function($q) {
                $q->where('name', 'critic');
            })
            ->whereHas('departments', function ($query) use ($department) {
                $query->where('departments.id', $department->id);
            })
            ->inRandomOrder()
            ->first();
        
        // Create only 1 group per adviser
        $groupCode = $deptCode . str_pad($adviserIndex, 2, '0', STR_PAD_LEFT) . '-THESIS-2025';
        $group = Group::firstOrCreate(
            ['group_code' => $groupCode],
            [
                'department_id' => $department->id,
                'term_id' => $term->id,
                'adviser_id' => $adviser->id,
                'critic_id' => $critic->id ?? null,
                'group_code' => $groupCode,
            ]
        );

        $this->syncGroupDepartments($group, [$department->id]);
        
        $criticInfo = $critic ? "with critic: {$critic->name}" : 'no critic assigned';
        $this->command->info("       📚 Group: {$group->group_code} {$criticInfo}");

        $this->seedGroupMembers($group, $department);
        $this->seedGroupDefense($group, $adviser, $term, $rooms, $thesisTopics[$adviserIndex-1] ?? 'Sample Thesis Defense', $adviserIndex);
    }

    private function seedGroupMembers($group, $department)
    {
        $memberNames = $this->getFilipinoStudentNames($department->code, $group->id);

        foreach ($memberNames as $memberName) {
            $member = GroupMember::firstOrCreate(
                [
                    'group_id' => $group->id,
                    'student_name' => $memberName
                ]
            );
            $this->command->info("          • {$memberName}");
        }
    }

    private function seedMultiDepartmentAdviserFixture($departments, $term, $rooms)
    {
        if (count($departments) < 2) {
            return;
        }

        $primaryDepartment = $departments[0];
        $secondaryDepartment = $departments[1];
        $departmentIds = [$primaryDepartment->id, $secondaryDepartment->id];

        $this->command->info("\n🌐 Creating Multi-Department Adviser Fixture...");

        $adviser = User::firstOrCreate(
            ['email' => 'adviser.multi@cct.edu.ph'],
            [
                'name' => "Adviser Multi ({$primaryDepartment->code}/{$secondaryDepartment->code})",
                'password' => Hash::make('password'),
                'department_id' => $primaryDepartment->id,
            ]
        );
        $adviser->assignRole('adviser');
        $this->syncUserDepartments($adviser, $departmentIds);
        $this->command->info("     ✓ {$adviser->name} ({$adviser->email})");

        $critic = User::whereHas('roles', function ($query) {
                $query->where('name', 'critic');
            })
            ->whereHas('departments', function ($query) use ($departmentIds) {
                $query->whereIn('departments.id', $departmentIds);
            })
            ->inRandomOrder()
            ->first();

        $groupCode = $primaryDepartment->code . 'MD01-THESIS-2025';
        $group = Group::firstOrCreate(
            ['group_code' => $groupCode],
            [
                'department_id' => $primaryDepartment->id,
                'term_id' => $term->id,
                'adviser_id' => $adviser->id,
                'critic_id' => $critic?->id,
                'group_code' => $groupCode,
                'course_code' => 'MULTI-DEPT-DEMO',
            ]
        );

        $group->update([
            'department_id' => $primaryDepartment->id,
            'term_id' => $term->id,
            'adviser_id' => $adviser->id,
            'critic_id' => $critic?->id,
            'course_code' => 'MULTI-DEPT-DEMO',
        ]);

        $this->syncGroupDepartments($group, $departmentIds);

        $criticInfo = $critic ? "with critic: {$critic->name}" : 'no critic assigned';
        $this->command->info("       📚 Multi-department Group: {$group->group_code} {$criticInfo}");

        $memberNames = [
            'Alex Santos',
            'Bianca Reyes',
            'Carlos Dela Cruz',
        ];

        foreach ($memberNames as $memberName) {
            GroupMember::firstOrCreate([
                'group_id' => $group->id,
                'student_name' => $memberName,
            ]);

            $this->command->info("          • {$memberName}");
        }

        $this->seedGroupDefense(
            $group,
            $adviser,
            $term,
            $rooms,
            'Multi-Department Adviser Scheduling Demo',
            11
        );
    }

    private function syncUserDepartments(User $user, array $departmentIds)
    {
        $user->departments()->syncWithoutDetaching($departmentIds);
    }

    private function syncGroupDepartments(Group $group, array $departmentIds)
    {
        $group->departments()->sync($departmentIds);
    }

    private function syncRoomDepartments(Room $room, array $departmentIds)
    {
        $room->departments()->sync($departmentIds);
    }

    private function seedRoomDepartments($rooms, $departments)
    {
        if ($rooms->isEmpty() || count($departments) === 0) {
            return;
        }

        $this->command->info("\n🏢 Assigning Room Departments...");

        foreach ($rooms->values() as $index => $room) {
            $primaryDepartment = $departments[$index % count($departments)];
            $departmentIds = [$primaryDepartment->id];

            if ($index % 2 === 0 && count($departments) > 1) {
                $secondaryDepartment = $departments[($index + 1) % count($departments)];

                if ($secondaryDepartment->id !== $primaryDepartment->id) {
                    $departmentIds[] = $secondaryDepartment->id;
                }
            }

            $this->syncRoomDepartments($room, $departmentIds);

            $departmentCodes = collect($departments)
                ->whereIn('id', $departmentIds)
                ->pluck('code')
                ->implode(', ');

            $this->command->info("     ✓ {$room->building} - {$room->room_number} ({$departmentCodes})");
        }
    }

    private function seedGroupDefense($group, $adviser, $term, $rooms, $title, $groupIndex = 0)
    {
        // Generate a base date starting from next Monday
        $baseDate = Carbon::now()->startOfWeek()->addWeek();

        // Calculate the day offset based on group index to ensure different days
        $dayOffset = $groupIndex * 2; // Space defenses 2 days apart
        $startDate = $baseDate->copy()->addDays($dayOffset);

        // Generate random time between 9 AM and 3 PM
        $hour = rand(9, 15); // 9 AM to 3 PM
        $minute = (rand(0, 1) == 0) ? 0 : 30; // Either :00 or :30

        // Create start and end times (1.5 hour duration)
        $startTime = $startDate->copy()->setTime($hour, $minute);
        $endTime = $startTime->copy()->addHours(1.5);

        // Find an available room
        $room = $this->findAvailableRoom($rooms, $startTime, $endTime);

        // If no room is available at this time, try next day
        while (!$room) {
            $startTime->addDay();
            $endTime->addDay();
            $room = $this->findAvailableRoom($rooms, $startTime, $endTime);
        }

        // Format notes with the selected schedule
        $formattedDate = $startTime->format('l, F j, Y');
        $formattedTime = $startTime->format('g:i A') . ' to ' . $endTime->format('g:i A');

        $defense = Defense::firstOrCreate(
            [
                'group_id' => $group->id,
                'title' => $title
            ],
            [
                'adviser_id' => $adviser->id,
                'proposed_by_id' => $adviser->id,
                'approved_by_id' => null,
                'start_at' => $startTime,
                'end_at' => $endTime,
                'room_id' => null,
                'status' => 'pending',
                'notes' => "Good day, my preferred schedule is {$formattedDate} from {$formattedTime}. If this doesn't work, please let me know. Alternative schedules would be the following week or the same time on different days.",
            ]
        );

        $panelistIds = $this->getSeedPanelistIdsForGroup($group);

        if (!empty($panelistIds)) {
            $defense->panelists()->sync($panelistIds);
        }

        $this->command->info("          🗓️  Defense: {$formattedDate} | {$formattedTime} | Room: {$room->room_number}");

    }

    private function getSeedPanelistIdsForGroup(Group $group, int $limit = 3): array
    {
        $groupDepartmentIds = $group->departments()->pluck('departments.id');

        $departmentPanelistIds = User::role('panelist')
            ->whereHas('departments', function ($query) use ($groupDepartmentIds) {
                $query->whereIn('departments.id', $groupDepartmentIds);
            })
            ->orderBy('users.id')
            ->pluck('users.id')
            ->all();

        if (count($departmentPanelistIds) >= $limit) {
            return array_slice($departmentPanelistIds, 0, $limit);
        }

        $fallbackPanelistIds = User::role('panelist')
            ->whereNotIn('users.id', $departmentPanelistIds)
            ->orderBy('users.id')
            ->pluck('users.id')
            ->all();

        return array_slice(array_merge($departmentPanelistIds, $fallbackPanelistIds), 0, $limit);
    }

    private function findAvailableRoom($rooms, $startTime, $endTime)
    {
        // Check each room for availability
        foreach ($rooms as $room) {
            $conflict = Defense::where('room_id', $room->id)
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_at', [$startTime, $endTime->copy()->subMinute()])
                          ->orWhereBetween('end_at', [$startTime->copy()->addMinute(), $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('start_at', '<=', $startTime)
                                ->where('end_at', '>=', $endTime);
                          });
                })
                ->exists();

            if (!$conflict) {
                return $room;
            }
        }
        return null;
    }

    private function getThesisTopics($deptCode)
    {
        $topics = [
            'BSCS' => [
                'AI-Powered Student Performance Analytics System',
                'Blockchain-Based Academic Records Management',
                'Mobile Learning Platform with Gamification'
            ],
            'BSE' => [
                'Digital Classroom Management System for Elementary Education',
                'Interactive Learning Modules for Mathematics',
                'Student Assessment and Progress Tracking Platform'
            ],
            'BSHTM' => [
                'Hotel Reservation and Management System',
                'Tourism Destination Recommendation Platform',
                'Restaurant Point of Sale and Inventory System'
            ],
            'BSM' => [
                'Business Intelligence Dashboard for SMEs',
                'Customer Relationship Management System',
                'Supply Chain Management and Analytics Platform'
            ],
            'BSAS' => [
                'Laboratory Information Management System',
                'Research Data Collection and Analysis Platform',
                'Academic Publication Management System'
            ],
        ];

        return $topics[$deptCode] ?? ['Sample Thesis Defense', 'Another Thesis Defense', 'Third Thesis Defense'];
    }

    private function getFilipinoStudentNames($deptCode, $groupId)
    {
        // Pool of Filipino first names
        $firstNames = [
            'Maria', 'Jose', 'Juan', 'Ana', 'Carlos', 'Rosa', 'Miguel', 'Sofia',
            'Gabriel', 'Isabella', 'Rafael', 'Gabriela', 'Luis', 'Carmen', 'Diego',
            'Lucia', 'Fernando', 'Elena', 'Ricardo', 'Patricia', 'Antonio', 'Teresa',
            'Manuel', 'Beatriz', 'Francisco', 'Margarita', 'Pedro', 'Cristina',
            'Ramon', 'Angelica', 'Roberto', 'Victoria', 'Eduardo', 'Valentina',
            'Andres', 'Camila', 'Jorge', 'Natalia', 'Alberto', 'Daniela'
        ];

        // Pool of Filipino last names
        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres',
            'Gonzales', 'Lopez', 'Flores', 'Ramos', 'Rivera', 'Gomez', 'Fernandez',
            'Dela Cruz', 'Villanueva', 'Castillo', 'Morales', 'Aquino', 'Santiago',
            'Pascual', 'Mercado', 'Aguilar', 'Valdez', 'Navarro', 'Diaz', 'Salazar',
            'Domingo', 'Hernandez', 'Castro', 'Jimenez', 'Perez', 'Alvarez', 'Rojas'
        ];

        // Use group ID and department code to seed random for consistency
        $seed = crc32($deptCode . $groupId);
        mt_srand($seed);

        $members = [];
        $usedNames = [];

        for ($i = 0; $i < 3; $i++) {
            // Generate unique name
            do {
                $firstName = $firstNames[mt_rand(0, count($firstNames) - 1)];
                $lastName = $lastNames[mt_rand(0, count($lastNames) - 1)];
                $fullName = "{$firstName} {$lastName}";
            } while (in_array($fullName, $usedNames));

            $usedNames[] = $fullName;
            $members[] = $fullName;
        }

        // Reset random seed
        mt_srand();

        return $members;
    }
}
