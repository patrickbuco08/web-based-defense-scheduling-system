<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    protected $fillable = ['group_id', 'student_name'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
