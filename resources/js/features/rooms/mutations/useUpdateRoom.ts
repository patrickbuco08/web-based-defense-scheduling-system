// resources/js/features/rooms/mutations/useUpdateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "../api";
import { toast } from "sonner";

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & RoomUpdateData) => 
      roomsApi.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating room:", error);
      toast.error("Failed to update room. Please try again.");
    },
  });
}

// Types
interface RoomUpdateData {
  room_number: string;
  building: string;
  is_active: boolean;
}