@extends('mail.layouts.app')

@section('title', 'Defense Proposal Rejected')

@section('content')
    <h2 style="color:#601818; margin-bottom:20px;">Defense Proposal Rejected</h2>

    <p style="font-size:14px; color:#333;">
        Dear <strong>{{ $adviser->name }}</strong>,
    </p>

    <p style="font-size:14px; color:#333; line-height:1.6;">
        We regret to inform you that the defense proposal you submitted has been
        <strong>REJECTED</strong> by the department coordinator. Please review the details below:
    </p>

    <table cellpadding="0" cellspacing="0"
        style="margin:18px 0; width:100%; border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold; width:30%;">Group</td>
            <td style="padding:12px;">{{ $defense->group->group_code }} &mdash; {{ $defense->title }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Proposed Schedule</td>
            <td style="padding:12px;">{{ $defense->formatted_date }} &middot; {{ $defense->formatted_time }}</td>
        </tr>
        <tr>
            <td style="padding:12px; background-color:#f9f9f9; font-weight:bold;">Reason</td>
            <td style="padding:12px; color:#a00;">
                {{ $defense->rejection_note }}
            </td>
        </tr>
    </table>

    <p style="font-size:14px; color:#333; line-height:1.6;">
        Please revise the schedule and submit a new proposal for review.
    </p>

    <p style="text-align:center; margin:28px 0;">
        <a href="{{ url('/app') }}"
            style="background-color:#601818; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:14px; font-weight:bold;">
            Submit New Proposal
        </a>
    </p>
@endsection
