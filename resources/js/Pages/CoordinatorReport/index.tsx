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
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    Ban,
    Users
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { useTerms } from "@/features/terms/queries/useTerms";
import { useRooms } from "@/features/rooms/queries/useRooms";
import { useReports } from "@/features/reports/queries/useReports";
import { reportsApi, type ReportFilters } from "@/features/reports/api";
import type { TermInterface } from "@/features/terms/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const AdminReport = () => {
    // Fetch data from hooks
    const { data: departments, isLoading: isDepartmentsLoading } = useDepartments();
    const { data: terms, isLoading: isTermsLoading } = useTerms();
    const { data: rooms, isLoading: isRoomsLoading } = useRooms();
    const{ user } = useAuth();

    // Filter states
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(user?.department?.name || "all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto-select latest term when terms are loaded
    useEffect(() => {
        if (terms && terms.length > 0 && !selectedTerm) {
            // Find the current term (is_current = true)
            const currentTerm = terms.find(term => term.is_current);
            
            if (currentTerm) {
                setSelectedTerm(formatTermDisplay(currentTerm));
            } else {
                // Fallback: if no current term found, select the first one
                setSelectedTerm(formatTermDisplay(terms[0]));
            }
        }
    }, [terms, selectedTerm]);

    // Build filters object
    const filters: ReportFilters = useMemo(() => ({
        term: selectedTerm || undefined,
        department: selectedDepartment !== "all" ? selectedDepartment : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        room: selectedRoom !== "all" ? selectedRoom : undefined,
        date_start: dateStart || undefined,
        date_end: dateEnd || undefined,
        search: debouncedSearch || undefined,
    }), [selectedTerm, selectedDepartment, selectedStatus, selectedRoom, dateStart, dateEnd, debouncedSearch]);

    // Fetch reports from API
    const { data: reportsData, isLoading: isReportsLoading } = useReports(filters, !!selectedTerm);

    const isLoading = isDepartmentsLoading || isTermsLoading || isRoomsLoading;

    // Helper function to format term display
    const formatTermDisplay = (term: TermInterface) => `${term.semester} ${term.school_year}`;

    // Map API data to component structure
    const filteredDefenses = useMemo(() => {
        if (!reportsData?.data) {
            return [];
        }

        // Map API response to match component structure
        return reportsData.data.map(report => ({
            id: report.id,
            groupCode: report.group_code,
            title: report.title,
            adviser: report.adviser,
            critic: report.critic,
            panelists: report.panelists,
            room: report.room,
            startDateTime: report.start_date_time,
            endDateTime: report.end_date_time,
            status: report.status,
            department: report.department,
            term: report.term,
        }));
    }, [reportsData]);

    // Calculate KPIs
    const totalDefenses = filteredDefenses.length;
    const approvedCount = filteredDefenses.filter(d => d.status === "approved").length;
    const pendingCount = filteredDefenses.filter(d => d.status === "pending").length;
    const rejectedCount = filteredDefenses.filter(d => d.status === "rejected").length;
    const cancelledCount = filteredDefenses.filter(d => d.status === "cancelled").length;

    // Calculate unique panelists
    const uniquePanelists = new Set();
    filteredDefenses.forEach(defense => {
        defense.panelists.forEach(panelist => uniquePanelists.add(panelist));
    });

    const handleExportCSV = async () => {
        if (!selectedTerm) {
            toast.error("Please select a term before exporting.");
            return;
        }

        setIsExporting(true);
        try {
            const blob = await reportsApi.exportCsv(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `defense-reports-${new Date().toISOString().split('T')[0]}.csv`;
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
        if (!selectedTerm) {
            toast.error("Please select a term before exporting.");
            return;
        }

        setIsExporting(true);
        try {
            const blob = await reportsApi.exportXlsx(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `defense-reports-${new Date().toISOString().split('T')[0]}.xlsx`;
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

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            approved: { color: "bg-green-100 text-green-800", label: "Approved" },
            pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
            rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
            cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    const showLoadingState = isReportsLoading && selectedTerm;

    return (
        <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Defense Reports</h1>
                <p className="text-muted-foreground">
                    View and export comprehensive defense reports with advanced filtering
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
                        {/* Term (Required) */}
                        <div className="space-y-2">
                            <Label htmlFor="term">
                                Term <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                <SelectTrigger id="term" className="w-full">
                                    <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {terms?.map((term) => (
                                        <SelectItem key={term.id} value={formatTermDisplay(term)}>
                                            {formatTermDisplay(term)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled>
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

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Room */}
                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                <SelectTrigger id="room" className="w-full">
                                    <SelectValue placeholder="All rooms" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Rooms</SelectItem>
                                    {rooms?.filter(room => room.is_active).map((room) => (
                                        <SelectItem key={room.id} value={room.room_number}>
                                            {room.room_number} - {room.building}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Second row of filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Group, title, adviser, critic, panelist..."
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
                                Total Defense Schedule
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDefenses}</div>
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
                                Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
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
                                Unique Panelists
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{uniquePanelists.size}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Export Actions */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing {filteredDefenses.length} result{filteredDefenses.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExportCSV} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={handleExportXLSX} variant="outline" size="sm">
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
                            <TableHead>Group Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Adviser</TableHead>
                            <TableHead>Critic</TableHead>
                            <TableHead>Panelists</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Term</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {showLoadingState ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                        <span className="text-muted-foreground">Loading reports...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredDefenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                                    No Defense Schedule found. {!selectedTerm && "Please select a term to view defense schedule."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDefenses.map((defense) => (
                                <TableRow key={defense.id}>
                                    <TableCell className="font-medium">{defense.groupCode}</TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="truncate cursor-help">
                                                    {defense.title}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-sm">
                                                <p>{defense.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{defense.adviser}</TableCell>
                                    <TableCell>{defense.critic}</TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="text-sm text-left hover:underline cursor-pointer">
                                                    {defense.panelists.length} panelist{defense.panelists.length !== 1 ? 's' : ''}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-sm">Panel Members</h4>
                                                    <ul className="space-y-1.5">
                                                        {defense.panelists.map((panelist, idx) => (
                                                            <li key={idx} className="text-sm flex items-start gap-2">
                                                                <span className="text-muted-foreground mt-0.5">•</span>
                                                                <span>{panelist}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell>{defense.room}</TableCell>
                                    <TableCell className="text-sm whitespace-nowrap">
                                        {formatDateTime(defense.startDateTime)}
                                    </TableCell>
                                    <TableCell className="text-sm whitespace-nowrap">
                                        {formatDateTime(defense.endDateTime)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(defense.status)}</TableCell>
                                    <TableCell>{defense.department}</TableCell>
                                    <TableCell>{defense.term}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminReport;