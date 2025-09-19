import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  UserCheckIcon,
  FileTextIcon,
  GraduationCapIcon,
} from "lucide-react";
import { fetchDefenses } from "@/features/defenses/api";
import { defensesApi } from "@/features/defenses/api";

interface Defense {
  id: number;
  room_id: number;
  group_id: number;
  adviser_id: number;
  proposed_by_id: number;
  approved_by_id: number;
  title: string;
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
    adviser_id: number;
    critic_id: number | null;
    created_at: string;
    updated_at: string;
    members: Array<{
      id: number;
      group_id: number;
      student_name: string;
      student_no: string | null;
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
  panelists: Array<{
    id: number;
    department_id: number | null;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    pivot: {
      defense_id: number;
      panelist_id: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEvents = async (
    info: any,
    successCallback: Function,
    failureCallback: Function
  ) => {
    try {
      const defenses = await defensesApi.getDefenses();

      // Transform defenses into FullCalendar events
      const events = defenses.map((defense: any) => ({
        id: defense.id.toString(),
        title: defense.title,
        start: defense.start_at,
        end: defense.end_at,
        extendedProps: {
          ...defense,
          location: defense.room
            ? `${defense.room.building} ${defense.room.room_number}`
            : "N/A",
        },
      }));

      successCallback(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      failureCallback(error);
    }
  };

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
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={fetchEvents}
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
            {selectedDefense?.status && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDefense.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedDefense.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : selectedDefense.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedDefense.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedDefense.status.charAt(0).toUpperCase() +
                    selectedDefense.status.slice(1)}
                </span>
              </div>
            )}
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
                        : "N/A"}
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
                            {member.student_no && (
                              <p className="text-xs text-gray-500">
                                {member.student_no}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Panelists Section */}
              {selectedDefense.panelists &&
                selectedDefense.panelists.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheckIcon className="h-5 w-5 text-orange-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Panel Members
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {selectedDefense.panelists.map((panelist) => (
                        <div
                          key={panelist.id}
                          className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">
                              {panelist.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {panelist.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {panelist.email}
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
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Approved By
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedDefense.approved_by?.name || "N/A"}
                      </p>
                      {selectedDefense.approved_by?.email && (
                        <p className="text-xs text-gray-600">
                          {selectedDefense.approved_by.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Term Information */}
              {selectedDefense.group.term && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Academic Term: {selectedDefense.group.term.school_year} -{" "}
                      {selectedDefense.group.term.semester}
                    </span>
                    <span>Defense ID: #{selectedDefense.id}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Calendar;
