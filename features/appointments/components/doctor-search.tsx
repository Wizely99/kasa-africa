"use client"

import { useState, useEffect } from "react"
import { Search, Star, Clock, DollarSign, MapPin, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { Doctor } from "../types/appointment"
// import { getAllDoctorsAction } from "../actions/appointment-actions"

interface DoctorSearchProps {
  onSelectDoctor: (doctor: Doctor) => void
}
async function getAllDoctorsAction(){
  return [];
}
export function DoctorSearch({ onSelectDoctor }: DoctorSearchProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [specialization, setSpecialization] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const specializations = [
    { value: "all", label: "All Specializations" },
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "oncology", label: "Oncology" },
    { value: "gynecology", label: "Gynecology" },
  ]

  // Load all doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true)
      try {
        const result = await getAllDoctorsAction()
        if (result.success) {
          setDoctors(result.data)
          setFilteredDoctors(result.data)
        }
      } catch (error) {
        console.error("Failed to load doctors:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDoctors()
  }, [])

  // Filter and sort doctors
  useEffect(() => {
    let filtered = [...doctors]

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
          doctor.bio?.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by specialization
    if (specialization !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialization.toLowerCase() === specialization.toLowerCase())
    }

    // Filter by availability
    if (availabilityFilter === "available") {
      filtered = filtered.filter((doctor) => doctor.isAvailable)
    } else if (availabilityFilter === "busy") {
      filtered = filtered.filter((doctor) => !doctor.isAvailable)
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.experience - a.experience
        case "fee":
          return a.consultationFee - b.consultationFee
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredDoctors(filtered)
  }, [doctors, query, specialization, sortBy, availabilityFilter])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Find Your Doctor
          </CardTitle>
          <CardDescription>Browse our network of {doctors.length} qualified healthcare professionals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor name, specialization, or keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="fee">Lowest Fee</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </span>
            <div className="flex items-center gap-4">
              <span>{filteredDoctors.filter((d) => d.isAvailable).length} available now</span>
              <span>
                Avg. rating:{" "}
                {(filteredDoctors.reduce((acc, d) => acc + d.rating, 0) / filteredDoctors.length || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-background">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
                          doctor.isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight">{doctor.name}</h3>
                      <p className="text-primary font-medium">{doctor.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{doctor.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Bio */}
                  {doctor.bio && <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>}

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{doctor.experience}y exp</span>
                    </div>
                  </div>

                  {/* Languages */}
                  {doctor.languages && doctor.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                      {doctor.languages.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doctor.languages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Pricing and Availability */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">${doctor.consultationFee}</span>
                      <span className="text-sm text-muted-foreground">consultation</span>
                    </div>
                    <Badge
                      variant={doctor.isAvailable ? "default" : "secondary"}
                      className={doctor.isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {doctor.isAvailable ? "Available Today" : "Busy"}
                    </Badge>
                  </div>

                  {/* Next Available */}
                  {doctor.nextAvailable && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Next available: {doctor.nextAvailable}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => onSelectDoctor(doctor)}
                    disabled={!doctor.isAvailable}
                    variant={doctor.isAvailable ? "default" : "secondary"}
                  >
                    {doctor.isAvailable ? "Book Appointment" : "View Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available doctors.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                setSpecialization("all")
                setAvailabilityFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
