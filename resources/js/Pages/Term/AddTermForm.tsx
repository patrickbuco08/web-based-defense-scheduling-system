import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTerm } from "@/features/terms/mutations/useCreateTerm";
import { useTerms } from "@/features/terms/queries/useTerms";

interface AddTermFormProps {
    onSuccess?: () => void;
}

const AddTermForm = ({ onSuccess }: AddTermFormProps) => {
    const [formData, setFormData] = useState({
        school_year: "",
        semester: "",
        is_current: false,
    });

    const createTermMutation = useCreateTerm();
    const { data: existingTerms = [] } = useTerms();

    // Generate academic year options (current year and next)
    const generateAcademicYears = () => {
        const currentYear = new Date().getFullYear();
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
            years.push(`${nextYear}-${nextYear + 1}`);
        } else {
            // If no existing terms, start from current year
            years.push(`${currentYear}-${currentYear + 1}`);
        }
        
        return years;
    };

    const academicYears = generateAcademicYears();
    const semesters = ["1st Semester", "2nd Semester", "3rd Semester"];

    // Auto-select first option when component mounts
    useEffect(() => {
        if (academicYears.length > 0 && !formData.school_year) {
            setFormData(prev => ({ ...prev, school_year: academicYears[0] }));
        }
    }, [academicYears]);

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
            await createTermMutation.mutateAsync(formData);
            setFormData({
                school_year: "",
                semester: "",
                is_current: false,
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="school_year">Academic Year <span className="text-destructive">*</span></Label>
                <Select
                    value={formData.school_year}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, school_year: value }))}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
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
                        <SelectValue placeholder="Select semester" />
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
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createTermMutation.isPending}>
                    {createTermMutation.isPending ? "Adding..." : "Add Term"}
                </Button>
            </div>
        </form>
    );
};

export default AddTermForm;
