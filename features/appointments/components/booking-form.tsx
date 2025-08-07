"use client";
import React from "react";

import { useState } from "react";
import { Search, Star, Clock, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const BookingForm = ({ doctor }: { doctor: any }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    "All Specializations"
  );
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const handleBookAppointment = () => {
    console.log("Booking appointment:", {
      doctor: selectedDoctor,
      ...appointmentData,
    });
    // Here you would typically call an API to book the appointment
    alert("Appointment booked successfully!");
    setSelectedDoctor(null);
    setAppointmentData({ date: "", time: "", type: "", notes: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!doctor.isAvailable}
          onClick={() => setSelectedDoctor(doctor)}
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[700px] max-w-none">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule your appointment
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <img
              src={doctor.avatar || "/placeholder.svg"}
              alt={doctor.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-semibold">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {doctor.specialization}
              </p>
              <p className="text-sm font-medium">${doctor.consultationFee}</p>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  value={appointmentData.time}
                  onValueChange={(value) =>
                    setAppointmentData((prev) => ({ ...prev, time: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={appointmentData.type}
                onValueChange={(value) =>
                  setAppointmentData((prev) => ({ ...prev, type: value }))
                }
              >
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

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Describe your symptoms or reason for visit..."
                value={appointmentData.notes}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>Confirm Booking</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
