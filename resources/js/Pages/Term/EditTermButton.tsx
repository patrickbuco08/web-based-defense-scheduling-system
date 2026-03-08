import React from "react";

import { TermInterface } from '@/features/terms/api';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateTerm } from "@/features/terms/mutations/useUpdateTerm";
import { useSecurity } from "@/contexts/SecurityContext";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


interface EditTermButtonProps {
    term: TermInterface;
}

const EditTermButton = ({ term }: EditTermButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        school_year: term.school_year,
        semester: term.semester,
        is_current: term.is_current,
    });

    const updateTermMutation = useUpdateTerm();
    const { requirePassword, isVerifyingPassword } = useSecurity();
    const queryClient = useQueryClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requirePassword();
            await updateTermMutation.mutateAsync({
                id: term.id,
                data: formData,
            });
            
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            queryClient.invalidateQueries({ queryKey: ["defenses"] });
            queryClient.invalidateQueries({ queryKey: ["defenses", "archived"] });
            
            setIsOpen(false);
            toast.success("Academic Year updated successfully.");
        } catch (error) {
            toast.error("Failed to update academic year. Please try again.");
            // Error is handled by the parent component
        }
    };

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
                    <DialogTitle>Edit Academic Year</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="school_year">School Year <span className="text-destructive">*</span></Label>
                        <Input
                            id="school_year"
                            name="school_year"
                            value={formData.school_year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="semester">Semester <span className="text-destructive">*</span></Label>
                        <Input
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_current"
                            name="is_current"
                            checked={formData.is_current}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="is_current">Set as current term</Label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isVerifyingPassword || updateTermMutation.isPending}>
                            {isVerifyingPassword ? "Verifying..." : updateTermMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditTermButton