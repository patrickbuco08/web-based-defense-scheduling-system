@extends('mail.layouts.app')

@section('title', 'Defense Schedule Approved')

@section('content')
    <h2 style="color:#601818; margin-bottom:20px;">Defense Schedule Approved</h2>

    <p style="font-size:14px; color:#333; line-height:1.6;">
        The defense schedule for the group below has been <strong>APPROVED</strong>.
        Please see the finalized details and prepare accordingly.
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
            <td style="padding:12px;">{{ $defense->group->critic?->name ?? 'Not assigned' }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Final Schedule</td>
            <td style="padding:12px;">{{ $defense->formatted_date }} &middot; {{ $defense->formatted_time }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Room</td>
            <td style="padding:12px;">{{ $defense->room->name ?? 'Not assigned' }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold; vertical-align:top;">Panelists</td>
            <td style="padding:12px;">
                @if ($defense->panelists->isNotEmpty())
                    <ul style="margin:0; padding-left:18px; font-size:14px; color:#333; line-height:1.6;">
                        @foreach ($defense->panelists as $panelist)
                            <li>{{ $panelist->name }}
                                @if ($panelist->pivot->role)
                                    &mdash; <em>{{ ucfirst($panelist->pivot->role) }}</em>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                @else
                    <p style="margin:0; font-size:14px; color:#666;">No panelists assigned yet.</p>
                @endif
            </td>
        </tr>
    </table>

    <p style="font-size:14px; color:#333;">
        For more details, please log in to the system.
    </p>

    <p style="text-align:center; margin:28px 0;">
        <a href="{{ url('/app') }}"
            style="background-color:#601818; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:14px; font-weight:bold;">
            View Schedule
        </a>
    </p>

    <p style="font-size:12px; color:#666; margin-top:24px;">
        If you have questions or scheduling concerns, please contact your department coordinator.
    </p>
@endsection
