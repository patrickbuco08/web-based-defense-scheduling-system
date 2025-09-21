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
import { useDeleteDepartment } from "@/features/departments/mutations/useDeleteDepartment";
import { toast } from "sonner";

interface DeleteDepartmentButtonProps {
  id: number;
  departmentCode: string;
}

export function DeleteDepartmentButton({ id, departmentCode }: DeleteDepartmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteDepartment, isPending } = useDeleteDepartment();

  const handleDelete = () => {
    deleteDepartment(id, {
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Department deleted successfully!");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Failed to delete department";
        toast.error(errorMessage);
      },
    });
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
          <AlertDialogTitle>Delete Department</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the department "{departmentCode}"? This action
            cannot be undone and may affect users and groups associated with this department.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
