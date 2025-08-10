"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { User, AlertCircle } from "lucide-react"
import { DoctorProfileForm } from "../components/doctor-profile-form"
import { getDoctorProfileAction } from "../actions/doctor-actions"
import type { DoctorProfile } from "../types/doctor"

interface DoctorProfilePageProps {
  doctorId: string
}

export function DoctorProfilePage({ doctorId }: DoctorProfilePageProps) {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const result = await getDoctorProfileAction(doctorId)

        if (result.success) {
          setDoctorProfile(result.data)
        } else {
          setError(result.error || "Failed to load profile")
          toast.error(result.error || "Failed to load profile")
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error)
        setError("An unexpected error occurred")
        toast.error("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [doctorId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Profile
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Doctor Profile</h1>
          <p className="text-muted-foreground">Manage your professional information and settings</p>
        </div>
      </div>

      <DoctorProfileForm doctorProfile={doctorProfile || undefined} doctorId={doctorId} />
    </div>
  )
}
