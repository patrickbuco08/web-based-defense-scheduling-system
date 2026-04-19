import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2 } from "lucide-react";
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
import { useDepartments } from "@/features/departments/queries/useDepartments";
import { useActiveTerm } from "@/features/terms/queries/useActiveTerm";
import { useCritics } from "@/features/critics/queries/useCritics";
import { useResearchProviders } from "@/features/research-providers/queries/useResearchProviders";
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
  const { data: researchProviders = [] } = useResearchProviders();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    course_code: "",
    term_id: "",
    critic_id: "",
    research_critic_id: "",
  });

  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

  // Set user's departments as default if available
  useEffect(() => {
    if (user?.departments && user.departments.length > 0) {
      setSelectedDepartments(user.departments.map((d: any) => d.id));
    }
  }, [user]);

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

  const handleMemberChange = (id: number, field: 'name', value: string) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
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

    // Validate departments
    if (selectedDepartments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      department_ids: selectedDepartments,
      members: validMembers.map(({ name }) => ({
        name,
      })),
    };

    createGroupMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("Group created successfully!");
        setIsOpen(false);
        // Reset form
        setFormData({
          course_code: "",
          term_id: activeTerm?.id?.toString() || "",
          critic_id: "",
          research_critic_id: "",
        });
        setSelectedDepartments(user?.departments?.map((d: any) => d.id) || []);
        setMembers([{ id: Date.now(), name: "" }]);
      },
      onError: (error: any) => {
        console.error("Error creating group:", error);
        toast.error(error?.response?.data?.message || "Failed to create group");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                departments?.map((dept: Department) => (
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Academic Year</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              {activeTerm ? (
                `${activeTerm.semester} - ${activeTerm.school_year}`
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          {/* Technical Critic (Research Service Provider) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="research_critic_id" className="text-right">
              Technical Critic
            </Label>
            <Select
              name="research_critic_id"
              value={formData.research_critic_id}
              onValueChange={(value) => handleSelectChange("research_critic_id", value)}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select a technical critic" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Members <span className="text-destructive">*</span></Label>
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

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
