"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  MoreVertical,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Appointment, mockAppointments } from "../data/appointment-data";
import { TimeSlot } from "../types/appointment";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  );

  // Simulate API call
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppointments(mockAppointments);
      setIsLoading(false);
    };

    fetchAppointments();
  }, []);

  const formatTime = (timeSlot: TimeSlot) => {
    const hour = timeSlot.hour.toString().padStart(2, "0");
    const minute = timeSlot.minute.toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const statusConfig = {
      SCHEDULED: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-blue-600",
      },
      CONFIRMED: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      IN_PROGRESS: {
        variant: "default" as const,
        icon: AlertCircle,
        color: "text-orange-600",
      },
      COMPLETED: {
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      CANCELLED: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      NO_SHOW: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getAppointmentTypeIcon = (type: Appointment["appointmentType"]) => {
    switch (type) {
      case "IN_PERSON":
        return <MapPin className="h-4 w-4 text-blue-600" />;
      case "VIRTUAL":
        return <Video className="h-4 w-4 text-green-600" />;
      case "PHONE_CONSULTATION":
        return <Phone className="h-4 w-4 text-purple-600" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleAction = async (appointmentId: string, action: string) => {
    setActionLoading(appointmentId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (action === "cancel") {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: "CANCELLED" as const,
                cancellationReason: "Cancelled by patient",
              }
            : apt
        )
      );
    }

    setActionLoading(null);
    setCancelDialogOpen(false);
    setAppointmentToCancel(null);
  };

  const filterAppointments = (filter: "upcoming" | "past" | "all") => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);

      switch (filter) {
        case "upcoming":
          return (
            aptDate >= now &&
            !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(apt.status)
          );
        case "past":
          return (
            aptDate < now ||
            ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(apt.status)
          );
        case "all":
        default:
          return true;
      }
    });
  };

  const upcomingCount = filterAppointments("upcoming").length;
  const pastCount = filterAppointments("past").length;
  const allCount = appointments.length;

  const renderAppointmentCard = (appointment: Appointment) => (
    // <LoadingOverlay key={appointment.id} isLoading={actionLoading === appointment.id} message="Processing...">
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={appointment.doctorAvatar || "/placeholder.svg"}
                alt={appointment.doctorName}
              />
              <AvatarFallback>
                {appointment.doctorName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {appointment.doctorName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {appointment.doctorSpecialization}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(appointment.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {appointment.status === "SCHEDULED" && (
                  <>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setAppointmentToCancel(appointment.id);
                        setCancelDialogOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.endTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getAppointmentTypeIcon(appointment.appointmentType)}
            <span className="text-sm">
              {appointment.appointmentType.replace("_", " ")}
              {appointment.facilityName && ` at ${appointment.facilityName}`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="mb-2">
            <span className="text-sm font-medium">Chief Complaint:</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {appointment.chiefComplaint}
          </p>
          {appointment.notes && (
            <p className="text-sm text-muted-foreground mt-1">
              {appointment.notes}
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Confirmation: {appointment.confirmationCode}
          </div>
          {appointment.appointmentType === "VIRTUAL" &&
            appointment.status === "CONFIRMED" && (
              <Button size="sm" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
    // </LoadingOverlay>
  );

  const renderEmptyState = (type: string) => (
    <Card className="text-center py-12">
      <CardContent>
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No {type} appointments</h3>
        <p className="text-muted-foreground mb-4">
          {type === "upcoming"
            ? "You don't have any upcoming appointments scheduled."
            : type === "past"
            ? "You don't have any past appointments."
            : "You haven't scheduled any appointments yet."}
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Book New Appointment
        </Button>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your healthcare appointments
            </p>
          </div>
        </div>
        {/* <LoadingSkeleton variant="appointment" count={3} /> */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">
            Manage your healthcare appointments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            Upcoming
            {upcomingCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {upcomingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            Past
            {pastCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pastCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            {allCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {allCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterAppointments("upcoming").length > 0
            ? filterAppointments("upcoming").map(renderAppointmentCard)
            : renderEmptyState("upcoming")}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filterAppointments("past").length > 0
            ? filterAppointments("past").map(renderAppointmentCard)
            : renderEmptyState("past")}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {appointments.length > 0
            ? appointments.map(renderAppointmentCard)
            : renderEmptyState("all")}
        </TabsContent>
      </Tabs>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                appointmentToCancel &&
                handleAction(appointmentToCancel, "cancel")
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
