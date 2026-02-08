/**
 * Time slot utilities for defense scheduling
 * Follows Single Responsibility Principle - handles only time slot generation and formatting
 */

export interface TimeSlot {
  value: string; // 24-hour format HH:mm
  label: string; // 12-hour format with AM/PM
  disabled?: boolean;
}

/**
 * Generates time slots from start to end with specified interval
 * @param startHour - Starting hour (24-hour format)
 * @param endHour - Ending hour (24-hour format)
 * @param intervalMinutes - Interval between slots in minutes
 * @returns Array of time slots
 */
export function generateTimeSlots(
  startHour: number = 6,
  endHour: number = 22,
  intervalMinutes: number = 5
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      // Stop if we've reached the end hour
      if (hour === endHour && minute > 0) break;
      
      const value = formatTo24Hour(hour, minute);
      const label = formatTo12Hour(hour, minute);
      
      slots.push({ value, label, disabled: false });
    }
  }
  
  return slots;
}

/**
 * Formats hour and minute to 24-hour format (HH:mm)
 */
function formatTo24Hour(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Formats hour and minute to 12-hour format with AM/PM
 */
function formatTo12Hour(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Checks if a time is within a range (inclusive)
 * @param time - Time to check in HH:mm format
 * @param startTime - Range start time in HH:mm format
 * @param endTime - Range end time in HH:mm format
 */
export function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  return time >= startTime && time < endTime;
}

/**
 * Marks time slots as disabled based on occupied time ranges
 * @param slots - Array of time slots
 * @param occupiedRanges - Array of occupied time ranges
 * @returns Updated array with disabled flags
 */
export function markOccupiedSlots(
  slots: TimeSlot[],
  occupiedRanges: Array<{ start_time: string; end_time: string }>
): TimeSlot[] {
  return slots.map(slot => ({
    ...slot,
    disabled: occupiedRanges.some(range => 
      isTimeInRange(slot.value, range.start_time, range.end_time)
    ),
  }));
}

/**
 * Filters time slots to only show options after a given start time
 * Useful for end time selection
 */
export function filterSlotsAfter(slots: TimeSlot[], afterTime: string): TimeSlot[] {
  return slots.filter(slot => slot.value > afterTime);
}
