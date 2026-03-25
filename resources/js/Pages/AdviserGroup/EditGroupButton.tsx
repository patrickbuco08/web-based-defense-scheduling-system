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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useUpdateGroup } from "@/features/groups/mutations/useUpdateGroup";
import type { Group } from "@/features/groups/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCritics } from "@/features/critics/queries/useCritics";
import { useActiveTerm } from "@/features/terms/queries/useActiveTerm";
import { Input } from "@/components/ui/input";
import { useResearchProviders } from "@/features/research-providers/queries/useResearchProviders";

interface GroupMember {
  id: number;
  student_name: string;
}

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
    term_id: group.term_id,
    group_code: group.group_code || "",
    course_code: group.course_code || "",
    critic_id: group.critic_id || null,
    // fallback to any-typed access if not present in Group type
    research_critic_id: (group as any)?.research_critic_id ?? (group as any)?.researchCritic?.id ?? null,
  });

  const [selectedDepartments, setSelectedDepartments] = useState<number[]>(
    group.departments && group.departments.length > 0
      ? group.departments.map((d: any) => d.id)
      : []
  );

  const [members, setMembers] = useState<Array<{ id: number; name: string }>>(
    group.members && group.members.length > 0
      ? group.members.map((m: any) => ({
        id: m.id,
        name: m.student_name,
      }))
      : [{ id: Date.now(), name: "" }]
  );

  const updateGroupMutation = useUpdateGroup();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: activeTerm } = useActiveTerm();
  const { data: critics } = useCritics();
  const { data: researchProviders = [] } = useResearchProviders();

  const handleAddMember = () => {
    setMembers([...members, { id: Date.now(), name: "" }]);
  };

  const handleRemoveMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter((member) => member.id !== id));
    }
  };

  const handleMemberChange = (id: number, field: 'name', value: string) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'department_id' || name === 'term_id' || name === 'critic_id' || name === 'research_critic_id'
        ? value === 'null' ? null : parseInt(value, 10)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First validate members
      if (members.length === 0) {
        toast.error("Please add at least one group member");
        return;
      }

      const validMembers = members.filter((member) => member.name.trim() !== "");

      if (validMembers.length === 0) {
        toast.error("Please add at least one valid group member");
        return;
      }

      // Validate departments
      if (selectedDepartments.length === 0) {
        toast.error("Please select at least one department");
        return;
      }

      // Prepare data for submission
      const data = {
        ...formData,
        department_ids: selectedDepartments,
        members: validMembers.map(({ name }) => ({
          name,
        })),
      };

      // Proceed with the API call
      updateGroupMutation.mutate(
        {
          id: group.id,
          data,
        },
        {
          onSuccess: () => {
            toast.success("Group updated successfully");
            setIsOpen(false);
          },
          onError: (error: any) => {
            console.error("Error updating group:", error);
            toast.error("Failed to update group");
          },
        }
      );
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    }
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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group_code" className="text-right">
                Group Code <span className="text-destructive">*</span>
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
              <Label htmlFor="course_code" className="text-right">
                Course Code
              </Label>
              <Input
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Departments <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3 space-y-2 border rounded-md p-3 max-h-48 overflow-y-auto">
                {isLoadingDepartments ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  departments?.map((dept: any) => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`dept-${dept.id}`}
                        checked={selectedDepartments.includes(dept.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments([...selectedDepartments, dept.id]);
                          } else {
                            setSelectedDepartments(selectedDepartments.filter(id => id !== dept.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`dept-${dept.id}`} className="text-sm cursor-pointer">
                        {dept.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {activeTerm && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="term_id" className="text-right">
                  Term <span className="text-destructive">*</span>
                </Label>
                <Select
                  name="term_id"
                  value={formData.term_id?.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      term_id: Number(value),
                    }))
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
                  setFormData((prev) => ({
                    ...prev,
                    critic_id: value !== "none" ? Number(value) : null,
                  }))
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

            {/* Research Critic (Research Service Provider) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="research_critic_id" className="text-right">
                Research Critic (RSP)
              </Label>
              <Select
                name="research_critic_id"
                value={formData.research_critic_id !== null && formData.research_critic_id !== undefined ? String(formData.research_critic_id) : "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    research_critic_id: value !== "none" ? Number(value) : null,
                  }))
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="No Research Critic Assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Research Critic Assigned</SelectItem>
                  {researchProviders
                    ?.filter((p: any) => (p.role || '').toLowerCase().includes('critic'))
                    .map((p: any) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} ({p.role})
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base">Members <span className="text-destructive">*</span></Label>
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
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col gap-3 p-4 border rounded-md bg-muted/10">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label htmlFor={`member-name-${member.id}`} className="text-sm font-medium">
                            Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`member-name-${member.id}`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                            placeholder="Member name"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={members.length === 1}
                        className="h-8 w-8 self-start"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={updateGroupMutation.isPending}
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
