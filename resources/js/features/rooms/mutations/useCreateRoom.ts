import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "../api";
import { toast } from "sonner";

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoomCreateData) => roomsApi.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    },
  });
}

export interface RoomCreateData {
  room_number: string;
  building: string;
  is_active: boolean;
  department_ids: number[];
}
