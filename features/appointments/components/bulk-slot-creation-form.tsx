"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCreateBulkSlots } from "@/hooks/use-appointment-slots";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, getDay, startOfDay } from "date-fns";
import {
  Calendar,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  bulkSlotCreationSchema,
  type BulkSlotCreationInput,
} from "../schemas/appointment-schemas";
import type { CreateSlotRequest, TimeSlot } from "../types/appointment";

interface BulkSlotCreationFormProps {
  doctorId: string;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 0, label: "Sunday", short: "Sun" },
];

const SLOT_TYPES = [
  { value: "REGULAR", label: "Regular", color: "bg-blue-100 text-blue-800" },
  {
    value: "CONSULTATION",
    label: "Consultation",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "FOLLOW_UP",
    label: "Follow-up",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "EMERGENCY", label: "Emergency", color: "bg-red-100 text-red-800" },
] as const;

function timeStringToTimeSlot(timeString: string): TimeSlot {
  const [hour, minute] = timeString.split(":").map(Number);
  return { hour, minute, second: 0, nano: 0 };
}

function sameYMD(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isExcluded(date: Date, excluded: Date[]) {
  return excluded.some((d) => sameYMD(d, date));
}

// Generate the list of working dates honoring weekly recurrence, ends mode, and exclusions
function generateWorkingDates(formData: BulkSlotCreationInput): Date[] {
  const start = startOfDay(formData.startDate);
  // Determine hard upper bound for safety: 2 years from start
  const safetyEnd = addDays(start, 365 * 2);

  const mode = formData.ends.mode;
  const repeatEveryWeeks = formData.repeatEveryWeeks;
  const workingDays = formData.workingDays;
  const excludedDates = formData.excludedDates ?? [];

  // For date mode, use the earlier of ends.endDate and provided endDate
  const effectiveEndDate =
    mode === "date" && formData.ends.endDate
      ? formData.ends.endDate < formData.endDate
        ? formData.ends.endDate
        : formData.endDate
      : formData.endDate;

  const results: Date[] = [];

  // Iterate day by day, but only include dates where (weeks since start) % repeatEveryWeeks === 0
  // Stop condition depends on mode
  let cursor = new Date(start);
  const maxStop = mode === "date" ? effectiveEndDate : safetyEnd;
  const targetOccurrences =
    mode === "count" ? formData.ends.count ?? 0 : Number.POSITIVE_INFINITY;

  while (cursor <= maxStop && results.length < targetOccurrences) {
    const daysDiff = Math.floor(
      (startOfDay(cursor).getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weeksFromStart = Math.floor(daysDiff / 7);
    const isOnRecurrenceWeek = weeksFromStart % repeatEveryWeeks === 0;

    if (isOnRecurrenceWeek) {
      const dayOfWeek = getDay(cursor);
      if (
        workingDays.includes(dayOfWeek) &&
        !isExcluded(cursor, excludedDates)
      ) {
        results.push(new Date(cursor));
      }
    }
    cursor = addDays(cursor, 1);
  }

  // If it's "date" mode, further cap by ends.endDate if present
  if (mode === "date" && formData.ends.endDate) {
    return results.filter((d) => d <= formData.ends.endDate!);
  }

  return results;
}

function calculateSlotCount(formData: BulkSlotCreationInput): number {
  const dates = generateWorkingDates(formData);
  return dates.length * formData.timeSlots.length;
}

import type { UseFormReturn } from "react-hook-form";

export default function BulkSlotCreationForm({
  doctorId,
  onSuccess,
}: BulkSlotCreationFormProps) {
  const createBulkSlots = useCreateBulkSlots();

  const form: UseFormReturn<BulkSlotCreationInput> = useForm<BulkSlotCreationInput>({
    resolver: zodResolver(bulkSlotCreationSchema),
    defaultValues: {
      doctorId: doctorId,
      facilityId: "",

      startDate: new Date(),
      endDate: addDays(new Date(), 28),
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
      repeatEveryWeeks: 1,
      ends: { mode: "date", endDate: addDays(new Date(), 28) },
      excludedDates: [],
      timeSlots: [
        {
          startTime: "09:00",
          endTime: "09:30",
          slotType: "REGULAR",
          duration: 30,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeSlots",
  });

  const watchedValues = form.watch();
  const previewCount = React.useMemo(() => {
    try {
      return calculateSlotCount(watchedValues);
    } catch {
      return 0;
    }
  }, [watchedValues]);

  // NEW: compute the actual generated dates for inline calendar preview
  const previewDates = React.useMemo(() => {
    try {
      return generateWorkingDates(watchedValues);
    } catch {
      return [];
    }
  }, [watchedValues]);

  const onSubmit: SubmitHandler<BulkSlotCreationInput> = async (data) => {
    try {
      const workingDates = generateWorkingDates(data);
      const slots: CreateSlotRequest[] = [];

      for (const date of workingDates) {
        for (const timeSlot of data.timeSlots) {
          slots.push({
            doctorId: data.doctorId,
            slotDate: format(date, "yyyy-MM-dd"),
            startTime: timeStringToTimeSlot(timeSlot.startTime),
            endTime: timeStringToTimeSlot(timeSlot.endTime),
            isAvailable: true,
            slotType: timeSlot.slotType,
            facilityId: "",
          });
        }
      }

      await createBulkSlots.mutateAsync(slots);
      onSuccess?.();
      form.reset(form.getValues()); // keep current selections
    } catch (error) {
      console.error("Error creating bulk slots:", error);
    }
  };

  const excludedDates = form.watch("excludedDates") || [];

  function toggleExcludedDate(date?: Date) {
    if (!date) return;
    const current = form.getValues("excludedDates") || [];
    const exists = current.some((d) => sameYMD(d, date));
    if (exists) {
      form.setValue(
        "excludedDates",
        current.filter((d) => !sameYMD(d, date)),
        { shouldDirty: true, shouldTouch: true, shouldValidate: true }
      );
    } else {
      form.setValue("excludedDates", [...current, date], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-white mb-4">
          <CalendarDays className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Appointment Slots
        </h2>
        <p className="text-muted-foreground">
          Set up your availability by creating multiple appointment slots with
          weekly recurrence
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range & Recurrence */}
            <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Date Range & Recurrence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-transparent"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < startOfDay(new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (preview bound)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-transparent"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < form.getValues("startDate")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="repeatEveryWeeks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repeat every (weeks)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ends.mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ends</FormLabel>
                        <RadioGroup
                          className="flex items-center gap-6"
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="date" id="ends-date" />
                            <label
                              htmlFor="ends-date"
                              className="text-sm font-medium"
                            >
                              On date
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="count" id="ends-count" />
                            <label
                              htmlFor="ends-count"
                              className="text-sm font-medium"
                            >
                              After count
                            </label>
                          </div>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("ends.mode") === "date" ? (
                    <FormField
                      control={form.control}
                      name="ends.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ends On</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal bg-transparent"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < form.getValues("startDate")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="ends.count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occurrences</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={2000}
                              value={field.value ?? 10}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Working Days */}
            <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  Working Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-3">
                        {DAYS_OF_WEEK.map((day) => (
                          <FormField
                            key={day.value}
                            control={form.control}
                            name="workingDays"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), day.value]
                                        : field.value?.filter(
                                            (value) => value !== day.value
                                          ) || [];
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          <Card className="border-2 border-dashed border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Time Slots
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      startTime: "09:00",
                      endTime: "09:30",
                      slotType: "REGULAR",
                      duration: 30,
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Slot
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Slot {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.slotType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slot Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SLOT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`size-3  rounded-full ${type.color}`}
                                    />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={15}
                              max={480}
                              step={15}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Excluded Dates */}
          <Card className="border-2 border-dashed border-amber-200 hover:border-amber-300 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Exclude Specific Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {excludedDates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No excluded dates selected
                  </p>
                ) : (
                  excludedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((d) => (
                      <Badge
                        key={d.toISOString()}
                        variant="secondary"
                        className="gap-1"
                      >
                        {format(d, "PPP")}
                        <button
                          type="button"
                          aria-label="Remove date"
                          className="ml-1 hover:text-red-600"
                          onClick={() => toggleExcludedDate(d)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                )}
              </div>

              <div className="rounded-md border p-2">
                <CalendarComponent
                  mode="multiple"
                  selected={excludedDates}
                  onSelect={(dates) => {
                    // react-day-picker for multiple mode provides Date[] | undefined
                    form.setValue("excludedDates", dates || [], {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  disabled={(date) => date < form.getValues("startDate")}
                  initialFocus
                />
              </div>
            </CardContent>
          </Card>

          {/* NEW: Inline Calendar Preview of Generated Dates */}
          <Card className="border-2 border-dashed border-sky-200 hover:border-sky-300 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-sky-600" />
                Calendar Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The highlighted dates below will have slots created based on
                your current selections.
              </p>
              <div className="rounded-md border p-2">
                <CalendarComponent
                  mode="multiple"
                  selected={previewDates}
                  numberOfMonths={2}
                  showOutsideDays
                  // Show excluded dates as a distinct modifier overlay
                  modifiers={{ excluded: excludedDates }}
                  modifiersClassNames={{
                    excluded: "bg-red-100 text-red-900 rounded-md!",
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-sm bg-primary/70" />
                  Generated dates
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-sm bg-red-100 border border-red-300" />
                  Excluded dates
                </span>
                <Badge variant="outline" className="ml-auto">
                  {previewDates.length} days
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Preview count summary */}
          <Card className="bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {previewCount}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total appointment slots will be created
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {watchedValues.workingDays?.map((dayValue) => {
                    const day = DAYS_OF_WEEK.find((d) => d.value === dayValue);
                    return day ? (
                      <Badge
                        key={day.value}
                        variant="secondary"
                        className="text-xs"
                      >
                        {day.short}
                      </Badge>
                    ) : null;
                  })}
                  <Badge variant="outline" className="text-xs">
                    Every {watchedValues.repeatEveryWeeks || 1} week
                    {(watchedValues.repeatEveryWeeks || 1) > 1 ? "s" : ""}
                  </Badge>
                  {watchedValues.ends?.mode === "count" &&
                  watchedValues.ends?.count ? (
                    <Badge variant="outline" className="text-xs">{`After ${
                      watchedValues.ends.count
                    } occurrence${
                      watchedValues.ends.count > 1 ? "s" : ""
                    }`}</Badge>
                  ) : watchedValues.ends?.endDate ? (
                    <Badge variant="outline" className="text-xs">
                      Until {format(watchedValues.ends.endDate, "PPP")}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={createBulkSlots.isPending}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={createBulkSlots.isPending || previewCount === 0}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[140px]"
            >
              {createBulkSlots.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="size-4  border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                `Create ${previewCount} Slots`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
