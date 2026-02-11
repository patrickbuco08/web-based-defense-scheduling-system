import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AddTermForm from "./AddTermForm";
import { Plus } from "lucide-react";

const AddTermButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Add Academic Year
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Academic Year</DialogTitle>
                </DialogHeader>
                <AddTermForm onSuccess={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default AddTermButton;
