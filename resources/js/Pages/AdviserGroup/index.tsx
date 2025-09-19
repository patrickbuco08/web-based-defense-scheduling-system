import React from "react";
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGroups } from "@/features/groups/queries/useGroups"
import { format } from "date-fns"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { EditGroupButton } from "./EditGroupButton";
import { DeleteGroupButton } from "./DeleteGroupButton";
import { AddGroupButton } from "./AddGroupButton";
import { Skeleton } from "@/components/ui/skeleton"

const AdviserGroup = () => {
    const { data: groups, isLoading, error } = useGroups();

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="rounded-md border">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Group Code</TableHead>
                                <TableHead className="w-[200px]">Adviser</TableHead>
                                <TableHead className="w-[200px]">Critic</TableHead>
                                <TableHead className="w-[150px]">Term</TableHead>
                                <TableHead className="w-[150px]">Department</TableHead>
                                <TableHead className="w-[120px]">Members</TableHead>
                                <TableHead className="w-[150px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
                                Error loading groups
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Failed to load groups. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="w-full max-w-full px-6 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Manage Groups</h1>
                    <p className="text-muted-foreground">
                        View and manage your assigned groups
                    </p>
                </div>
                <AddGroupButton />
            </div>

            <div className="rounded-md border">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Group Code</TableHead>
                            <TableHead className="w-[200px]">Adviser</TableHead>
                            <TableHead className="w-[200px]">Critic</TableHead>
                            <TableHead className="w-[150px]">Term</TableHead>
                            <TableHead className="w-[150px]">Department</TableHead>
                            <TableHead className="w-[120px]">Members</TableHead>
                            <TableHead className="w-[150px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups?.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell className="font-medium">{group.group_code}</TableCell>
                                <TableCell>{group.adviser?.name || '-'}</TableCell>
                                <TableCell>{group.critic?.name || 'Not assigned'}</TableCell>
                                <TableCell>
                                    {group.term ? `${group.term.school_year} - ${group.term.semester}` : '-'}
                                </TableCell>
                                <TableCell>{group.department?.name || '-'}</TableCell>
                                <TableCell className="text-center">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="secondary" size="sm" className="h-8">
                                                {group.members?.length || 0} {group.members?.length === 1 ? 'member' : 'members'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64" align="center">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-center text-foreground">Group Members</h4>
                                                {group.members?.length ? (
                                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                        {group.members.map((member, index) => (
                                                            <div 
                                                                key={member.id || index}
                                                                className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                                            >
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                                    <span className="text-sm font-medium">
                                                                        {member.student_name?.charAt(0)?.toUpperCase() || 'U'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">
                                                                        {member.student_name}
                                                                    </p>
                                                                    {member.student_id && (
                                                                        <p className="text-xs text-muted-foreground truncate">
                                                                            ID: {member.student_id}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                                <line x1="19" y1="8" x2="19" y2="14"></line>
                                                                <line x1="22" y1="11" x2="16" y2="11"></line>
                                                            </svg>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">No members added yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                        <EditGroupButton group={group} />
                                        <DeleteGroupButton id={group.id} groupCode={group.group_code} />
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

export default AdviserGroup;