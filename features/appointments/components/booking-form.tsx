"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock doctor data for demo
const mockDoctor = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialization: "Cardiologist",
  consultationFee: 150,
  isAvailable: true,
  avatar: "/placeholder.svg"
};

export const BookingForm = ({ doctor = mockDoctor }: { doctor?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Mock available slots for different dates
  const availableSlots = {
    "2025-08-11": ["09:00", "10:00", "14:00", "15:00"],
    "2025-08-12": ["09:00", "11:00", "16:00"],
    "2025-08-13": ["10:00", "14:00", "15:00", "16:00"],
    "2025-08-14": ["09:00", "10:00", "11:00"],
    "2025-08-15": ["14:00", "15:00"],
    "2025-08-18": ["09:00", "10:00", "14:00", "15:00", "16:00"],
    "2025-08-19": ["09:00", "11:00", "15:00"],
    "2025-08-20": ["10:00", "14:00", "16:00"],
    "2025-08-21": ["09:00", "10:00", "15:00", "16:00"],
    "2025-08-22": ["11:00", "14:00", "15:00"],
  };

  const timeLabels = {
    "09:00": "9:00 AM",
    "10:00": "10:00 AM", 
    "11:00": "11:00 AM",
    "14:00": "2:00 PM",
    "15:00": "3:00 PM",
    "16:00": "4:00 PM"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select a time";
    if (!appointmentType) newErrors.type = "Please select appointment type";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log("Booking appointment:", {
        doctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        notes,
      });
      alert("Appointment booked successfully!");
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDate("");
    setSelectedTime("");
    setAppointmentType("");
    setNotes("");
    setErrors({});
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today && availableSlots[dateStr]?.length > 0;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(""); // Reset time when date changes
    if (errors.date) {
      setErrors(prev => ({...prev, date: ""}));
    }
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const selectedSlots = selectedDate ? availableSlots[selectedDate] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!doctor.isAvailable}
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Select a date and time slot for your appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {doctor.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-semibold">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {doctor.specialization}
              </p>
              <p className="text-sm font-medium">${doctor.consultationFee}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Select Date</Label>
                  {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                      {monthYear}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="p-2" />;
                    }

                    const dateStr = formatDate(date);
                    const isAvailable = isDateAvailable(date);
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === formatDate(new Date());

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          if (isAvailable) {
                            handleDateSelect(dateStr);
                          }
                        }}
                        className={`
                          p-2 text-sm rounded-md transition-colors relative
                          ${isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : isAvailable 
                              ? 'hover:bg-muted cursor-pointer' 
                              : 'text-muted-foreground cursor-not-allowed'
                          }
                          ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                        `}
                        disabled={!isAvailable}
                      >
                        {date.getDate()}
                        {isAvailable && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots & Form Fields */}
              <div className="space-y-6">
                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Available Times
                      </Label>
                      {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            if (errors.time) {
                              setErrors(prev => ({...prev, time: ""}));
                            }
                          }}
                          className={`
                            p-3 text-sm rounded-md border transition-colors
                            ${selectedTime === time
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'hover:bg-muted border-border'
                            }
                          `}
                        >
                          {timeLabels[time]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointment Type */}
                {selectedTime && (
                  <div>
                    <div className="space-y-2">
                      <Label>Appointment Type</Label>
                      {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                    </div>
                    
                    <Select value={appointmentType} onValueChange={(value) => {
                      setAppointmentType(value);
                      if (errors.type) {
                        setErrors(prev => ({...prev, type: ""}));
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="check-up">General Check-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Notes */}
                {appointmentType && (
                  <div>
                    <Label>Additional Notes (Optional)</Label>
                    <Textarea
                      placeholder="Describe your symptoms or reason for visit..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Summary */}
            {selectedDate && selectedTime && appointmentType && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{timeLabels[selectedTime]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{appointmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee:</span>
                      <span className="font-medium">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};