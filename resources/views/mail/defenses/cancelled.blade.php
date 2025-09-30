@extends('mail.layouts.app')

@section('title', 'Defense Schedule Cancelled')

@section('content')
    <h2 style="color:#601818; margin-bottom:20px;">Defense Schedule Cancelled</h2>

    <p style="font-size:14px; color:#333; line-height:1.6;">
        The following defense schedule has been <strong style="color:#a00;">CANCELLED</strong> by the department coordinator.
        Please disregard this schedule and wait for further instructions.
    </p>

    <table cellpadding="0" cellspacing="0"
        style="margin:18px 0; width:100%; border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold; width:30%;">Group</td>
            <td style="padding:12px;">{{ $defense->group->group_code }} &mdash; {{ $defense->title }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Adviser</td>
            <td style="padding:12px;">{{ $defense->adviser->name }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Critic/Statistician</td>
            <td style="padding:12px;">{{ $defense->group->critic->name ?? 'Not assigned' }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Original Schedule</td>
            <td style="padding:12px;">{{ $defense->formatted_date }} &middot; {{ $defense->formatted_time }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Room</td>
            <td style="padding:12px;">{{ $defense->room->room_number }} - {{ $defense->room->building }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold; vertical-align:top;">Panelists</td>
            <td style="padding:12px;">
                <ul style="margin:0; padding-left:18px; font-size:14px; color:#333; line-height:1.6;">
                    @foreach ($defense->panelists as $panelist)
                        <li>{{ $panelist->name }}</em></li>
                    @endforeach
                </ul>
            </td>
        </tr>
    </table>

    <p style="font-size:14px; color:#333; line-height:1.6;">
        For more details, please log in to the system or contact your coordinator.
    </p>

    <p style="text-align:center; margin:28px 0;">
        <a href="http://127.0.0.1:8000/calendar"
            style="background-color:#601818; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:14px; font-weight:bold;">
            View Calendar
        </a>
    </p>

    <p style="font-size:12px; color:#666; margin-top:24px;">
        This is an automated notification. Please disregard the cancelled schedule.
    </p>
@endsection
