import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { useCreateDefense } from "@/features/defenses/mutations/useCreateDefense";
import { toast } from "sonner";
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
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroups } from "@/features/groups/queries/useGroups";
import { format, parseISO, formatISO } from "date-fns";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ErrorResponseInterface } from "@/features/types";
import { AxiosError } from "axios";
import { useSecurity } from "@/contexts/SecurityContext";


type FormData = {
  title: string;
  group_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
};

export function DefenseProposal() {
  const { requirePassword } = useSecurity();
  const [isOpen, setIsOpen] = useState(false);
  const { data: groups = [] } = useGroups();
  const { mutate: createDefense, isPending } = useCreateDefense();

  const { data, setData, errors, reset } = useForm<FormData>({
    title: '',
    group_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requirePassword();

      createDefense({
        ...data,
        group_id: data.group_id,
      }, {
        onSuccess: () => {
          setIsOpen(false);
          reset();
          toast.success("Defense scheduled successfully!");
        },
        onError: (error: AxiosError<ErrorResponseInterface>) => {
          console.error("Error creating defense:", error);

          const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to schedule defense. Please try again.";

          toast.error(errorMessage);
        },
      });
    } catch (error: any) {
      if (error?.message === "Password confirmation cancelled") {
        toast.info("Defense creation cancelled");
        return;
      }
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to verify password";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Schedule Defense"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          onClick={() => setIsOpen(true)}
        >
          <IconCirclePlusFilled />
          <span>Schedule New Defense</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule New Defense</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new defense session.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Defense Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Enter defense title"
                required
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* group selection */}
                <div className="space-y-2">
                  <Label htmlFor="group_id">Group</Label>
                  <Select
                    value={data.group_id}
                    onValueChange={(value) => setData('group_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.group_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.group_id && <p className="text-sm text-red-500">{errors.group_id}</p>}
                </div>
                {/* Date Picker */}
                <div className="flex-1">
                  <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                    Preferred Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !data.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {data.date ? (
                          format(parseISO(data.date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={data.date ? parseISO(data.date) : undefined}
                        onSelect={(date) =>
                          setData("date", date ? formatISO(date, { representation: 'date' }) : '')
                        }
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Start Time */}
                <div className="flex-1">
                  <Label htmlFor="start_time" className="text-sm font-medium mb-1 block">
                    Start Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="start_time"
                      type="time"
                      value={data.start_time}
                      onChange={(e) => setData("start_time", e.target.value)}
                      className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      required
                    />
                  </div>
                  {errors.start_time && (
                    <p className="text-sm text-red-500 mt-1">{errors.start_time}</p>
                  )}
                </div>

                {/* End Time */}
                <div className="flex-1">
                  <Label htmlFor="end_time" className="text-sm font-medium mb-1 block">
                    End Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="end_time"
                      type="time"
                      value={data.end_time}
                      onChange={(e) => setData("end_time", e.target.value)}
                      min={data.start_time}
                      className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      required
                    />
                  </div>
                  {errors.end_time && (
                    <p className="text-sm text-red-500 mt-1">{errors.end_time}</p>
                  )}
                </div>
              </div>
            </div>

            {/* notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional notes or instructions..."
                rows={3}
              />
              {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Scheduling...' : 'Schedule Defense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
