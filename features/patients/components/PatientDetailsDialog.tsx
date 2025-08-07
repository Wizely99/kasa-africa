import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient } from "./types";
import { PatientOverviewTab } from "./PatientOverviewTab";
import { PatientHistoryTab } from "./PatientHistoryTab";
import { PatientPrescriptionsTab } from "./PatientPrescriptionsTab";
import { PatientVitalsTab } from "./PatientVitalsTab";

interface PatientDetailsDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailsDialog({
  patient,
  open,
  onOpenChange,
}: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete patient information and medical history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PatientOverviewTab patient={patient} />
          </TabsContent>

          <TabsContent value="history">
            <PatientHistoryTab medicalHistory={patient.medicalHistory} />
          </TabsContent>

          <TabsContent value="prescriptions">
            <PatientPrescriptionsTab prescriptions={patient.prescriptions} />
          </TabsContent>

          <TabsContent value="vitals">
            <PatientVitalsTab vitals={patient.vitals} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
