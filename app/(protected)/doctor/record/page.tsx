import { MedicalRecordsPage } from "@/features/medical-records"

export default function DoctorRecordsPage() {
  // In a real app, get the doctor ID from authentication
  const doctorId = "doctor-1"

  return <MedicalRecordsPage doctorId={doctorId} showPatientControls={false} />
}
