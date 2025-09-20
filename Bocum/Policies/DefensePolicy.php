<?php

namespace Bocum\Policies;

use Bocum\Models\Defense;
use Bocum\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\AuthorizationException;

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

    /**
     * Determine whether the user can update the defense.
     */
    public function update(User $user, Defense $defense, $newStatus = null)
    {
        // Only allow coordinators or the defense's adviser to update
        if (!$user->hasRole('coordinator') && $defense->adviser_id !== $user->id) {
            throw new AuthorizationException('You are not authorized to update this defense.');
        }

        // If no new status is provided (regular update), just check basic permissions
        if ($newStatus === null) {
            return true;
        }

        // Get current status
        $currentStatus = $defense->status;

        // Define allowed status transitions
        $allowedTransitions = [
            'pending' => ['pending', 'approved', 'rejected', 'cancelled'], // Can change to any status
            'approved' => ['approved', 'cancelled'], // Can only stay approved or be cancelled
            'rejected' => ['rejected'], // No changes allowed
            'cancelled' => ['cancelled'], // No changes allowed
        ];

        // Check if the transition is allowed
        if (!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [])) {
            switch ($currentStatus) {
                case 'approved':
                    throw new AuthorizationException('Approved defenses can only be cancelled.');
                case 'rejected':
                case 'cancelled':
                    throw new AuthorizationException('This defense cannot be modified further.');
                default:
                    throw new AuthorizationException('Invalid status transition.');
            }
        }

        return true;
    }
}
