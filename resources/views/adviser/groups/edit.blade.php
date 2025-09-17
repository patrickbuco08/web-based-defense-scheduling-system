<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Group') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <form action="{{ route('adviser.groups.update', $group) }}" method="POST" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700">Group Title</label>
                            <input type="text" 
                                   name="title" 
                                   id="title" 
                                   value="{{ old('title', $group->title) }}" 
                                   required
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                   placeholder="Enter group title">
                        </div>

                        <input type="hidden" name="term_id" value="{{ $group->term_id }}">

                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <h3 class="text-lg font-medium text-gray-900">Group Members</h3>
                                <button type="button" id="add-member-btn"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Add Member
                                </button>
                            </div>

                            <div id="members-container" class="space-y-4">
                                @foreach($group->members as $index => $member)
                                    <div class="member-entry p-4 border border-gray-200 rounded-md">
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Student Name</label>
                                                <input type="text" 
                                                       name="members[{{ $index }}][name]" 
                                                       value="{{ old('members.'.$index.'.name', $member->student_name) }}" 
                                                       required
                                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Student Number</label>
                                                <input type="text" 
                                                       name="members[{{ $index }}][student_no]" 
                                                       value="{{ old('members.'.$index.'.student_no', $member->student_no) }}" 
                                                       required
                                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div class="flex items-end">
                                                <button type="button" 
                                                        class="remove-member-btn inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3">
                            <a href="{{ route('adviser.groups.index') }}"
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Cancel
                            </a>
                            <button type="submit"
                                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Update Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                console.log('Edit script loaded!');
                let memberCount = {{ $group->members->count() }};
                const membersContainer = document.getElementById('members-container');
                const addMemberBtn = document.getElementById('add-member-btn');
                
                // Log for debugging
                console.log('Members container:', membersContainer);
                console.log('Add member button:', addMemberBtn);
                
                // Function to add a new member field
                window.addMember = function(name = '', studentNo = '') {
                    console.log('Adding member:', name, studentNo);
                    const memberDiv = document.createElement('div');
                    memberDiv.className = 'member-entry p-4 border border-gray-200 rounded-md mb-4';
                    
                    memberDiv.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Student Name</label>
                                <input type="text" 
                                       name="members[${memberCount}][name]" 
                                       value="${name}" 
                                       required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Student Number</label>
                                <input type="text" 
                                       name="members[${memberCount}][student_no]" 
                                       value="${studentNo}" 
                                       required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            </div>
                            <div class="flex items-end">
                                <button type="button" 
                                        class="remove-member-btn inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Remove
                                </button>
                            </div>
                        </div>
                    `;
                    
                    membersContainer.appendChild(memberDiv);
                    
                    // Add event listener to the new remove button
                    const removeBtn = memberDiv.querySelector('.remove-member-btn');
                    removeBtn.addEventListener('click', function() {
                        memberDiv.remove();
                    });
                    
                    memberCount++;
                };
                
                // Add event listener for the add member button
                if (addMemberBtn) {
                    addMemberBtn.addEventListener('click', function() {
                        addMember();
                    });
                } else {
                    console.error('Add member button not found!');
                }

                // Add event delegation for remove buttons that exist on page load
                document.addEventListener('click', function(e) {
                    if (e.target && e.target.classList.contains('remove-member-btn')) {
                        e.target.closest('.member-entry').remove();
                    }
                });
            });
        </script>
        @endpush
</x-app-layout>
