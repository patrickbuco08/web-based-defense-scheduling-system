<?php

namespace Bocum\Services;

use Bocum\Models\Defense;

class DefenseService
{
    /**
     * Get all email recipients for a defense notification
     * 
     * @param \Bocum\Models\Defense $defense
     * @return array
     */
    public function getDefenseRecipients(Defense $defense): array
    {
        // Get base recipients (adviser, critic, panelists)
        $recipients = collect([$defense->adviser, $defense->critic])
            ->merge($defense->panelists)
            ->filter()
            ->pluck('email');

        // Ensure unique emails and convert to array
        return $recipients->unique()->values()->all();
    }
}
