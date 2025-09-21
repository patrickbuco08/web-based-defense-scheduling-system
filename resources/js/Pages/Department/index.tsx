import React from "react";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EditDepartmentButton } from "./EditDepartmentButton";
import { DeleteDepartmentButton } from "./DeleteDepartmentButton";
import { AddDepartmentButton } from "./AddDepartmentButton";

const ManageDepartment = () => {
    const { data: departments, isLoading, error } = useDepartments();

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
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
                                Error loading departments
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Failed to load departments. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Manage Departments</h1>
                    <p className="text-muted-foreground">
                        View and manage all departments in the system
                    </p>
                </div>
                <AddDepartmentButton />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments?.map((department) => (
                            <TableRow key={department.id}>
                                <TableCell className="font-medium">
                                    {department.code}
                                </TableCell>
                                <TableCell>{department.name}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <EditDepartmentButton department={department} />
                                        <DeleteDepartmentButton
                                            id={department.id}
                                            departmentCode={department.code}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ManageDepartment;