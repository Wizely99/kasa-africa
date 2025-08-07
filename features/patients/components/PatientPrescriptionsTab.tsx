import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prescription } from "../types/patient";

interface PatientPrescriptionsTabProps {
  prescriptions: Prescription[];
}

export function PatientPrescriptionsTab({
  prescriptions,
}: PatientPrescriptionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Prescriptions</CardTitle>
        <CardDescription>Active medications and dosages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-lg">
                  {prescription.medication}
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dosage:</span>
                  <span>{prescription.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span>{prescription.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{prescription.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{prescription.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
