<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Defense extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'term_id',
        'group_id',
        'adviser_id',
        'proposed_by_id',
        'approved_by_id',
        'title',
        'start_at',
        'end_at',
        'status',
        'description'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime'
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the adviser (user) for the defense.
     */
    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    /**
     * User who proposed the defense.
     */
    public function proposedBy()
    {
        return $this->belongsTo(User::class, 'proposed_by_id');
    }

    /**
     * User who approved the defense.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by_id');
    }

    /**
     * Get the panelists (users) for the defense.
     */
    public function panelists()
    {
        return $this->belongsToMany(User::class, 'defense_panelist', 'defense_id', 'panelist_id')
            ->withTimestamps();
    }

    protected $appends = ['formatted_date', 'formatted_time'];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saving(function ($defense) {
            // Ensure end time is after start time
            if ($defense->end_at <= $defense->start_at) {
                throw new \Exception('End time must be after start time');
            }

            // Check for overlapping defenses in the same room
            $overlapping = static::where('room_id', $defense->room_id)
                ->where('id', '!=', $defense->id ?? 0)
                ->where(function ($query) use ($defense) {
                    $query->whereBetween('start_at', [$defense->start_at, $defense->end_at->subSecond()])
                        ->orWhereBetween('end_at', [$defense->start_at->addSecond(), $defense->end_at])
                        ->orWhere(function ($query) use ($defense) {
                            $query->where('start_at', '<', $defense->start_at)
                                ->where('end_at', '>', $defense->end_at);
                        });
                })
                ->exists();

            if ($overlapping) {
                throw new \Exception('The selected time slot conflicts with an existing defense in this room.');
            }
        });
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    public function getFormattedDateAttribute()
    {
        return $this->start_at->format('F d, Y');
    }

    public function getFormattedTimeAttribute()
    {
        return $this->start_at->format('h:i A') . ' - ' . $this->end_at->format('h:i A');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>=', now())
            ->orderBy('start_at');
    }

    public function scopeInDateRange($query, $start, $end)
    {
        return $query->where(function ($q) use ($start, $end) {
            $q->whereBetween('start_at', [$start, $end])
                ->orWhereBetween('end_at', [$start, $end])
                ->orWhere(function ($q) use ($start, $end) {
                    $q->where('start_at', '<', $start)
                        ->where('end_at', '>', $end);
                });
        });
    }
}
