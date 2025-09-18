<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Defense Details') }}
            </h2>
            <div class="flex items-center space-x-4">
                <form action="{{ route('adviser.defenses.destroy', $defense) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this defense? This action cannot be undone.');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-sm text-red-600 hover:text-red-900">
                        Delete Defense
                    </button>
                </form>
                <a href="{{ route('adviser.defenses.index') }}" class="text-sm text-indigo-600 hover:text-indigo-900">
                    &larr; Back to Defenses
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Defense Information</h3>
                            <p class="mt-1 text-sm text-gray-600">
                                Details about the defense schedule and participants.
                            </p>
                        </div>
                        <div class="mt-5 md:mt-0 md:col-span-2">
                            <div class="space-y-6">
                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Title</h4>
                                    <p class="mt-1 text-sm text-gray-900">{{ $defense->title }}</p>
                                </div>
                                
                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Group</h4>
                                    <p class="mt-1 text-sm text-gray-900">{{ $defense->group->name }}</p>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-500">Date</h4>
                                        <p class="mt-1 text-sm text-gray-900">
                                            {{ $defense->created_at->format('F j, Y') }}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-500">Time</h4>
                                        <p class="mt-1 text-sm text-gray-900">
                                            {{ $defense->created_at->format('h:i A') }}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Room</h4>
                                    <p class="mt-1 text-sm text-gray-900">
                                        {{ $defense->room->name ?? 'Not assigned' }}
                                    </p>
                                </div>

                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Status</h4>
                                    @php
                                        $statusClasses = [
                                            'scheduled' => 'bg-blue-100 text-blue-800',
                                            'completed' => 'bg-green-100 text-green-800',
                                            'cancelled' => 'bg-red-100 text-red-800',
                                        ][$defense->status] ?? 'bg-gray-100 text-gray-800';
                                    @endphp
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $statusClasses }}">
                                        {{ ucfirst($defense->status) }}
                                    </span>
                                </div>

                                @if($defense->notes)
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-500">Notes</h4>
                                        <p class="mt-1 text-sm text-gray-900 whitespace-pre-line">
                                            {{ $defense->notes }}
                                        </p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- Group Members Section -->
                    <div class="mt-10 sm:mt-12">
                        <div class="md:grid md:grid-cols-3 md:gap-6">
                            <div class="md:col-span-1">
                                <h3 class="text-lg font-medium leading-6 text-gray-900">Group Members</h3>
                                <p class="mt-1 text-sm text-gray-600">
                                    Students participating in this defense.
                                </p>
                            </div>
                            <div class="mt-5 md:mt-0 md:col-span-2">
                                <div class="bg-white shadow overflow-hidden sm:rounded-md">
                                    <ul role="list" class="divide-y divide-gray-200">
                                        @foreach($defense->group->members as $member)
                                            <li class="px-4 py-4 sm:px-6">
                                                <div class="flex items-center justify-between">
                                                    <p class="text-sm font-medium text-indigo-600 truncate">
                                                        {{ $member->student_name }}
                                                    </p>
                                                </div>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Panelists Section -->
                    @if($defense->panelists->isNotEmpty())
                        <div class="mt-10 sm:mt-12">
                            <div class="md:grid md:grid-cols-3 md:gap-6">
                                <div class="md:col-span-1">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">Panelists</h3>
                                    <p class="mt-1 text-sm text-gray-600">
                                        Faculty members evaluating this defense.
                                    </p>
                                </div>
                                <div class="mt-5 md:mt-0 md:col-span-2">
                                    <div class="bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul role="list" class="divide-y divide-gray-200">
                                            @foreach($defense->panelists as $panelist)
                                                <li class="px-4 py-4 sm:px-6">
                                                    <div class="flex items-center">
                                                        <div class="min-w-0 flex-1 flex items-center">
                                                            <div class="min-w-0 flex-1">
                                                                <p class="text-sm font-medium text-gray-900 truncate">
                                                                    {{ $panelist->name }}
                                                                </p>
                                                                <p class="text-sm text-gray-500 truncate">
                                                                    {{ $panelist->email }}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
