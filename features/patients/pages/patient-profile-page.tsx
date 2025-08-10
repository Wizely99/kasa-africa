"use client"

import { useEffect, useState } from "react"
import type { PatientProfile } from "../types/patient-profile"
import { PatientProfileForm } from "../components/patient-profile-form"
import { getPatientProfile } from "../actions/patient-profile-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientProfilePageProps {
  userProfileId?: string
  mode?: "create" | "edit"
}

export function PatientProfilePage({
  userProfileId = "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  mode = "edit",
}: PatientProfilePageProps) {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (mode === "create") {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await getPatientProfile(userProfileId)
        setProfile(data)
      } catch (err) {
        setError("Failed to load patient profile")
        console.error("Error fetching patient profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userProfileId, mode])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{mode === "create" ? "Create Patient Profile" : "Patient Profile"}</h1>
        <p className="text-muted-foreground mt-2">
          {mode === "create"
            ? "Complete your patient profile to get started with healthcare services."
            : "Manage your personal and medical information."}
        </p>
      </div>

      <PatientProfileForm initialData={profile} mode={mode} />
    </div>
  )
}
