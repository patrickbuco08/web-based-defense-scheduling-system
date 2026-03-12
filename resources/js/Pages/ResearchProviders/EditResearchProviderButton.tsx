import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateResearchProvider } from "@/features/research-providers/mutations/useUpdateResearchProvider";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { ResearchProvider } from "@/features/research-providers/api";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const PROVIDER_ROLES = [
  "Research Adviser",
  "Panelist",
  "Research Expert (Validator)",
  "Subject Expert (Validator)",
  "Language Expert (Validator)",
  "Statistician",
  "Technical Critic",
  "Language Critic",
  "Qualitative Expert",
  "Feasibility Adviser",
  "Feasibility Panelist",
  "Psychological Adviser",
];

interface EditResearchProviderButtonProps {
  provider: ResearchProvider;
}

export function EditResearchProviderButton({ provider }: EditResearchProviderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: departments } = useDepartments();
  const updateProvider = useUpdateResearchProvider();

  const [formData, setFormData] = useState({
    name: provider.name,
    role: provider.role,
    department_id: provider.department?.id || 0,
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        role: provider.role,
        department_id: provider.department?.id || 0,
      });
    }
  }, [provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.department_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateProvider.mutateAsync({
        id: provider.id,
        data: formData,
      });
      setIsOpen(false);
      toast.success("Research service provider updated successfully");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to update research service provider";
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Research Service Provider</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department <span className="text-destructive">*</span></Label>
              <Select
                value={formData.department_id.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: parseInt(value) }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProvider.isPending}>
              {updateProvider.isPending ? "Updating..." : "Update Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
