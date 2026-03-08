<?php

namespace Bocum\Models;

use Illuminate\Database\Eloquent\Model;


class Group extends Model
{
    protected $fillable = ['department_id', 'term_id', 'group_code', 'course_code', 'adviser_id', 'critic_id'];

    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get all departments this group belongs to (many-to-many).
     */
    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_group')
            ->withTimestamps();
    }

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function critic()
    {
        return $this->belongsTo(User::class, 'critic_id');
    }

    public function members()
    {
        return $this->hasMany(GroupMember::class);
    }

    public function defenses()
    {
        return $this->hasMany(Defense::class);
    } // one group can have multiple defenses (proposal/final)
}
