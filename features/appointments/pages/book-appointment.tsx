"use client"

import { useState } from "react"
import { DoctorSearch } from "@/features/appointments/components/doctor-search"
import { AppointmentBookingForm } from "@/features/appointments/components/appointment-booking-form"
import { AppointmentConfirmation } from "@/features/appointments/components/appointment-confirmation"
import type { Doctor, Appointment } from "@/features/appointments/types/appointment"

export default function BookAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null)
  const [currentStep, setCurrentStep] = useState<"search" | "booking" | "confirmation">("search")

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setCurrentStep("booking")
  }

  const handleBookingSuccess = (appointment: Appointment) => {
    setBookedAppointment(appointment)
    setCurrentStep("confirmation")
  }

  const handleBackToSearch = () => {
    setSelectedDoctor(null)
    setCurrentStep("search")
  }

  const handleBookAnother = () => {
    setSelectedDoctor(null)
    setBookedAppointment(null)
    setCurrentStep("search")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-muted-foreground">Find and book appointments with available doctors</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "search"
                ? "bg-primary text-primary-foreground"
                : currentStep === "booking" || currentStep === "confirmation"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium">Select Doctor</span>
        </div>
        <div
          className={`w-16 h-0.5 ${currentStep === "booking" || currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`}
        />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "booking"
                ? "bg-primary text-primary-foreground"
                : currentStep === "confirmation"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium">Book Appointment</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep === "confirmation" ? "bg-primary" : "bg-muted"}`} />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <span className="ml-2 text-sm font-medium">Confirmation</span>
        </div>
      </div>

      {currentStep === "search" && <DoctorSearch onSelectDoctor={handleDoctorSelect} />}

      {currentStep === "booking" && selectedDoctor && (
        <AppointmentBookingForm
          doctor={selectedDoctor}
          onSuccess={handleBookingSuccess}
          onCancel={handleBackToSearch}
        />
      )}

      {currentStep === "confirmation" && bookedAppointment && selectedDoctor && (
        <AppointmentConfirmation
          appointment={bookedAppointment}
          doctor={selectedDoctor}
          onBookAnother={handleBookAnother}
        />
      )}
    </div>
  )
}
