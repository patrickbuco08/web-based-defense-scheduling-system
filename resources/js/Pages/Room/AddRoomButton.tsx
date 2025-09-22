import React, { useState } from "react";
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
import { useCreateRoom } from "@/features/rooms/mutations";
import { Plus } from "lucide-react";

export function AddRoomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    room_number: "",
    building: "",
    is_active: true,
  });

  const createRoomMutation = useCreateRoom();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoomMutation.mutateAsync({
        room_number: formData.room_number,
        building: formData.building,
        is_active: formData.is_active,
      });
      setFormData({
        room_number: "",
        building: "",
        is_active: true,
      });
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number</Label>
            <Input
              id="room_number"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Input
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              required
            />
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
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createRoomMutation.isPending}>
              {createRoomMutation.isPending ? "Adding..." : "Add Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddRoomButton;
