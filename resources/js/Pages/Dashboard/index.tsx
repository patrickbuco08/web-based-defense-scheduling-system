import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    CheckCircle2,
    XCircle,
    Ban,
    Users,
    FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/features/dashboard/queries/useDashboard";

const Dashboard = () => {
    const navigate = useNavigate();
    const { data: dashboardData, isLoading } = useDashboard();

    const stats = dashboardData?.stats;
    const recentDefenses = dashboardData?.recent_defenses || [];

    const handleCardClick = (status: string) => {
        navigate(`/app?status=${status}`);
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
            "pending": { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
            "approved": { color: "bg-green-100 text-green-800", label: "Approved" },
            "rejected": { color: "bg-red-100 text-red-800", label: "Rejected" },
            "cancelled": { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-800", label: status };

        return (
            <Badge variant="outline" className={config.color}>
                {config.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your defense schedules and activities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick('all')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Defenses
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total || 0}</div>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick('pending')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending
                            </CardTitle>
                            <FileText className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick('approved')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Approved
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats?.approved || 0}</div>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick('rejected')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Rejected
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
                    </CardContent>
                </Card>

                <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick('cancelled')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Cancelled
                            </CardTitle>
                            <Ban className="h-4 w-4 text-gray-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{stats?.cancelled || 0}</div>
                    </CardContent>
                </Card>

                <Card className="cursor-default">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Panelists Assigned
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats?.panelists_assigned || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Defenses</h2>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[140px]">When</TableHead>
                                <TableHead className="w-[160px]">Status</TableHead>
                                <TableHead className="w-[180px]">Group Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-[200px]">Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                            <span className="text-muted-foreground">Loading defenses...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : recentDefenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No recent defenses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentDefenses.map((defense) => (
                                    <TableRow key={defense.id}>
                                        <TableCell className="text-sm whitespace-nowrap font-mono">
                                            {formatDateTime(defense.start_at)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(defense.status)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {defense.group?.group_code || "—"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {defense.title || "—"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {defense.room
                                                ? `${defense.room.building} - Room ${defense.room.room_number}`
                                                : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
