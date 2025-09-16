<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Defense extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'room_id',
        'term_id',
        'title',
        'group_code',
        'start_at',
        'end_at',
        'status'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
