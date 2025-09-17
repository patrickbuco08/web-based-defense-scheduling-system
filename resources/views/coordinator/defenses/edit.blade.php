<x-app-layout>
<div class="py-12">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6 bg-white border-b border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Edit Defense Schedule</h2>
                
                <form action="{{ route('coordinator.defenses.update', $defense) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Title -->
                        <div class="col-span-2">
                            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" value="{{ old('title', $defense->title) }}" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('title')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Group Code -->
                        <div>
                            <label for="group_code" class="block text-sm font-medium text-gray-700">Group Code</label>
                            <input type="text" name="group_code" id="group_code" value="{{ old('group_code', $defense->group_code) }}" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('group_code')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Term -->
                        <div>
                            <label for="term_id" class="block text-sm font-medium text-gray-700">Term</label>
                            <input type="text" value="{{ $currentTerm->name }}" 
                                   class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                   disabled>
                            <input type="hidden" name="term_id" value="{{ $currentTerm->id }}">
                        </div>

                        <!-- Date -->
                        <div>
                            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="date" id="date" 
                                   min="{{ $minDate }}" max="{{ $maxDate }}" 
                                   value="{{ old('date', $defense->start_at->format('Y-m-d')) }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('date')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Start Time -->
                        <div>
                            <label for="start_time" class="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" name="start_time" id="start_time" 
                                   min="08:00" max="17:00" step="900"
                                   value="{{ old('start_time', $defense->start_at->format('H:i')) }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('start_time')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- End Time -->
                        <div>
                            <label for="end_time" class="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" name="end_time" id="end_time" 
                                   min="08:15" max="18:00" step="900"
                                   value="{{ old('end_time', $defense->end_at->format('H:i')) }}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('end_time')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Room -->
                        <div class="col-span-2">
                            <label for="room_id" class="block text-sm font-medium text-gray-700">Room</label>
                            <select name="room_id" id="room_id" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required>
                                @foreach($rooms as $room)
                                    <option value="{{ $room->id }}" {{ (old('room_id', $defense->room_id) == $room->id) ? 'selected' : '' }}>
                                        {{ $room->building }} - Room {{ $room->room_number }} ({{ $room->capacity }} seats)
                                    </option>
                                @endforeach
                            </select>
                            @error('room_id')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Adviser -->
                        <div class="col-span-2">
                            <label for="adviser" class="block text-sm font-medium text-gray-700">Adviser</label>
                            <input type="text" name="adviser" id="adviser" value="{{ old('adviser', $defense->adviser) }}" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   required>
                            @error('adviser')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Panelists -->
                        <div class="col-span-2">
                            <label for="panelists" class="block text-sm font-medium text-gray-700">Panelists (comma-separated)</label>
                            <textarea name="panelists" id="panelists" rows="3"
                                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">{{ old('panelists', is_array($defense->panelists) ? implode(', ', $defense->panelists) : '') }}</textarea>
                            <p class="mt-1 text-sm text-gray-500">Enter panelist names separated by commas</p>
                            @error('panelists')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Description -->
                        <div class="col-span-2">
                            <label for="description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea name="description" id="description" rows="3"
                                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">{{ old('description', $defense->description) }}</textarea>
                            @error('description')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div class="mt-8 flex justify-between items-center">
                        <div>
                            <span class="text-sm text-gray-500">
                                Created: {{ $defense->created_at->diffForHumans() }}
                                @if($defense->updated_at != $defense->created_at)
                                    <br>Last updated: {{ $defense->updated_at->diffForHumans() }}
                                @endif
                            </span>
                        </div>
                        <div class="flex space-x-3">
                            <a href="{{ route('coordinator.defenses.index') }}" 
                               class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Cancel
                            </a>
                            <button type="submit" 
                                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Update Defense
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const dateInput = document.getElementById('date');
        const startTimeInput = document.getElementById('start_time');
        const endTimeInput = document.getElementById('end_time');
        
        // Update end time minimum when start time changes
        startTimeInput.addEventListener('change', function() {
            endTimeInput.min = this.value;
            if (endTimeInput.value < this.value) {
                const [hours, minutes] = this.value.split(':');
                const endTime = new Date();
                endTime.setHours(parseInt(hours) + 1, parseInt(minutes), 0, 0);
                
                // Format time as HH:MM
                const formatTime = (date) => {
                    return date.toTimeString().slice(0, 5);
                };
                
                endTimeInput.value = formatTime(endTime);
            }
        });
    });
</script>
@endpush
</x-app-layout>
