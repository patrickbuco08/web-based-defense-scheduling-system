import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getDisplayStatus } from "@/utils/defenseStatus";
import FullCalendar from "@fullcalendar/react";
import { useDefenses } from "@/features/defenses/queries/useDefenses";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  Trash2,
  UserCheckIcon,
  FileTextIcon,
  GraduationCapIcon,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDefense } from "@/features/defenses/mutations/useDeleteDefense";
import { useArchiveDefense } from "@/features/defenses/mutations/useArchiveDefense";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
interface Defense {
  id: number;
  room_id: number;
  group_id: number;
  adviser_id: number;
  proposed_by_id: number;
  approved_by_id: number;
  title: string;
  presentation_type: string | null;
  start_at: string;
  end_at: string;
  status: string;
  description: string | null;
  rejection_note: string | null;
  created_at: string;
  updated_at: string;
  formatted_date: string;
  formatted_time: string;
  // These are added for FullCalendar compatibility
  start?: string;
  end?: string;
  room: {
    id: number;
    room_number: string;
    building: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  group: {
    id: number;
    department_id: number;
    term_id: number;
    group_code: string;
    course_code: string;
    adviser_id: number;
    critic_id: number | null;
    created_at: string;
    updated_at: string;
    members: Array<{
      id: number;
      group_id: number;
      student_name: string;
      created_at: string;
      updated_at: string;
    }>;
    term: {
      id: number;
      school_year: string;
      semester: string;
      is_current: boolean;
      created_at: string;
      updated_at: string;
    };
  };
  adviser: {
    id: number;
    department_id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
  };
  proposed_by: {
    id: number;
    department_id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
  };
  approved_by: {
    id: number;
    department_id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
  };
  research_providers: Array<{
    id: number;
    name: string;
    role: string;
    department_id: number | null;
    department: {
      id: number;
      name: string;
      code: string;
    } | null;
    created_at: string;
    updated_at: string;
    pivot: {
      defense_id: number;
      research_service_provider_id: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [searchParams] = useSearchParams();
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
  console.log(selectedDefense)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const deleteDefense = useDeleteDefense();
  const archiveDefense = useArchiveDefense();
  const { user } = useAuth();

  const { data: defenses = [] } = useDefenses();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  const getEventColor = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "#10b981"; // Emerald 500
      case "rejected":
        return "#ef4444"; // Red 500
      case "cancelled":
        return "#6b7280"; // Gray 500
      default:
        return "#f59e0b"; // Amber 500 (for pending)
    }
  }, []);

  const mappedEvents = useMemo(() => {
    if (!defenses) return [];

    return defenses
      .filter((defense: Defense) => {
        if (statusFilter === 'all') return true;
        return defense.status === statusFilter;
      })
      .map((defense: Defense) => ({
        id: defense.id.toString(),
        title: defense.title,
        start: defense.start_at,
        end: defense.end_at,
        backgroundColor: getEventColor(defense.status),
        borderColor: getEventColor(defense.status),
        extendedProps: { ...defense },
      }));
  }, [defenses, getEventColor, statusFilter]);

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const defense = event.extendedProps;

