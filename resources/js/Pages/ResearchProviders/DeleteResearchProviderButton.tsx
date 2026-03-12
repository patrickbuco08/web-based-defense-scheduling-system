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
import { useDeleteResearchProvider } from "@/features/research-providers/mutations/useDeleteResearchProvider";
import { ResearchProvider } from "@/features/research-providers/api";

interface DeleteResearchProviderButtonProps {
  provider: ResearchProvider;
}

export function DeleteResearchProviderButton({ provider }: DeleteResearchProviderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteProviderMutation = useDeleteResearchProvider();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await deleteProviderMutation.mutateAsync(provider.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete research provider:", error);
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
            This will permanently delete {provider.name} ({provider.role}). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProviderMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className="bg-red-600 hover:bg-red-700"
            >
              <button 
                onClick={handleDelete}
                disabled={deleteProviderMutation.isPending}
              >
                {deleteProviderMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
