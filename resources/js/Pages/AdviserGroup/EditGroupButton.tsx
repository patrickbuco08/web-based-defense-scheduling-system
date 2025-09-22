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
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useUpdateGroup } from "@/features/groups/mutations/useUpdateGroup";
import { Group } from "@/features/groups/api";
import { useActiveTerm } from "@/features/terms/queries/useActiveTerm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCritics } from "@/features/critics/queries/useCritics";

interface EditGroupButtonProps {
  group: Group;
}

// Hardcoded terms for now as requested
const HARDCODED_TERMS = [
  { id: 1, school_year: "2023-2024", semester: "1st Semester" },
  { id: 2, school_year: "2023-2024", semester: "2nd Semester" },
  { id: 3, school_year: "2024-2025", semester: "1st Semester" },
  { id: 4, school_year: "2024-2025", semester: "2nd Semester" },
];

export function EditGroupButton({ group }: EditGroupButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    department_id: group.department_id,
    term_id: group.term_id,
    group_code: group.group_code,
    critic_id: group.critic_id || null,
  });

  const [members, setMembers] = useState<Array<{ id: number; name: string }>>(
    group.members && group.members.length > 0
      ? group.members.map((m) => ({
        id: Date.now() + Math.random(),
        name: m.student_name
      }))
      : [{ id: Date.now(), name: "" }]
  );

  const updateGroupMutation = useUpdateGroup();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: activeTerm } = useActiveTerm();
  const { data: critics } = useCritics();

  const handleAddMember = () => {
    setMembers([...members, { id: Date.now(), name: "" }]);
  };

  const handleRemoveMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter((member) => member.id !== id));
    }
  };

  const handleMemberChange = (id: number, value: string) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, name: value } : member
      )
    );
  };

  // Update form data when group, activeTerm, or critics change
  useEffect(() => {
    if (group) {
      setFormData((prev) => ({
        ...prev,
        department_id: group.department_id,
        term_id: activeTerm?.id || group.term_id,
        group_code: group.group_code,
        critic_id: group.critic_id || null,
      }));
    }
  }, [group, activeTerm, critics]);

  // Set the selected critic when critics data is loaded
  useEffect(() => {
    if (critics && group?.critic_id) {
      const criticExists = critics.some((critic: { id: number }) => critic.id === group.critic_id);
      if (criticExists) {
        setFormData((prev) => ({
          ...prev,
          critic_id: group.critic_id,
        }));
      }
    }
  }, [critics, group?.critic_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : (name === "department_id" || name === "term_id" || name === "critic_id") ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty member names
    const validMembers = members.filter((member) => member.name.trim() !== "");

    if (validMembers.length === 0) {
      toast.error("Please add at least one group member");
      return;
    }

    const updateData = {
      ...formData,
      members: validMembers.map((member) => ({ name: member.name })),
    };

    updateGroupMutation.mutate(
      {
        id: group.id,
        data: updateData,
      },
      {
        onSuccess: () => {
          toast.success("Group updated successfully");
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Error updating group:", error);
          toast.error("Failed to update group");
        },
      }
    );
  };

  if (isLoadingDepartments) {
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
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
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
                value={formData.department_id?.toString()}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, department_id: Number(value) }))
                }
                required
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((department: any) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeTerm && (<div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term_id" className="text-right">
                Term
              </Label>
              <Select
                name="term_id"
                value={formData.term_id?.toString()}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, term_id: Number(value) }))
                }
                disabled={!!activeTerm}
                required
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={activeTerm.id.toString()}>
                    {activeTerm.school_year} - {activeTerm.semester}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="critic_id" className="text-right">
                Critic
              </Label>
              <Select
                name="critic_id"
                value={formData.critic_id?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, critic_id: value !== "none" ? Number(value) : null }))
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="No Critic Assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Critic Assigned</SelectItem>
                  {critics?.map((critic: any) => (
                    <SelectItem key={critic.id} value={critic.id.toString()}>
                      {critic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm text-muted-foreground">
                Adviser
              </Label>
              <div className="col-span-3 text-sm text-muted-foreground">
                {group.adviser?.name}
              </div>
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
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateGroupMutation.isPending}
            >
              {updateGroupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
