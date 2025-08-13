import { MedicalRecordsPage } from "@/features/medical-records";

export default function PatientRecordsPage() {
  // In a real app, get the patient ID from authentication
  const patientId = "patient-1";

  return (
    <MedicalRecordsPage patientId={patientId} showPatientControls={true} />
  );
}
