<?php

namespace Bocum\Policies;

use Bocum\Models\Defense;
use Bocum\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\AuthorizationException;

class DefensePolicy
{
    /**
     * Determine whether the user can view any defenses (index).
     */
    public function index(User $user): bool
    {
        // Allow advisers, critics, coordinators, and admins to view defenses
        return $user->hasAnyRole(['adviser', 'critic', 'coordinator', 'admin']);
    }

    /**
     * Determine whether the user can view the department index of defenses.
     */
    public function departmentIndex(User $user): bool
    {
        return $user->hasRole('coordinator');
    }
    
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
            'pending' => ['pending', 'approved', 'rejected', 'cancelled', 'reschedule', 'reappearance', 're-defense'], // Can change to any status
            'approved' => ['approved', 'cancelled', 'reschedule', 'reappearance', 're-defense'], // Can stay approved, be cancelled, or be rescheduled
            'rejected' => ['rejected', 'reschedule', 'reappearance', 're-defense'], // Can be rescheduled after rejection
            'cancelled' => ['cancelled'], // No changes allowed
            'reschedule' => ['reschedule', 'reappearance', 're-defense', 'pending', 'rejected', 'cancelled'], // From reschedule can go to pending, rejected, or cancelled
            'reappearance' => ['reappearance', 'reschedule', 'pending', 'rejected', 'cancelled'], // From reappearance can go to pending, rejected, or cancelled
            're-defense' => ['re-defense', 'reschedule', 'reappearance', 'pending', 'rejected', 'cancelled'], // From re-defense can go to pending, rejected, or cancelled
        ];

        // Check if the transition is allowed
        if (!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [])) {
            switch ($currentStatus) {
                case 'approved':
                    throw new AuthorizationException('Approved defenses can only be cancelled, rescheduled, or marked for reappearance/re-defense.');
                case 'rejected':
                    throw new AuthorizationException('Rejected defenses can only be rescheduled or marked for reappearance/re-defense.');
                case 'cancelled':
                    throw new AuthorizationException('This defense cannot be modified further.');
                case 'reschedule':
                case 'reappearance':
                case 're-defense':
                    throw new AuthorizationException('This defense can only be moved to pending, rejected, or cancelled status.');
                default:
                    throw new AuthorizationException('Invalid status transition.');
            }
        }

        return true;
    }
}
