import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import { Patient } from "./types";

interface PatientOverviewTabProps {
  patient: Patient;
}

export function PatientOverviewTab({ patient }: PatientOverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={patient.avatar || "/placeholder.svg"}
                alt={patient.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-lg">{patient.name}</div>
                <div className="text-muted-foreground">
                  Patient ID: {patient.id}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span>{patient.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span>{patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blood Type:</span>
                <span>{patient.bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    patient.status === "Active" ? "default" : "secondary"
                  }
                >
                  {patient.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <span>{patient.address}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {patient.condition}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Last visit: {patient.lastVisit}
              </p>
              {patient.nextAppointment && (
                <p className="text-sm text-muted-foreground">
                  Next appointment: {patient.nextAppointment}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
