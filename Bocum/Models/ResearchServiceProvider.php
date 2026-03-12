<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchServiceProvider extends Model
{
    protected $fillable = [
        'name',
        'role',
        'department_id',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
