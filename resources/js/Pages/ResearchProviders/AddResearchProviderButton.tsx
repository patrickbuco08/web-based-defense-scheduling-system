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
import { useCreateResearchProvider } from "@/features/research-providers/mutations/useCreateResearchProvider";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import React, { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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

export function AddResearchProviderButton() {
  const [open, setOpen] = useState(false);
  const { data: departments } = useDepartments();
  const createProvider = useCreateResearchProvider();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department_id: 0,
  });

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
      await createProvider.mutateAsync(formData);
      setOpen(false);
      setFormData({
        name: "",
        role: "",
        department_id: 0,
      });
      toast.success("Research service provider created successfully");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to create research service provider";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Research Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Research Service Provider</DialogTitle>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProvider.isPending}>
              {createProvider.isPending ? "Creating..." : "Create Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
