import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
    return (
        <div className="w-full flex h-screen bg-gray-50">
            {/* Sidebar Skeleton */}
            <div className="hidden md:flex flex-col w-64  bg-white p-4 space-y-6">
                <div className="flex items-center space-x-2 px-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>

                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                </div>

                <div className="mt-auto space-y-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Skeleton */}
                <header className="bg-white p-4 flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </header>

                {/* Content Area Skeleton */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Calendar Header */}
                    <div className="flex flex-col space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-10 w-48" />
                            <div className="flex space-x-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center py-2">
                                    <Skeleton className="h-6 w-6 mx-auto" />
                                </div>
                            ))}

                            {[...Array(35)].map((_, i) => (
                                <div key={i} className="aspect-square p-1">
                                    <Skeleton className="h-full w-full rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48 mb-4" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <Skeleton className="h-4 w-4 mt-1 flex-shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
