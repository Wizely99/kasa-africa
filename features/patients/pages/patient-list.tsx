"use client"

import { useState } from "react"
import { Search, Eye, Calendar, MessageSquare, Pill, MoreHorizontal, User, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSearchParams } from "next/navigation"
// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    age: 34,
    gender: "Female",
    bloodType: "A+",
    address: "123 Main St, New York, NY 10001",
    status: "Active",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-25",
    condition: "Hypertension",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    medicalHistory: [
      {
        date: "2024-01-15",
        diagnosis: "Hypertension",
        treatment: "Prescribed Lisinopril 10mg daily",
        doctor: "Dr. Smith",
      },
      {
        date: "2023-12-10",
        diagnosis: "Annual Checkup",
        treatment: "All vitals normal, continue current medications",
        doctor: "Dr. Smith",
      },
    ],
    prescriptions: [
      {
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
      },
    ],
    vitals: {
      bloodPressure: "140/90",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "165 lbs",
      height: "5'6\"",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    age: 42,
    gender: "Male",
    bloodType: "O-",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    status: "Active",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-02-01",
    condition: "Diabetes Type 2",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    medicalHistory: [
      {
        date: "2024-01-12",
        diagnosis: "Diabetes Type 2 - Follow up",
        treatment: "Adjusted Metformin dosage, dietary counseling",
        doctor: "Dr. Johnson",
      },
    ],
    prescriptions: [
      {
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2024-01-12",
        endDate: "2024-07-12",
      },
    ],
    vitals: {
      bloodPressure: "130/85",
      heartRate: "68 bpm",
      temperature: "98.4°F",
      weight: "180 lbs",
      height: "5'10\"",
    },
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    age: 28,
    gender: "Female",
    bloodType: "B+",
    address: "789 Pine St, Chicago, IL 60601",
    status: "Active",
    lastVisit: "2024-01-18",
    nextAppointment: null,
    condition: "Asthma",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
    medicalHistory: [
      {
        date: "2024-01-18",
        diagnosis: "Asthma - Routine checkup",
        treatment: "Inhaler refill, breathing exercises recommended",
        doctor: "Dr. Wilson",
      },
    ],
    prescriptions: [
      {
        medication: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        startDate: "2024-01-18",
        endDate: "2024-07-18",
      },
    ],
    vitals: {
      bloodPressure: "120/80",
      heartRate: "75 bpm",
      temperature: "98.2°F",
      weight: "140 lbs",
      height: "5'4\"",
    },
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "+1 (555) 456-7890",
    age: 55,
    gender: "Male",
    bloodType: "AB+",
    address: "321 Elm St, Houston, TX 77001",
    status: "Inactive",
    lastVisit: "2023-11-20",
    nextAppointment: null,
    condition: "Arthritis",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    medicalHistory: [
      {
        date: "2023-11-20",
        diagnosis: "Osteoarthritis",
        treatment: "Physical therapy recommended, pain management",
        doctor: "Dr. Brown",
      },
    ],
    prescriptions: [
      {
        medication: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        startDate: "2023-11-20",
        endDate: "2024-02-20",
      },
    ],
    vitals: {
      bloodPressure: "135/88",
      heartRate: "70 bpm",
      temperature: "98.8°F",
      weight: "190 lbs",
      height: "6'0\"",
    },
  },
]

export default function PatientList() {
  const searchParams = useSearchParams()
  const view = searchParams.get("view")
  const isDocView = view === "doctor"

  const [patients, setPatients] = useState(mockPatients)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showPatientDialog, setShowPatientDialog] = useState(false)

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const activePatients = patients.filter((p) => p.status === "Active").length
  const totalPatients = patients.length
  const upcomingAppointments = patients.filter((p) => p.nextAppointment).length

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setShowPatientDialog(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isDocView ? "My Patients" : "Patients"}</h1>
        <p className="text-muted-foreground">
          {isDocView ? "Manage your assigned patients" : "Manage all patients in the system"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">Currently under care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Search and filter patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patients Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.avatar || "/placeholder.svg"}
                          alt={patient.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{patient.age} years</div>
                        <div className="text-sm text-muted-foreground">{patient.gender}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pill className="mr-2 h-4 w-4" />
                            Add Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>Complete patient information and medical history</DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedPatient.avatar || "/placeholder.svg"}
                          alt={selectedPatient.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-lg">{selectedPatient.name}</div>
                          <div className="text-muted-foreground">Patient ID: {selectedPatient.id}</div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span>{selectedPatient.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gender:</span>
                          <span>{selectedPatient.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Type:</span>
                          <span>{selectedPatient.bloodType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={selectedPatient.status === "Active" ? "default" : "secondary"}>
                            {selectedPatient.status}
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
                        <span>{selectedPatient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span>{selectedPatient.address}</span>
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
                          {selectedPatient.condition}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">Last visit: {selectedPatient.lastVisit}</p>
                        {selectedPatient.nextAppointment && (
                          <p className="text-sm text-muted-foreground">
                            Next appointment: {selectedPatient.nextAppointment}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical History</CardTitle>
                    <CardDescription>Chronological record of medical visits and treatments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.map((record: any, index: number) => (
                        <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{record.diagnosis}</div>
                            <div className="text-sm text-muted-foreground">{record.date}</div>
                          </div>
                          <p className="text-sm mb-2">{record.treatment}</p>
                          <div className="text-xs text-muted-foreground">Treated by: {record.doctor}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Prescriptions</CardTitle>
                    <CardDescription>Active medications and dosages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPatient.prescriptions.map((prescription: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-lg">{prescription.medication}</div>
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
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
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
                          <span className="text-lg">{selectedPatient.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">Heart Rate</span>
                          <span className="text-lg">{selectedPatient.vitals.heartRate}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">Temperature</span>
                          <span className="text-lg">{selectedPatient.vitals.temperature}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">Weight</span>
                          <span className="text-lg">{selectedPatient.vitals.weight}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="font-medium">Height</span>
                          <span className="text-lg">{selectedPatient.vitals.height}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
