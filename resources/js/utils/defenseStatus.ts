/**
 * Computes the display status for a defense.
 * If the defense is approved or reschedule and the end time has passed,
 * it automatically shows as "completed".
 */
export function getDisplayStatus(status: string, endAt: string): string {
    // If status is approved or reschedule and the defense time has passed, show as completed
    if ((status === 'approved' || status === 'reschedule') && endAt) {
        const endTime = new Date(endAt);
        const now = new Date();
        
        if (endTime < now) {
            return 'completed';
        }
    }
    
    return status;
}

/**
 * Gets status badge configuration with color and label
 */
export function getStatusConfig(displayStatus: string) {
    const statusConfig: Record<string, { color: string; label: string }> = {
        pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
        approved: { color: "bg-green-100 text-green-800", label: "Approved" },
        rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
        cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
        reschedule: { color: "bg-orange-100 text-orange-800", label: "Reschedule" },
        reappearance: { color: "bg-purple-100 text-purple-800", label: "Reappearance" },
        "re-defense": { color: "bg-blue-100 text-blue-800", label: "Re-defense" },
        completed: { color: "bg-teal-100 text-teal-800", label: "Completed" },
    };

    return statusConfig[displayStatus] || { color: "bg-gray-100 text-gray-800", label: displayStatus };
}
