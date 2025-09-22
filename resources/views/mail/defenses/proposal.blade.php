{{-- resources/views/mail/defenses/scheduled.blade.php --}}
@component('mail::message')
    # Hi {{ $user->name }},

    Your defense has been scheduled.

    **Title:** {{ $defense->title }}
    **When:** {{ $defense->start_at->format('M d, Y h:i A') }}
    **Room:** N/A

    @component('mail::button', ['url' => url('/app/coordinators/calendar')])
        Open Calendar
    @endcomponent

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
