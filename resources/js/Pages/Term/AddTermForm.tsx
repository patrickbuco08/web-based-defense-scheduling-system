import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTerm } from "@/features/terms/mutations/useCreateTerm";

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
                <Label htmlFor="school_year">School Year</Label>
                <Input
                    id="school_year"
                    name="school_year"
                    value={formData.school_year}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
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
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createTermMutation.isPending}>
                    {createTermMutation.isPending ? "Adding..." : "Add Term"}
                </Button>
            </div>
        </form>
    );
};

export default AddTermForm;
