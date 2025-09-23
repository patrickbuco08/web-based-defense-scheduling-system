@extends('mail.layouts.app')

@section('title', 'New Defense Proposal')

@section('content')
    <h2 style="color:#601818; margin-bottom:20px;">New Defense Proposal Submitted</h2>

    <p style="font-size:14px; color:#333;">
        Dear <strong>{{ $user->name }}</strong>,
    </p>

    <p style="font-size:14px; color:#333; line-height:1.5;">
        A new defense proposal has been submitted by <strong>{{ $defense->adviser->name }}</strong> from the
        <strong>{{ $defense->group->department->name ?? 'N/A' }}</strong> department.
    </p>

    <table cellpadding="0" cellspacing="0"
        style="margin:20px 0; width:100%; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
        <tr>
            <td style="padding:10px; background-color:#f9f9f9; font-weight:bold; width:30%;">Group</td>
            <td style="padding:10px;">{{ $defense->group->group_code }} – {{ $defense->title }}</td>
        </tr>
        <tr>
            <td style="padding:10px; background-color:#f9f9f9; font-weight:bold;">Proposed Schedule</td>
            <td style="padding:10px;">{{ $defense->formatted_date }} – {{ $defense->formatted_time }}</td>
        </tr>
    </table>

    <p style="font-size:14px; color:#333; line-height:1.5;">
        Please log in to the system to review and take action.
    </p>

    <!-- Call-to-Action Button -->
    <p style="text-align:center; margin:30px 0;">
        <a href="{{ url('/app/coordinators/calendar') }}"
            style="background-color:#601818; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:14px; font-weight:bold;">
            Review Proposal
        </a>
    </p>
@endsection
