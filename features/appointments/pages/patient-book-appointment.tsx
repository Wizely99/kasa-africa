"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, DollarSign, MapPin, Search, Star } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "../components/booking-form";
import { SearchInput } from "@/components/common/SearchInput";

// Mock doctors data
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Emily Carter",
    specialization: "Dermatology",
    experience: 8,
    rating: 4.8,
    consultationFee: 150,
    location: "Downtown Medical Center",
    avatar: "/placeholder.svg?height=100&width=100&text=EC",
    isAvailable: true,
    nextAvailable: "Today 2:30 PM",
    about:
      "Specialized in skin disorders, acne treatment, and cosmetic dermatology with 8+ years of experience.",
    education: "MD from Harvard Medical School",
    languages: ["English", "Spanish"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.9,
    consultationFee: 200,
    location: "Heart Care Clinic",
    avatar: "/placeholder.svg?height=100&width=100&text=MC",
    isAvailable: true,
    nextAvailable: "Tomorrow 10:00 AM",
    about:
      "Expert in cardiovascular diseases, heart surgery, and preventive cardiology.",
    education: "MD from Johns Hopkins University",
    languages: ["English", "Mandarin"],
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    specialization: "Pediatrics",
    experience: 10,
    rating: 4.7,
    consultationFee: 120,
    location: "Children's Health Center",
    avatar: "/placeholder.svg?height=100&width=100&text=SJ",
    isAvailable: false,
    nextAvailable: "Jan 20, 9:00 AM",
    about:
      "Dedicated pediatrician focusing on child development and family healthcare.",
    education: "MD from Stanford University",
    languages: ["English", "French"],
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    experience: 15,
    rating: 4.6,
    consultationFee: 180,
    location: "Bone & Joint Institute",
    avatar: "/placeholder.svg?height=100&width=100&text=JW",
    isAvailable: true,
    nextAvailable: "Today 4:00 PM",
    about:
      "Orthopedic surgeon specializing in sports injuries and joint replacement.",
    education: "MD from Mayo Clinic",
    languages: ["English"],
  },
  {
    id: "5",
    name: "Dr. Lisa Rodriguez",
    specialization: "Neurology",
    experience: 9,
    rating: 4.8,
    consultationFee: 220,
    location: "Neuro Care Center",
    avatar: "/placeholder.svg?height=100&width=100&text=LR",
    isAvailable: true,
    nextAvailable: "Tomorrow 2:00 PM",
    about:
      "Neurologist with expertise in brain disorders, epilepsy, and migraine treatment.",
    education: "MD from UCLA Medical School",
    languages: ["English", "Spanish"],
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    specialization: "General Medicine",
    experience: 6,
    rating: 4.5,
    consultationFee: 100,
    location: "Family Health Clinic",
    avatar: "/placeholder.svg?height=100&width=100&text=RK",
    isAvailable: true,
    nextAvailable: "Today 11:30 AM",
    about:
      "General practitioner providing comprehensive primary care for all ages.",
    education: "MD from University of Washington",
    languages: ["English", "Korean"],
  },
];

const specializations = [
  "All Specializations",
  "Cardiology",
  "Dermatology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
];

export default function PatientBookAppointment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    "All Specializations"
  );
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    type: "",
    notes: "",
  });

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "All Specializations" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-muted-foreground">
          Find and book appointments with available doctors
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 justify-center items-center">
        <div className="flex-1 relative ">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or specialization..."
          />
        </div>

        <Select
          value={selectedSpecialization}
          onValueChange={setSelectedSpecialization}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctors List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.avatar || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialization}</CardDescription>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({doctor.experience} years exp.)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${doctor.consultationFee} consultation fee</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Next available: {doctor.nextAvailable}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={doctor.isAvailable ? "default" : "secondary"}>
                  {doctor.isAvailable ? "Available" : "Busy"}
                </Badge>

                  <BookingForm doctor={doctor} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No doctors found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
