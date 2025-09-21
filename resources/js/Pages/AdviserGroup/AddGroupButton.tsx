import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { useActiveTerm } from "@/features/terms/queries/useActiveTerm";
import { useCritics } from "@/features/critics/queries/useCritics";
import { useCreateGroup } from "@/features/groups/mutations/useCreateGroup";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

// Types
interface Department {
  id: number;
  name: string;
}

interface Critic {
  id: number;
  name: string;
}

interface Term {
  id: number;
  semester: string;
  school_year: string;
}

interface Member {
  id: number;
  name: string;
}

export const AddGroupButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([{ id: Date.now(), name: "" }]);

  const createGroupMutation = useCreateGroup();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: activeTerm } = useActiveTerm();
  const { data: critics } = useCritics();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    group_code: "",
    department_id: user?.department_id?.toString() || '',
    term_id: "",
    critic_id: "",
  });

  // Set active term when loaded
  useEffect(() => {
    if (activeTerm) {
      setFormData(prev => ({
        ...prev,
        term_id: activeTerm.id.toString(),
      }));
    }
  }, [activeTerm]);

  const handleAddMember = () => {
    setMembers([...members, { id: Date.now(), name: "" }]);
  };

  const handleRemoveMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const handleMemberChange = (id: number, value: string) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, name: value } : member
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty member names
    const validMembers = members.filter(member => member.name.trim() !== '');

    if (validMembers.length === 0) {
      toast.error("Please add at least one group member");
      return;
    }

    const submitData = {
      ...formData,
      members: validMembers.map(member => ({ name: member.name })),
    };

    createGroupMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("Group created successfully!");
        setIsOpen(false);
        // Reset form
        setFormData({
          group_code: "",
          department_id: "",
          term_id: activeTerm?.id.toString() || "",
          critic_id: "",
        });
        setMembers([{ id: Date.now(), name: "" }]);
      },
      onError: (error: any) => {
        console.error("Error creating group:", error);
        toast.error(error.response?.data?.message || "Failed to create group");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group_code" className="text-right">
              Group Code
            </Label>
            <Input
              id="group_code"
              name="group_code"
              value={formData.group_code}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department_id" className="text-right">
              Department
            </Label>
            <Select
              name="department_id"
              value={formData.department_id}
              onValueChange={(value) => handleSelectChange("department_id", value)}
              required
              disabled={!!user?.department_id}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingDepartments ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  departments?.map((dept: Department) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Term</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              {activeTerm ? (
                `${activeTerm.semester} - ${activeTerm.school_year}`
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="critic_id" className="text-right">
              Critic
            </Label>
            <Select
              name="critic_id"
              value={formData.critic_id}
              onValueChange={(value) => handleSelectChange("critic_id", value)}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select a critic" />
              </SelectTrigger>
              <SelectContent>
                {critics?.map((critic: Critic) => (
                  <SelectItem key={critic.id} value={critic.id.toString()}>
                    {critic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex gap-2">
                  <Input
                    value={member.name}
                    onChange={(e) => handleMemberChange(member.id, e.target.value)}
                    placeholder="Member name"
                    className="flex-1"
                    required={members.length > 1}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={members.length === 1}
                    className="h-10 w-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createGroupMutation.isPending}>
              {createGroupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
