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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { useResearchProviders } from "@/features/research-providers/queries/useResearchProviders";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const presentationTypes = ["title presentation", "oral", "final", "others"] as const;

type FormData = {
  title: string;
  presentation_type: string;
  group_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
  research_providers: number[];
};

export function DefenseProposal() {
  const { requirePassword, isVerifyingPassword } = useSecurity();
  const [isOpen, setIsOpen] = useState(false);
  const { data: groups = [] } = useGroups();
  const { data: researchProviders = [] } = useResearchProviders();
  const { mutate: createDefense, isPending } = useCreateDefense();

  const getCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // If current time is outside 7am-7pm range, default to 8am
  if (currentHour < 7 || currentHour >= 19) {
    return '08:00';
  }
  
  return format(now, 'HH:mm');
};
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data, setData, errors, reset } = useForm<FormData>({
    title: '',
    presentation_type: 'title presentation',
    group_id: '',
    date: today,
    start_time: getCurrentTime(),
    end_time: '10:00',
    notes: '',
    research_providers: [],
  });

  // Update start_time to current time when date changes to today
  useEffect(() => {
    if (data.date === today) {
      const currentTime = getCurrentTime();
      let endTime = new Date();
      
      // If current time is outside 7am-7pm, use 8-9am slot
      const currentHour = new Date().getHours();
      if (currentHour < 7 || currentHour >= 19) {
        endTime = new Date();
        endTime.setHours(9, 0, 0, 0); // 9:00 AM
        setData('end_time', '09:00');
      } else {
        endTime.setHours(endTime.getHours() + 1); // Add 1 hour
        setData('end_time', format(endTime, 'HH:mm'));
      }
      
      setData('start_time', currentTime);
    }
  }, [data.date, today]);

  const [open, setOpen] = useState(false);

  const selectedProviders = researchProviders.filter((provider: any) =>
    data.research_providers.includes(provider.id)
  );

  const toggleProvider = (providerId: number) => {
    setData(
      'research_providers',
      data.research_providers.includes(providerId)
        ? data.research_providers.filter(id => id !== providerId)
        : [...data.research_providers, providerId]
    );
  };

  const removeProvider = (providerId: number) => {
    setData('research_providers', data.research_providers.filter(id => id !== providerId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requirePassword();


      createDefense({
        ...data,
        group_id: data.group_id,
        research_providers: data.research_providers,
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Don't close if password is being verified
      if (!open && isVerifyingPassword) {
        return;
      }
      setIsOpen(open);
    }} modal={false}>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80" 
          onClick={(e) => e.preventDefault()} // Prevent backdrop from closing modal
        />
      )}
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="title">Defense Title <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="presentation_type">Presentation Type</Label>
              <Select
                value={data.presentation_type}
                onValueChange={(value) => setData('presentation_type', value)}
              >
                <SelectTrigger id="presentation_type">
                  <SelectValue placeholder="Select presentation type" />
                </SelectTrigger>
                <SelectContent>
                  {presentationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.presentation_type && <p className="text-sm text-red-500">{errors.presentation_type}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* group selection */}
                <div className="space-y-2">
                  <Label htmlFor="group_id">Group <span className="text-destructive">*</span></Label>
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
                    Preferred Date <span className="text-destructive">*</span>
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
                        disabled={(date: Date) => date < new Date()}
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
                    Start Time <span className="text-destructive">*</span>
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
                    End Time <span className="text-destructive">*</span>
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
            

            <div className="space-y-2">
              <Label>Research Service Providers <span className="text-destructive">*</span></Label>
              
              {/* Selected Providers Badges */}
              {selectedProviders.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                  {selectedProviders.map((provider: any) => (
                    <Badge key={provider.id} variant="secondary" className="gap-1">
                      {provider.name} ({provider.role})
                      <button
                        type="button"
                        onClick={() => removeProvider(provider.id)}
                        className="ml-1 hover:bg-destructive/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Command Popover for Multi-Select */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedProviders.length > 0
                      ? `${selectedProviders.length} provider${selectedProviders.length > 1 ? 's' : ''} selected`
                      : "Select research providers..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search providers by name or role..." />
                    <CommandList>
                      <CommandEmpty>No research providers found.</CommandEmpty>
                      <CommandGroup>
                        {researchProviders.map((provider: any) => (
                          <CommandItem
                            key={provider.id}
                            value={`${provider.name} ${provider.role} ${provider.department?.name || ''}`}
                            onSelect={() => toggleProvider(provider.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                data.research_providers.includes(provider.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{provider.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {provider.role} • {provider.department?.name || 'N/A'}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {errors.research_providers && <p className="text-sm text-red-500">{errors.research_providers}</p>}
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
