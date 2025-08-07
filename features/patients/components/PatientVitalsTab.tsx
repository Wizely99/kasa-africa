import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { VitalSigns } from "./types";

interface PatientVitalsTabProps {
  vitals: VitalSigns;
}

export function PatientVitalsTab({ vitals }: PatientVitalsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
        <CardDescription>Most recent measurements and readings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">Blood Pressure</span>
              <span className="text-lg">{vitals.bloodPressure}</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">Heart Rate</span>
              <span className="text-lg">{vitals.heartRate}</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">Temperature</span>
              <span className="text-lg">{vitals.temperature}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">Weight</span>
              <span className="text-lg">{vitals.weight}</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">Height</span>
              <span className="text-lg">{vitals.height}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
