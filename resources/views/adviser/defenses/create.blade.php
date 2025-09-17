<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold text-gray-800">
            {{ __('Propose New Defense') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">

                    <form action="{{ route('adviser.defenses.store') }}" method="POST" class="p-6">
                        @csrf
                        <input type="hidden" name="adviser_id" value="{{ auth()->id() }}">

                        @if ($errors->any())
                            <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-red-800">
                                            There {{ $errors->count() === 1 ? 'is' : 'are' }} {{ $errors->count() }}
                                            {{ Str::plural('error', $errors->count()) }} with your submission
                                        </h3>
                                        <div class="mt-2 text-sm text-red-700">
                                            <ul class="list-disc pl-5 space-y-1">
                                                @foreach ($errors->all() as $error)
                                                    <li>{{ $error }}</li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Group Selection -->
                            <div class="col-span-2">
                                <label for="group_id" class="block text-sm font-medium text-gray-700 mb-1">Group</label>
                                <select id="group_id" name="group_id" required
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select a group</option>
                                    @foreach ($groups as $group)
                                        <option value="{{ $group->id }}"
                                            {{ old('group_id') == $group->id ? 'selected' : '' }}>
                                            {{ $group->title }}
                                            ({{ $group->members->pluck('student_name')->join(', ') }})
                                        </option>
                                    @endforeach
                                </select>
                                @error('group_id')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Title -->
                            <div class="col-span-2">
                                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" id="title" name="title" value="{{ old('title') }}"
                                    required
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                @error('title')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Group Code -->
                            <div class="col-span-2">
                                <label for="group_code" class="block text-sm font-medium text-gray-700 mb-1">Group
                                    Code</label>
                                <input type="text" id="group_code" name="group_code" value="{{ old('group_code') }}"
                                    required
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                @error('group_code')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Description -->
                            <div class="col-span-2">
                                <label for="description"
                                    class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="description" name="description" rows="3"
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">{{ old('description') }}</textarea>
                                @error('description')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Room Selection -->
                            <div>
                                <label for="room_id" class="block text-sm font-medium text-gray-700 mb-1">Room</label>
                                <select id="room_id" name="room_id" required
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select a room</option>
                                    @foreach ($rooms as $room)
                                        <option value="{{ $room->id }}"
                                            {{ old('room_id') == $room->id ? 'selected' : '' }}>
                                            {{ $room->building }} - {{ $room->room_number }} ({{ $room->capacity }}
                                            pax)
                                        </option>
                                    @endforeach
                                </select>
                                @error('room_id')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Date -->
                            <div>
                                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" id="date" name="date" value="{{ old('date') }}"
                                    required min="{{ $minDate }}" max="{{ $maxDate }}"
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                @error('date')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Start Time -->
                            <div>
                                <label for="start_time" class="block text-sm font-medium text-gray-700 mb-1">Start
                                    Time</label>
                                <input type="time" id="start_time" name="start_time" value="{{ old('start_time') }}"
                                    required min="{{ $minTime }}" max="{{ $maxTime }}"
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                @error('start_time')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- End Time -->
                            <div>
                                <label for="end_time" class="block text-sm font-medium text-gray-700 mb-1">End
                                    Time</label>
                                <input type="time" id="end_time" name="end_time" value="{{ old('end_time') }}"
                                    required min="{{ $minTime }}" max="{{ $maxTime }}"
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                @error('end_time')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <!-- Panelists -->
                            <div class="col-span-2">
                                <label for="panelists"
                                    class="block text-sm font-medium text-gray-700 mb-1">Panelists</label>
                                <select id="panelists" name="panelists[]" multiple
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    @foreach ($panelists as $panelist)
                                        <option value="{{ $panelist->id }}"
                                            {{ in_array($panelist->id, old('panelists', [])) ? 'selected' : '' }}>
                                            {{ $panelist->name }} ({{ $panelist->email }})
                                        </option>
                                    @endforeach
                                </select>
                                <p class="mt-1 text-sm text-gray-500">
                                    Hold down the Ctrl (Windows) or Command (Mac) button to select multiple panelists.
                                </p>
                                @error('panelists')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <!-- Hidden Fields -->
                        <input type="hidden" name="term_id" value="{{ $currentTerm->id }}">

                        <div class="flex items-center justify-end mt-8 space-x-4">
                            <a href="{{ route('adviser.defenses.index') }}"
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </a>
                            <button type="submit"
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Submit Proposal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const startTimeInput = document.getElementById('start_time');
                const endTimeInput = document.getElementById('end_time');
                const dateInput = document.getElementById('date');

                // Set minimum end time based on start time
                startTimeInput.addEventListener('change', function() {
                    if (this.value) {
                        endTimeInput.min = this.value;
                        if (endTimeInput.value && endTimeInput.value < this.value) {
                            endTimeInput.value = this.value;
                        }
                    }
                });

                // Set maximum start time based on end time
                endTimeInput.addEventListener('change', function() {
                    if (this.value && startTimeInput.value > this.value) {
                        startTimeInput.value = this.value;
                    }
                });

                // Set minimum end time when date changes
                dateInput.addEventListener('change', function() {
                    const today = new Date().toISOString().split('T')[0];
                    if (this.value === today) {
                        const now = new Date();
                        const currentHour = now.getHours().toString().padStart(2, '0');
                        const currentMinute = now.getMinutes().toString().padStart(2, '0');
                        const currentTime = `${currentHour}:${currentMinute}`;

                        startTimeInput.min = currentTime;
                        if (startTimeInput.value < currentTime) {
                            startTimeInput.value = currentTime;
                        }

                        // Update end time if needed
                        if (endTimeInput.value < startTimeInput.value) {
                            endTimeInput.value = startTimeInput.value;
                        }
                    } else {
                        startTimeInput.min = '{{ $minTime }}';
                    }
                });
            });
        </script>
    @endpush
</x-app-layout>
