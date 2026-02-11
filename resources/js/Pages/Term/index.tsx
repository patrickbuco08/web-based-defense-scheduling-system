import React from "react";
import { useTerms } from "@/features/terms/queries/useTerms";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EditTermButton from "./EditTermButton";
import DeleteTermButton from "./DeleteTermButton";
import AddTermButton from "./AddTermButton";
import { TermInterface } from "@/features/terms/api";

const Term = () => {
    const { data: terms, isLoading, error } = useTerms();

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
                                <TableHead>School Year</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4].map((i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
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
                                Error loading terms
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Failed to load terms. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Manage Academic Year</h1>
                    <AddTermButton />
                </div>
                <p className="text-muted-foreground">
                    View and manage all available academic year for defense scheduling
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Academic Year</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Is Current</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {terms?.map((term: TermInterface) => (
                            <TableRow key={term.id}>
                                <TableCell className="font-medium">
                                    {term.school_year}
                                </TableCell>
                                <TableCell>{term.semester}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${term.is_current
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {term.is_current ? "current" : "-"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <EditTermButton term={term} />
                                        <DeleteTermButton
                                            id={term.id}
                                            termSchoolYear={term.school_year}
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

export default Term;