    setSelectedDefense({
      ...defense,
      start: event.startStr,
      end: event.endStr,
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Defense Calendar</h1>
          <p className="text-gray-600">Overview of your defense-related schedules</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="reschedule">Reschedule</SelectItem>
                <SelectItem value="reappearance">Reappearance</SelectItem>
                <SelectItem value="re-defense">Re-defense</SelectItem>
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
          right: "dayGridYear,dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={mappedEvents}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        height="auto"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCapIcon className="h-6 w-6 text-blue-600" />
              {selectedDefense?.title || "Defense Details"}
            </DialogTitle>
            {selectedDefense?.status && (() => {
              const displayStatus = getDisplayStatus(selectedDefense.status, selectedDefense.end_at);
              return (
                <div className="flex items-center gap-2 mt-2">
                  {displayStatus === "approved" || displayStatus === "completed" ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : displayStatus === "rejected" ? (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  ) : displayStatus === "cancelled" ? (
                    <XCircleIcon className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ClockIcon className="h-4 w-4 text-yellow-600" />
                  )}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      displayStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : displayStatus === "completed"
                        ? "bg-teal-100 text-teal-800"
                        : displayStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : displayStatus === "cancelled"
                        ? "bg-gray-100 text-gray-800"
                        : displayStatus === "reschedule"
                        ? "bg-orange-100 text-orange-800"
                        : displayStatus === "reappearance"
                        ? "bg-purple-100 text-purple-800"
                        : displayStatus === "re-defense"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {displayStatus === "re-defense" ? "Re-defense" : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                  </span>
                </div>
              );
            })()}
          </DialogHeader>

          {selectedDefense && (
            <div className="space-y-6 pt-4">
              {/* Date and Time Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Start Time
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedDefense.start_at).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedDefense.start_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        End Time
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedDefense.end_at).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedDefense.end_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location and Adviser Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedDefense.room
                        ? `${selectedDefense.room.building}`
                        : "Pending"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedDefense.room
                        ? `Room ${selectedDefense.room.room_number}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <UserIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adviser</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedDefense.adviser?.name || "N/A"}
                    </p>
                    {selectedDefense.adviser?.email && (
                      <p className="text-xs text-gray-600">
                        {selectedDefense.adviser.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedDefense.group && (
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <UsersIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Group</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Group Code: {selectedDefense.group.group_code || "N/A"}
                    </p>
                    {selectedDefense.presentation_type ? (
                      <p className="text-xs text-gray-600">
                        Presentation Type: {selectedDefense.presentation_type}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Presentation Type: Not set
                      </p>
                    )}
                    {selectedDefense.group.course_code && (
                      <p className="text-xs text-gray-600">
                        Course Code: {selectedDefense.group.course_code}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Students Section */}
              {selectedDefense.group?.members &&
                selectedDefense.group.members.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UsersIcon className="h-5 w-5 text-indigo-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Students
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedDefense.group.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">
                              {member.student_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.student_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Research Service Providers Section */}
              {selectedDefense.research_providers &&
                selectedDefense.research_providers.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheckIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Research Service Providers
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {selectedDefense.research_providers.map((provider: any) => (
                        <div
                          key={provider.id}
                          className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {provider.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {provider.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {provider.role} • {provider.department?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Description Section */}
              {selectedDefense.description && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileTextIcon className="h-5 w-5 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Description
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedDefense.description}
                  </p>
                </div>
              )}

              {/* Approval Section */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Approval Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Proposed By
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedDefense.proposed_by?.name || "N/A"}
                      </p>
                      {selectedDefense.proposed_by?.email && (
                        <p className="text-xs text-gray-600">
                          {selectedDefense.proposed_by.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedDefense.approved_by && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Approved By
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedDefense.approved_by?.name}
                        </p>
                        {selectedDefense.approved_by?.email && (
                          <p className="text-xs text-gray-600">
                            {selectedDefense.approved_by.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Term Information */}
              {selectedDefense.group.term && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Academic Year: {selectedDefense.group.term.school_year} -{" "}
                      {selectedDefense.group.term.semester}
                    </span>
                    <span>Defense ID: #{selectedDefense.id}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {user?.id === selectedDefense?.adviser_id && (
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsArchiveDialogOpen(true);
                }}
                className="gap-2"
              >
                <Archive className="h-4 w-4" />
                Archive Defense
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this defense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the defense to your archived defense schedule. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedDefense?.id) {
                  try {
                    await archiveDefense.mutateAsync({ id: selectedDefense.id, archived: true });
                    toast.success("Defense archived successfully");
                  } catch (error: any) {
                    const message = error?.response?.data?.message || error?.message || "Failed to archive defense";
                    toast.error(message);
                  } finally {
                    setIsArchiveDialogOpen(false);
                  }
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {archiveDefense.isPending ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Calendar;
