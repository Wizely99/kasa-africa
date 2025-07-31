import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PatientProfile() {
  // Placeholder data for patient and doctor details
  const patient = {
    name: "Jane Doe",
    dob: "1990-05-15",
    gender: "Female",
    contact: "jane.doe@example.com | (555) 123-4567",
    address: "123 Health St, Wellness City, CA 90210",
    bloodType: "A+",
    allergies: "Penicillin, Peanuts",
    medicalConditions: "Type 2 Diabetes, Hypertension",
  }

  const doctor = {
    name: "Dr. John Smith",
    specialty: "General Practitioner",
    contact: "john.smith@clinic.com | (555) 987-6543",
    clinic: "City Health Clinic",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold">Patient Profile</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Patient Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="text-lg font-semibold">{patient.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p>{patient.dob}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                <p>{patient.gender}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
              <p>{patient.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
              <p>{patient.address}</p>
            </div>
            <Separator className="my-2" />
            <h3 className="text-lg font-semibold">Medical Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Type</p>
                <p>{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergies</p>
                <p>{patient.allergies}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Medical Conditions</p>
              <p>{patient.medicalConditions}</p>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Doctor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xl font-bold">{doctor.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
            </div>
            <Separator className="my-2 w-full" />
            <div className="grid w-full gap-2 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
                <p>{doctor.contact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clinic</p>
                <p>{doctor.clinic}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
