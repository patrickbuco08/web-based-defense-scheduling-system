<?php

namespace Bocum\Policies;

use Bocum\Models\Defense;
use Bocum\Models\User;
use Illuminate\Auth\Access\Response;

class DefensePolicy
{
    /**
     * Determine whether the user can view the defense.
     */
    public function view(User $user, Defense $defense): bool
    {
        // Only allow viewing if the defense belongs to one of the user's groups
        return $defense->group->adviser_id === $user->id;
    }
}
