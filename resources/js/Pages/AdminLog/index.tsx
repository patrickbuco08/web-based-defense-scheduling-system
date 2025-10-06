import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Download,
    FileSpreadsheet,
    Search as SearchIcon,
    Filter,
    Activity,
    CheckCircle2,
    XCircle,
    Ban,
    Users,
    FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { useLogs } from "@/features/logs/queries/useLogs";
import { logsApi, type LogFilters, type ActivityLog } from "@/features/logs/api";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AdminLog = () => {
    // Fetch departments
    const { data: departments, isLoading: isDepartmentsLoading } = useDepartments();

    // Filter states
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [selectedAction, setSelectedAction] = useState("all");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Build filters object
    const filters: LogFilters = useMemo(() => ({
        date_start: dateStart || undefined,
        date_end: dateEnd || undefined,
        action: selectedAction !== "all" ? selectedAction : undefined,
        department: selectedDepartment !== "all" ? selectedDepartment : undefined,
        search: debouncedSearch || undefined,
    }), [dateStart, dateEnd, selectedAction, selectedDepartment, debouncedSearch]);

    // Fetch logs from API
    const { data: logsData, isLoading: isLogsLoading } = useLogs(filters, true);

    // Extract logs from API response
    const filteredLogs = logsData?.data || [];

    // Calculate KPIs
    const totalLogs = filteredLogs.length;
    const proposedCount = filteredLogs.filter(log => log.description === "defense.proposed").length;
    const approvedCount = filteredLogs.filter(log => log.description === "defense.approved").length;
    const rejectedCount = filteredLogs.filter(log => log.description === "defense.rejected").length;
    const cancelledCount = filteredLogs.filter(log => log.description === "defense.cancelled").length;
    const panelistsAssignedCount = filteredLogs.filter(log => log.description === "defense.panelists_assigned").length;

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const blob = await logsApi.exportCsv(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("CSV file has been downloaded successfully.");
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to export CSV file. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportXLSX = async () => {
        setIsExporting(true);
        try {
            const blob = await logsApi.exportXlsx(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Excel file has been downloaded successfully.");
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to export Excel file. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getActionBadge = (action: string) => {
        const actionConfig = {
            "defense.proposed": { color: "bg-blue-100 text-blue-800", label: "Proposed" },
            "defense.approved": { color: "bg-green-100 text-green-800", label: "Approved" },
            "defense.rejected": { color: "bg-red-100 text-red-800", label: "Rejected" },
            "defense.cancelled": { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
            "defense.panelists_assigned": { color: "bg-purple-100 text-purple-800", label: "Panelists Assigned" },
        };

        const config = actionConfig[action as keyof typeof actionConfig] || { color: "bg-gray-100 text-gray-800", label: action };

        return (
            <Badge variant="outline" className={config.color}>
                {config.label}
            </Badge>
        );
    };

    const getSummary = (log: ActivityLog) => {
        // Summary is now generated by the backend
        return log.summary || "—";
    };

    if (isDepartmentsLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                <p className="text-muted-foreground">
                    View comprehensive audit trail of defense-related activities
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First row of filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Start */}
                        <div className="space-y-2">
                            <Label htmlFor="dateStart">Start Date</Label>
                            <Input
                                id="dateStart"
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                        </div>

                        {/* Date End */}
                        <div className="space-y-2">
                            <Label htmlFor="dateEnd">End Date</Label>
                            <Input
                                id="dateEnd"
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                            />
                        </div>

                        {/* Action */}
                        <div className="space-y-2">
                            <Label htmlFor="action">Action</Label>
                            <Select value={selectedAction} onValueChange={setSelectedAction}>
                                <SelectTrigger id="action" className="w-full">
                                    <SelectValue placeholder="All actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="defense.proposed">Proposed</SelectItem>
                                    <SelectItem value="defense.approved">Approved</SelectItem>
                                    <SelectItem value="defense.rejected">Rejected</SelectItem>
                                    <SelectItem value="defense.cancelled">Cancelled</SelectItem>
                                    <SelectItem value="defense.panelists_assigned">Panelists Assigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger id="department" className="w-full">
                                    <SelectValue placeholder="All departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments?.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.name}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Second row - Search */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search by user, subject, group code, or action..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Activities
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLogs}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Proposed
                            </CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{proposedCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Approved
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Rejected
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Cancelled
                            </CardTitle>
                            <Ban className="h-4 w-4 text-gray-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{cancelledCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Panelists Assigned
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{panelistsAssignedCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Export Actions */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExportCSV} variant="outline" size="sm" disabled={isExporting}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={handleExportXLSX} variant="outline" size="sm" disabled={isExporting}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export XLSX
                    </Button>
                </div>
            </div>

            {/* Results Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[140px]">When</TableHead>
                            <TableHead className="w-[160px]">Action</TableHead>
                            <TableHead className="w-[180px]">By</TableHead>
                            <TableHead className="w-[200px]">Subject</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead className="w-[150px]">Department</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLogsLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                        <span className="text-muted-foreground">Loading activity logs...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No activity logs found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-sm whitespace-nowrap font-mono">
                                        {formatDateTime(log.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        {getActionBadge(log.description)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {log.causer?.name || "System"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-sm">
                                                {log.subject?.group?.group_code || "—"}
                                            </div>
                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                                {log.subject?.title || "—"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[400px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="truncate cursor-help">
                                                    {getSummary(log)}

                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-sm">
                                                {getSummary(log)}

                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {log.causer?.department?.name || "—"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminLog;