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
        // Get base recipients (adviser and critic only, no panelists/research providers)
        $recipients = collect([$defense->adviser, $defense->group->critic])
            ->filter()
            ->pluck('email');

        // Ensure unique emails and convert to array
        return $recipients->unique()->values()->all();
    }
}
