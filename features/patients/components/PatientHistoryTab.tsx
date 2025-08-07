import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MedicalRecord } from "./types";

interface PatientHistoryTabProps {
  medicalHistory: MedicalRecord[];
}

export function PatientHistoryTab({ medicalHistory }: PatientHistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medical History</CardTitle>
        <CardDescription>
          Chronological record of medical visits and treatments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalHistory.map((record, index) => (
            <div key={index} className="border-l-2 border-primary pl-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{record.diagnosis}</div>
                <div className="text-sm text-muted-foreground">
                  {record.date}
                </div>
              </div>
              <p className="text-sm mb-2">{record.treatment}</p>
              <div className="text-xs text-muted-foreground">
                Treated by: {record.doctor}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
