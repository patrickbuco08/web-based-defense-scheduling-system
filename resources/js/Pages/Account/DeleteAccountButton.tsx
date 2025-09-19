import React, { useState } from "react";
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
import { useDeleteAccount } from "@/features/accounts/mutations/useDeleteAccount";

interface DeleteAccountButtonProps {
  id: number;
  name: string;
}

export function DeleteAccountButton({ id, name }: DeleteAccountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccount();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await deleteAccountMutation.mutateAsync(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

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
            This will permanently delete the account for {name}. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className="bg-red-600 hover:bg-red-700"
            >
              <button 
                onClick={handleDelete}
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
