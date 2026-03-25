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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateTerm } from "@/features/terms/mutations/useUpdateTerm";
import { useTerms } from "@/features/terms/queries/useTerms";
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
    const { data: existingTerms = [] } = useTerms();

    // Generate academic year options
    const generateAcademicYears = () => {
        const years = [];
        
        // Get the latest year from existing terms
        if (existingTerms.length > 0) {
            const latestTerm = existingTerms.sort((a, b) => {
                const aYear = parseInt(a.school_year.split('-')[0]);
                const bYear = parseInt(b.school_year.split('-')[0]);
                return bYear - aYear;
            })[0];
            const latestYear = parseInt(latestTerm.school_year.split('-')[0]);
            const nextYear = latestYear + 1;
            
            // Include current term's year and next year
            const currentTermYear = parseInt(term.school_year.split('-')[0]);
            years.push(term.school_year); // Current term's year
            if (`${nextYear}-${nextYear + 1}` !== term.school_year) {
                years.push(`${nextYear}-${nextYear + 1}`); // Next year
            }
        } else {
            years.push(term.school_year);
        }
        
        return [...new Set(years)]; // Remove duplicates
    };

    const academicYears = generateAcademicYears();
    const semesters = ["1st Semester", "2nd Semester", "3rd Semester"];

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
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
                        <Label htmlFor="school_year">Academic Year <span className="text-destructive">*</span></Label>
                        <Select
                            value={formData.school_year}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, school_year: value }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="semester">Semester <span className="text-destructive">*</span></Label>
                        <Select
                            value={formData.semester}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((sem) => (
                                    <SelectItem key={sem} value={sem}>
                                        {sem}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_current"
                            name="is_current"
                            checked={formData.is_current}
                            onChange={handleCheckboxChange}
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