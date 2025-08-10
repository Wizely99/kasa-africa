"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Building2, Clock, Calendar, Plus, Edit, Trash2, MapPin, Phone, Mail } from "lucide-react"
import { toast } from "sonner"
import { FacilityAvailabilityForm } from "../components/facility-availability-form"
import {
  getFacilities,
  getFacilityAvailability,
  deleteFacilityAvailability,
} from "../actions/facility-availability-actions"
import type { Facility, FacilityAvailability, DayOfWeek } from "../types/facility-availability"

export default function FacilityAvailabilityPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [availabilities, setAvailabilities] = useState<FacilityAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<FacilityAvailability | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [facilitiesData, availabilitiesData] = await Promise.all([getFacilities(), getFacilityAvailability()])
      setFacilities(facilitiesData)
      setAvailabilities(availabilitiesData)
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    loadData()
  }

  const handleEditSuccess = () => {
    setEditingAvailability(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await deleteFacilityAvailability(id)
      if (result.success) {
        toast.success("Facility availability deleted successfully")
        loadData()
      } else {
        toast.error(result.error || "Failed to delete facility availability")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  const getDayLabel = (day: DayOfWeek) => {
    const dayLabels: Record<DayOfWeek, string> = {
      MONDAY: "Mon",
      TUESDAY: "Tue",
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun",
    }
    return dayLabels[day]
  }

  const getFacilityName = (facilityId: string) => {
    return facilities.find((f) => f.id === facilityId)?.name || "Unknown Facility"
  }

  const getFacility = (facilityId: string) => {
    return facilities.find((f) => f.id === facilityId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Facility Availability</h1>
            <p className="text-muted-foreground">Manage operating hours for your facilities</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facility Availability</h1>
          <p className="text-muted-foreground">Manage operating hours for your facilities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Facility Availability</DialogTitle>
            </DialogHeader>
            <FacilityAvailabilityForm
              facilities={facilities}
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availabilities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24/7 Facilities</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                availabilities.filter((a) => a.days.length === 7 && a.startTime.hour === 0 && a.endTime.hour === 23)
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability List */}
      <div className="space-y-4">
        {availabilities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No availability schedules</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by adding operating hours for your facilities
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Facility Availability</DialogTitle>
                  </DialogHeader>
                  <FacilityAvailabilityForm
                    facilities={facilities}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          availabilities.map((availability) => {
            const facility = getFacility(availability.facilityId)
            return (
              <Card key={availability.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {getFacilityName(availability.facilityId)}
                      </CardTitle>
                      {facility && (
                        <CardDescription className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3" />
                            {facility.address}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {facility.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {facility.email}
                            </div>
                          </div>
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingAvailability?.id === availability.id}
                        onOpenChange={(open) => setEditingAvailability(open ? availability : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Facility Availability</DialogTitle>
                          </DialogHeader>
                          <FacilityAvailabilityForm
                            facilities={facilities}
                            existingAvailability={availability}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setEditingAvailability(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Availability Schedule</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this availability schedule? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(availability.id)}
                              disabled={deletingId === availability.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === availability.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Days */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Operating Days
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {availability.days.map((day) => (
                          <Badge key={day} variant="secondary">
                            {getDayLabel(day)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Operating Hours
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(availability.startTime.hour, availability.startTime.minute)} -{" "}
                        {formatTime(availability.endTime.hour, availability.endTime.minute)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
