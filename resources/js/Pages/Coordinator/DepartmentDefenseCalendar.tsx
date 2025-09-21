import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { useDefenseDepartments } from "@/features/defenses/queries/useDefenseDepartments";
import { useUpdateDefense } from "@/features/defenses/mutations/useUpdateDefense";
import { useCheckDefenseConflicts } from "@/features/defenses/mutations/useCheckDefenseConflicts";
import { useRooms } from "@/features/rooms/queries/useRooms";
import { useAccounts } from "@/features/accounts/queries/useAccounts";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CalendarIcon,
    EditIcon,
    GraduationCapIcon,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO, formatISO } from "date-fns";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from 'lodash/debounce';

interface FormData {
    title: string;
    group_id: string;
    room_id: string;
    date: string;
    start_time: string;
    end_time: string;
    notes: string;
    status: string;
    panelists: number[];
    rejection_note: string;
}

function DepartmentDefenseCalendar() {
    const calendarRef = useRef<FullCalendar>(null);
    const [selectedDefense, setSelectedDefense] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'pending', 'approved', 'rejected', 'cancelled'
    const [initialStatus, setInitialStatus] = useState<string>('pending');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        group_id: '',
        room_id: '',
        date: '',
        start_time: '',
        end_time: '',
        notes: '',
        status: 'pending',
        panelists: [],
        rejection_note: '',
    });

    const { data: defenses = [], refetch } = useDefenseDepartments();
    const { data: rooms = [] } = useRooms();
    const { data: accounts = [] } = useAccounts();
    const updateDefense = useUpdateDefense();
    const checkConflicts = useCheckDefenseConflicts();
    const [events, setEvents] = useState<any[]>([]);
    const [conflicts, setConflicts] = useState<{
        room_conflicts: { has_conflict: boolean; message: string; conflicts: any[] };
        panelist_conflicts: { has_conflict: boolean; message: string; conflicts: any[] };
        has_any_conflicts: boolean;
    } | null>(null);
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
    // Debounced check conflicts function using lodash
    const debouncedCheckRef = useRef(
        debounce(async (defenseId: number, formData: any) => {
            if (!formData.room_id || !formData.date || !formData.start_time || !formData.end_time) {
                setConflicts(null);
                return;
            }

            setIsCheckingConflicts(true);
            try {
                const result = await checkConflicts.mutateAsync({
                    defenseId,
                    panelist_ids: formData.panelists,
                    proposed_date: formData.date,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    room_id: parseInt(formData.room_id),
                });
                setConflicts(result.data);
            } catch (error) {
                console.error('Error checking conflicts:', error);
                setConflicts(null);
            } finally {
                setIsCheckingConflicts(false);
            }
        }, 500) // 500ms debounce
    );

    // Memoize the getEventColor function since it doesn't depend on component state/props
    const getEventColor = useCallback((status: string) => {
        switch (status) {
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            case 'cancelled': return '#6b7280';
            default: return '#f59e0b';
        }
    }, []);

    // useEffect to trigger the debounced conflict check
    useEffect(() => {
        if (isDialogOpen && selectedDefense?.id) {
            debouncedCheckRef.current(selectedDefense.id, formData);
        }

        // Cleanup function to cancel any pending debounced calls
        return () => {
            debouncedCheckRef.current.cancel();
        };
    }, [
        formData.room_id,
        formData.date,
        formData.start_time,
        formData.end_time,
        formData.panelists,
        isDialogOpen,
        selectedDefense?.id
    ]);

    // Memoize the potential panelists to prevent unnecessary recalculations

    // Memoize the events mapping to prevent unnecessary recalculations
    const mappedEvents = useMemo(() => {
        if (!defenses) return [];

        return defenses
            .filter((defense: any) => {
                if (statusFilter === 'all') return true;
                return defense.status === statusFilter;
            })
            .map((defense: any) => ({
                id: defense.id.toString(),
                title: defense.title,
                start: defense.start_at,
                end: defense.end_at,
                backgroundColor: getEventColor(defense.status),
                extendedProps: { ...defense },
            }));
    }, [defenses, getEventColor, statusFilter]);

    // Only update events when mappedEvents actually changes
    useEffect(() => {
        if (mappedEvents.length > 0 || events.length !== mappedEvents.length) {
            setEvents(mappedEvents);
        }
    }, [mappedEvents, events.length]);

    const handleEventClick = (clickInfo: any) => {
        const defense = clickInfo.event.extendedProps;
        setSelectedDefense(defense);

        const startDate = new Date(defense.start_at);
        const endDate = new Date(defense.end_at);

        setFormData({
            title: defense.title || '',
            group_id: defense.group_id?.toString() || '',
            room_id: defense.room_id?.toString() || '',
            date: formatISO(startDate, { representation: 'date' }),
            start_time: format(startDate, 'HH:mm'),
            end_time: format(endDate, 'HH:mm'),
            notes: defense.notes || '',
            status: defense.status || 'pending',
            panelists: defense.panelists?.map((p: any) => p.id) || [],
            rejection_note: defense.rejection_note || '',
        });

        setIsDialogOpen(true);
        setIsEditMode(false);
        setInitialStatus(defense.status);
        setConflicts(null); // Reset conflicts when opening dialog
    };

    const handleSaveChanges = async () => {
        if (!selectedDefense) return;

        try {
            await updateDefense.mutateAsync({
                id: selectedDefense.id,
                data: formData,
            });

            toast.success("Defense updated successfully!");
            setIsDialogOpen(false);
            setIsEditMode(false);
            refetch();
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to update defense";
            toast.error(message);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Department Defense Calendar</h1>
                    <p className="text-gray-600">Manage and coordinate defense schedules</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-48">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2">
                                <GraduationCapIcon className="h-6 w-6 text-blue-600" />
                                {selectedDefense ? formData.title : "Defense Details"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    {selectedDefense && (
                        <div className="grid gap-6 py-4">
                            {/* Group Information Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <Label className="text-sm font-semibold text-gray-700">Group Information</Label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Group Code and Term */}
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Group Code</span>
                                            <p className="text-sm font-semibold text-gray-900">{selectedDefense.group?.group_code || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Academic Term</span>
                                            <p className="text-sm text-gray-700">
                                                {selectedDefense.group?.term ?
                                                    `${selectedDefense.group.term.school_year} - ${selectedDefense.group.term.semester} Semester`
                                                    : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Adviser and Critic */}
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adviser</span>
                                            <p className="text-sm text-gray-700">{selectedDefense.group?.adviser?.name || 'N/A'}</p>
                                        </div>
                                        {selectedDefense.group?.critic && (
                                            <div>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Critic</span>
                                                <p className="text-sm text-gray-700">{selectedDefense.group.critic.name}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Group Members */}
                                {selectedDefense.group?.members && selectedDefense.group.members.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Group Members</span>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedDefense.group.members.map((member: any, index: number) => (
                                                <span
                                                    key={member.id}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {member.student_name}
                                                    {member.student_no && (
                                                        <span className="ml-1 text-blue-600">({member.student_no})</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Room Conflict Display */}
                            {conflicts?.room_conflicts?.has_conflict && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800">Room Conflict Detected</h4>
                                            <p className="text-sm text-red-700 mt-1">{conflicts.room_conflicts.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row gap-4">

                                    {/* Date Picker - Editable */}
                                    <div className="flex-1">
                                        <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                                            Preferred Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    disabled={['approved', 'rejected', 'cancelled'].includes(initialStatus)}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !formData.date && "text-muted-foreground",
                                                        ['approved', 'rejected', 'cancelled'].includes(initialStatus) && "bg-gray-50"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.date ? (
                                                        format(parseISO(formData.date), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date ? parseISO(formData.date) : undefined}
                                                    onSelect={(date) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            date: date ? formatISO(date, { representation: 'date' }) : ''
                                                        }))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Start Time - Editable */}
                                    <div className="flex-1">
                                        <Label htmlFor="start_time" className="text-sm font-medium mb-1 block">
                                            Start Time
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={formData.start_time}
                                                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                                                className={`w-full appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${['pending', 'approved', 'rejected', 'cancelled'].includes(initialStatus) ? 'bg-gray-50' : 'bg-background'}`}
                                                disabled={['approved', 'rejected', 'cancelled'].includes(initialStatus)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* End Time - Editable */}
                                    <div className="flex-1">
                                        <Label htmlFor="end_time" className="text-sm font-medium mb-1 block">
                                            End Time
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={formData.end_time}
                                                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                                                min={formData.start_time}
                                                className={`w-full appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${['approved', 'rejected', 'cancelled'].includes(initialStatus) ? 'bg-gray-50' : 'bg-background'}`}
                                                disabled={['approved', 'rejected', 'cancelled'].includes(initialStatus)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Room Selection */}
                            <div className="space-y-2">
                                <Label>Room</Label>
                                <Select
                                    value={formData.room_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, room_id: value }))}
                                    disabled={['approved', 'rejected', 'cancelled'].includes(initialStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room: any) => (
                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                {room.building} - Room {room.room_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Selection */}
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                    disabled={['rejected', 'cancelled'].includes(initialStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rejection Notes - Show only if status is rejected or cancelled */}
                            {(formData.status === 'rejected' || formData.status === 'cancelled') && (
                                <div className="space-y-2">
                                    <Label htmlFor="rejection_note">
                                        {formData.status === 'rejected' ? 'Rejection Notes' : 'Cancellation Notes'}
                                    </Label>
                                    <textarea
                                        id="rejection_note"
                                        value={formData.rejection_note}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rejection_note: e.target.value }))}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder={`Please provide reason for ${formData.status}...`}
                                        rows={3}
                                        required
                                        disabled={['rejected', 'cancelled'].includes(initialStatus)}
                                    />
                                </div>
                            )}

                            {/* Panel Members */}
                            <div className="space-y-2">
                                <Label>Panel Members</Label>
                                <div className="border rounded p-4 max-h-48 overflow-y-auto">
                                    {accounts.map((panelist: any) => (
                                        <div key={panelist.id} className="flex items-center space-x-2 mb-2">
                                            <Checkbox
                                                checked={formData.panelists.includes(panelist.id)}
                                                onCheckedChange={(checked: boolean) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        panelists: checked
                                                            ? [...prev.panelists, panelist.id]
                                                            : prev.panelists.filter(id => id !== panelist.id)
                                                    }));
                                                }}
                                                disabled={['approved', 'rejected', 'cancelled'].includes(initialStatus)}
                                                className={['approved', 'rejected', 'cancelled'].includes(initialStatus) ? 'opacity-50' : ''}
                                            />
                                            <Label className="text-sm">{panelist.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panelist Conflict Display */}
                            {conflicts?.panelist_conflicts?.has_conflict && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800">Panelist Conflict Detected</h4>
                                            <p className="text-sm text-red-700 mt-1">{conflicts.panelist_conflicts.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notes - Disabled */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    value={formData.notes}
                                    disabled
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {!['rejected', 'cancelled'].includes(initialStatus) && (
                        <DialogFooter className="flex flex-col gap-2">
                            {isCheckingConflicts && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                    Checking for conflicts...
                                </div>
                            )}
                            <Button
                                onClick={handleSaveChanges}
                                disabled={updateDefense.isPending || conflicts?.has_any_conflicts || isCheckingConflicts}
                            >
                                {updateDefense.isPending ? "Saving..." :
                                    isCheckingConflicts ? "Checking..." :
                                    conflicts?.has_any_conflicts ? "Cannot Save - Conflicts Detected" :
                                    initialStatus === 'approved' && formData.status === 'cancelled' ? "Cancel Defense" :
                                        "Save Changes"}
                            </Button>
                        </DialogFooter>
                    )}

                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DepartmentDefenseCalendar;