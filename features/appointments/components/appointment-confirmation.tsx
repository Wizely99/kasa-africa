"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
  Share,
  User,
} from "lucide-react";
import type { Appointment, Doctor } from "../types/appointment";

interface AppointmentConfirmationProps {
  appointment: Appointment;
  doctor: Doctor;
  onBookAnother: () => void;
}

export function AppointmentConfirmation({
  appointment,
  doctor,
  onBookAnother,
}: AppointmentConfirmationProps) {
  const appointmentDate = new Date(`${appointment?.date}T${appointment?.time}`);

  const handleDownloadConfirmation = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading appointment confirmation...");
  };

  const handleShareAppointment = () => {
    // In a real app, this would open share options
    console.log("Sharing appointment details...");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-green-700 dark:text-green-300">
            Your appointment has been successfully booked. You will receive a
            confirmation email shortly.
          </p>
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Details
          </CardTitle>
          <CardDescription>Confirmation ID: {appointment.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor Information */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={doctor.avatar || "/placeholder.svg"}
                alt={doctor.name}
              />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-primary font-medium">
                {doctor.specialization}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{doctor.email}</span>
                </div>
              </div>
            </div>
            <Badge variant="default">Confirmed</Badge>
          </div>

          <Separator />

          {/* Appointment Schedule */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Date & Time
              </div>
              <div className="pl-6">
                <p className="font-semibold">
                  {format(appointmentDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-muted-foreground">
                  {format(appointmentDate, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Appointment Type
              </div>
              <div className="pl-6">
                <p className="font-semibold capitalize">{appointment.type}</p>
                <p className="text-muted-foreground">Duration: 30 minutes</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <div className="pl-6">
              <p className="font-semibold">
                {doctor.location || "Medical Center"}
              </p>
              <p className="text-muted-foreground">
                123 Healthcare Ave, Medical District
              </p>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Notes
              </div>
              <div className="pl-6">
                <p className="text-muted-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">Payment Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Consultation Fee:</span>
                <span>${appointment.fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>$5</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Paid:</span>
                <span>${appointment.fee + 5}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Reminders */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Reminders:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Please arrive 10 minutes before your scheduled time</li>
            <li>• Bring a valid photo ID and insurance card</li>
            <li>• You can reschedule or cancel up to 24 hours in advance</li>
            <li>
              • A confirmation email has been sent to your registered email
              address
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={handleDownloadConfirmation}
          className="flex-1 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Confirmation
        </Button>
        <Button
          variant="outline"
          onClick={handleShareAppointment}
          className="flex-1 bg-transparent"
        >
          <Share className="h-4 w-4 mr-2" />
          Share Details
        </Button>
        <Button onClick={onBookAnother} className="flex-1">
          Book Another Appointment
        </Button>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="size-6  bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">1</span>
            </div>
            <div>
              <p className="font-medium">Check your email</p>
              <p className="text-muted-foreground">
                We've sent a detailed confirmation with all appointment
                information.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-6  bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">2</span>
            </div>
            <div>
              <p className="font-medium">Prepare for your visit</p>
              <p className="text-muted-foreground">
                Gather any relevant medical records, insurance information, and
                list of current medications.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-6  bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">3</span>
            </div>
            <div>
              <p className="font-medium">Arrive on time</p>
              <p className="text-muted-foreground">
                Please arrive 10 minutes early to complete any necessary
                paperwork.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
