// resources/js/Pages/Room/DeleteRoomButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useDeleteRoom } from "@/features/rooms/mutations";
import { useState } from "react";

interface DeleteRoomButtonProps {
  id: number;
  roomNumber: string;
}

export function DeleteRoomButton({ id, roomNumber }: DeleteRoomButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

  const deleteRoomMutation = useDeleteRoom();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete room {roomNumber}. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await deleteRoomMutation.mutateAsync(id);
                setIsOpen(false);
              } catch (error: any) {
                // Error is handled by the mutation
              }
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteRoomMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
