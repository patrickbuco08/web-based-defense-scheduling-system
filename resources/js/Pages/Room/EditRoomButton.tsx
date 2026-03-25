import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUpdateRoom } from "@/features/rooms/mutations";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface EditRoomButtonProps {
  room: {
    id: number;
    room_number: string;
    building: string;
    is_active: boolean;
    department_ids: number[];
  };
}

export function EditRoomButton({
  room,
}: EditRoomButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    room_number: room.room_number,
    building: room.building,
    is_active: room.is_active,
  });
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>(room.department_ids || []);

  const updateRoomMutation = useUpdateRoom();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDepartments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    try {
      await updateRoomMutation.mutateAsync({
        id: room.id,
        ...formData,
        department_ids: selectedDepartments,
      });
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);

      if (!open) {
        setSelectedDepartments(room.department_ids || []);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number <span className="text-destructive">*</span></Label>
            <Input
              id="room_number"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">Building <span className="text-destructive">*</span></Label>
            <Input
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Departments <span className="text-destructive">*</span></Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {isLoadingDepartments ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                departments?.map((department: { id: number; name: string }) => (
                  <div key={department.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-room-dept-${department.id}`}
                      checked={selectedDepartments.includes(department.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDepartments([...selectedDepartments, department.id]);
                        } else {
                          setSelectedDepartments(selectedDepartments.filter((id) => id !== department.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`edit-room-dept-${department.id}`} className="text-sm cursor-pointer">
                      {department.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is_active">Available</Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRoomMutation.isPending}>
              {updateRoomMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
