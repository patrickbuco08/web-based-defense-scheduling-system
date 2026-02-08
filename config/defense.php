<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Defense Settings
    |--------------------------------------------------------------------------
    |
    | Configuration settings for defense scheduling and validation rules.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Minimum Defense Duration
    |--------------------------------------------------------------------------
    |
    | The minimum duration in minutes that a defense must last. This is used
    | to validate that the end time is at least this many minutes after
    | the start time.
    |
    | Default: 30 minutes
    |
    */
    'min_duration_minutes' => env('DEFENSE_MIN_DURATION_MINUTES', 30),
];
