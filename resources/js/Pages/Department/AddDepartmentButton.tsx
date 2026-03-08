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
import { Plus } from "lucide-react";
import { useCreateDepartment } from "@/features/departments/mutations/useCreateDepartment";
import { toast } from "sonner";

export function AddDepartmentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  const { mutate: createDepartment, isPending } = useCreateDepartment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    createDepartment(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ code: "", name: "" });
        toast.success("Course created successfully!");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Failed to create course";
        toast.error(errorMessage);
      },
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course. Fill in the course code and name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                placeholder="e.g., CS, IT, ENG"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
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
              {isPending ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
