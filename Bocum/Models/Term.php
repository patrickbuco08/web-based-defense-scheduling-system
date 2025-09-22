<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Term extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'school_year',
        'semester',
        'is_current',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_current' => 'boolean',
    ];

    /**
     * Get the defenses for the term.
     */
    public function defenses(): HasMany
    {
        return $this->hasMany(Defense::class);
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }

    /**
     * Scope a query to only include the current term.
     */
    public function scopeCurrentTerm(Builder $query)
    {
        return $query->where('is_current', true);
    }
}
