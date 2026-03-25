// resources/js/Pages/Home/index.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/DialogCloseButton";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Defense Scheduling</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Button className="w-full">Schedule New Defense</Button>
            <Button variant="outline" className="w-full">
              View Upcoming Defense Schedule
            </Button>
            <DialogCloseButton />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
