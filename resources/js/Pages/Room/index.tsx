import React from "react";
import { useRooms } from "@/features/rooms/queries/useRooms";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EditRoomButton } from "./EditRoomButton";
import { DeleteRoomButton } from "./DeleteRoomButton";
import { AddRoomButton } from "./AddRoomButton";
import { RoomData, RoomDepartment } from "@/features/rooms/api";
import { Department } from "@/features/departments/api";
import { ColumnDef } from "@tanstack/react-table";

const ManageRoom = () => {
  const { data: rooms, isLoading, error } = useRooms();
  const { data: departments } = useDepartments();

  const columns: ColumnDef<RoomData>[] = [
    {
      accessorKey: "room_number",
      header: "Room Number",
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.getValue("room_number")}
          </div>
        );
      },
    },
    {
      accessorKey: "building",
      header: "Building",
      cell: ({ row }) => {
        return (
          <div className="max-w-[100px] truncate">
            {row.getValue("building")}
          </div>
        );
      },
    },
    {
      accessorKey: "departments",
      header: "Departments",
      cell: ({ row }) => {
        const departments = row.getValue("departments") as RoomDepartment[];
        return (
          <div className="flex flex-wrap gap-1">
            {departments?.map((department) => (
              <Badge
                key={department.id}
                variant="secondary"
                className="rounded-sm"
              >
                {department.code}
              </Badge>
            ))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const departments = row.getValue(id) as RoomDepartment[];
        if (!value || value.length === 0) return true;
        return departments?.some((dept) => value.includes(dept.id.toString()));
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge
            variant={isActive ? "default" : "destructive"}
            className="rounded-sm"
          >
            {isActive ? "Available" : "Not Available"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true;
        const isActive = row.getValue(id) as boolean;
        return value.includes(isActive ? "available" : "not-available");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="flex space-x-2">
            <EditRoomButton room={room} />
            <DeleteRoomButton
              id={room.id}
              roomNumber={room.room_number}
            />
          </div>
        );
      },
    },
  ];

  const departmentFilterOptions = departments?.map((dept: Department) => ({
    label: dept.name,
    value: dept.id.toString(),
  })) || [];

  const statusFilterOptions = [
    { label: "Available", value: "available" },
    { label: "Not Available", value: "not-available" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <div className="rounded-md border">
            <div className="border-b p-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[120px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </div>
            <div className="p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b last:border-b-0 p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading rooms
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load rooms. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Manage Rooms</h1>
          <p className="text-muted-foreground">
            View and manage all available rooms for defense scheduling
          </p>
        </div>
        <AddRoomButton />
      </div>

      <DataTable
        columns={columns}
        data={rooms || []}
        searchKey="room_number"
        searchPlaceholder="Filter room number..."
        filterOptions={[
          {
            column: "departments",
            title: "Departments",
            options: departmentFilterOptions,
          },
          {
            column: "is_active",
            title: "Status",
            options: statusFilterOptions,
          },
        ]}
      />
    </div>
  );
};

export default ManageRoom;
