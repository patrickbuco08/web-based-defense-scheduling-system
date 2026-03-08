import React, { useMemo, useState } from "react";
import { useArchivedDefenses } from "@/features/defenses/queries/useArchivedDefenses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCheckIcon,
  FileTextIcon,
  GraduationCapIcon,
  ArchiveRestore,
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
  archived: boolean;
  created_at: string;
  updated_at: string;
  formatted_date: string;
  formatted_time: string;
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

function ArchivedDefenses() {
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const archiveDefense = useArchiveDefense();
  const { user } = useAuth();

  const { data: defenses = [] } = useArchivedDefenses();

  const filteredDefenses = useMemo(() => {
    return defenses.filter((defense: Defense) => {
      const matchesStatus = statusFilter === "all" || defense.status === statusFilter;
      const haystack = [
        defense.title,
        defense.group?.group_code,
        defense.group?.course_code,
        defense.adviser?.name,
        defense.room?.building,
        defense.room?.room_number,
        defense.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [defenses, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDefenses.length / pageSize));

  const paginatedDefenses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDefenses.slice(start, start + pageSize);
  }, [currentPage, filteredDefenses, pageSize]);

  const handleViewDetails = (defense: Defense) => {
    setSelectedDefense(defense);
    setIsDialogOpen(true);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archived Defenses</h1>
          <p className="text-gray-600">View and restore your archived defense schedules</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search archived defenses..."
            className="w-full sm:w-[280px]"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Adviser</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDefenses.length > 0 ? (
              paginatedDefenses.map((defense: Defense) => (
                <TableRow key={defense.id}>
                  <TableCell className="font-medium">{defense.title}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{defense.group?.group_code || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        {defense.group?.course_code || "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(defense.status)}`}>
                      {defense.status.charAt(0).toUpperCase() + defense.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{new Date(defense.start_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(defense.start_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        {" - "}
                        {new Date(defense.end_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {defense.room ? `${defense.room.building} - Room ${defense.room.room_number}` : "Pending"}
                  </TableCell>
                  <TableCell>{defense.adviser?.name || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(defense)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No archived defenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredDefenses.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredDefenses.length)} of {filteredDefenses.length} archived defenses
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCapIcon className="h-6 w-6 text-blue-600" />
              {selectedDefense?.title || "Defense Details"}
            </DialogTitle>
            {selectedDefense?.status && (
              <div className="flex items-center gap-2 mt-2">
                {selectedDefense.status === "approved" ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : selectedDefense.status === "rejected" ? (
                  <XCircleIcon className="h-4 w-4 text-red-600" />
                ) : (
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                )}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDefense.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedDefense.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
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
                variant="default"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsRestoreDialogOpen(true);
                }}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <ArchiveRestore className="h-4 w-4" />
                Restore Defense
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this defense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the defense to your active defenses calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedDefense?.id) {
                  try {
                    await archiveDefense.mutateAsync({ id: selectedDefense.id, archived: false });
                    toast.success("Defense restored successfully");
                  } catch (error: any) {
                    const message = error?.response?.data?.message || error?.message || "Failed to restore defense";
                    toast.error(message);
                  } finally {
                    setIsRestoreDialogOpen(false);
                  }
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              {archiveDefense.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ArchivedDefenses;
