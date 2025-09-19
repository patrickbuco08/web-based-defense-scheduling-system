import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useRoles } from "@/features/roles/queries/useRoles";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { Loader2, Pencil } from "lucide-react";
import { useUpdateAccount } from "@/features/accounts/mutations/useUpdateAccount";

interface EditAccountButtonProps {
  account: {
    id: number;
    name: string;
    email: string;
    role: string;
    department?: {
      id: number;
      name: string;
    } | null;
  };
}

export function EditAccountButton({ account }: EditAccountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: account.name,
    email: account.email,
    role: account.role,
    department_id: account.department?.id || null,
  });

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();

  // Update form data when account prop changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        email: account.email,
        role: account.role,
        department_id: account.department?.id || null,
      });
    }
  }, [account]);

  const updateAccountMutation = useUpdateAccount();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send
    const updateData = {
      id: account.id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department_id: formData.department_id || null,
    };

    updateAccountMutation.mutate(updateData, {
      onSuccess: () => {
        toast.success("Account updated successfully");
        setIsOpen(false);
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        toast.error(error.response?.data?.message || "Failed to update account");
      },
    });
  };

  if (isLoadingRoles || isLoadingDepartments) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {roles?.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department_id" className="text-right">
                Department
              </Label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    department_id: value
                  }));
                }}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={updateAccountMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateAccountMutation.isPending}>
                {updateAccountMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
