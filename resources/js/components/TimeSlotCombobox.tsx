/**
 * TimeSlotCombobox Component
 * Reusable component for selecting time slots with conflict detection
 * Follows Single Responsibility Principle - handles only time slot selection UI
 */

import * as React from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';
import { generateTimeSlots, markOccupiedSlots, filterSlotsAfter, TimeSlot } from '@/utils/timeSlots';

interface OccupiedSlot {
  defense_id: number;
  title: string;
  start_time: string;
  end_time: string;
}

interface TimeSlotComboboxProps {
  value: string;
  onChange: (value: string) => void;
  occupiedSlots?: OccupiedSlot[]; // Occupied time slots from parent
  minTime?: string; // For end time to only show times after start time
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * TimeSlotCombobox
 * Displays time slots from 6 AM to 10 PM in 5-minute intervals
 * Automatically disables occupied time slots based on approved defenses
 */
export function TimeSlotCombobox({
  value,
  onChange,
  occupiedSlots = [],
  minTime,
  disabled = false,
  placeholder = 'Select time',
  className,
  id,
}: TimeSlotComboboxProps) {
  // Generate all time slots
  const allSlots = React.useMemo(() => {
    return generateTimeSlots(7, 19, 5);
  }, []);

  // Mark occupied slots and filter by minTime
  const availableSlots = React.useMemo(() => {
    let slots = allSlots;

    // Mark occupied slots
    if (occupiedSlots && occupiedSlots.length > 0) {
      slots = markOccupiedSlots(slots, occupiedSlots);
    }

    // Filter to only show times after minTime (for end time selection)
    if (minTime) {
      slots = filterSlotsAfter(slots, minTime);
    }

    return slots;
  }, [allSlots, occupiedSlots, minTime]);

  const selectedSlot = React.useMemo(() => {
    return availableSlots.find((slot) => slot.value === value) ?? null;
  }, [availableSlots, value]);

  return (
    <Combobox
      items={availableSlots}
      itemToStringValue={(slot) => slot?.label ?? ""}
      value={selectedSlot}
      onValueChange={(slot: TimeSlot | null) => {
        if (!slot) return;
        onChange(slot.value);
      }}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        showTrigger
        showClear={false}
        className={className}
      />
      <ComboboxContent className="max-h-80">
        <ComboboxEmpty>No time slots available</ComboboxEmpty>
        <ComboboxList
          className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {(slot) => (
            <ComboboxItem
              key={slot.value}
              value={slot}
              disabled={slot.disabled}
              className={slot.disabled ? 'opacity-40 cursor-not-allowed' : ''}
            >
              <span className="flex items-center justify-between w-full">
                <span>{slot.label}</span>
                {slot.disabled && (
                  <span className="text-xs text-muted-foreground ml-2">(Occupied)</span>
                )}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
