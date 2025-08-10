import SchedulesPage from "@/features/appointments/pages/schedules"

export default function DoctorSchedulePage() {
// In a real app, you'd get the doctor ID from authentication
const doctorId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
return <SchedulesPage doctorId={doctorId} />
}
