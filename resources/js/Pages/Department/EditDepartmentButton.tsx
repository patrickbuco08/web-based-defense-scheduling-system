import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Pencil } from "lucide-react";
import { useUpdateDepartment } from "@/features/departments/mutations/useUpdateDepartment";
import { toast } from "sonner";

interface Department {
  id: number;
  code: string;
  name: string;
  created_at: string;
}

interface EditDepartmentButtonProps {
  department: Department;
}

export function EditDepartmentButton({ department }: EditDepartmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: department.code,
    name: department.name,
  });

  const { mutate: updateDepartment, isPending } = useUpdateDepartment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    updateDepartment(
      {
        id: department.id,
        data: formData,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Department updated successfully!");
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to update department";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form data when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFormData({
        code: department.code,
        name: department.name,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information. Make changes and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Department Code</Label>
              <Input
                id="edit-code"
                placeholder="e.g., CS, IT, ENG"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Computer Science"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                maxLength={255}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
