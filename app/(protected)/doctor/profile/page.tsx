import { DoctorProfilePage } from "@/features/doctors/pages/doctor-profile"

export default function DoctorProfile() {
  // In production, get the actual doctor ID from authentication
  const doctorId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"

  return <DoctorProfilePage doctorId={doctorId} />
}
