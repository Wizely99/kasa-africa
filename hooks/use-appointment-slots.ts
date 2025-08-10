import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getDoctorAppointmentSlotsAction,
  getDoctorAllSlotsAction,
  createBulkSlotsAction,
  getPractitionerPricingAction,
  getExpertiseListAction,
  createPractitionerPricingAction,
  updatePractitionerPricingAction,
  deletePractitionerPricingAction,
} from "@/features/appointments/actions/appointment-actions"
import type { CreateSlotRequest, PractitionerPricingRequest } from "@/features/appointments/types/appointment"

// Appointment slots hooks
export function useDoctorAppointmentSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ["doctor-appointment-slots", doctorId, date],
    queryFn: () => getDoctorAppointmentSlotsAction(doctorId, date),
    enabled: !!doctorId && !!date,
  })
}

export function useDoctorAllSlots(doctorId: string) {
  return useQuery({
    queryKey: ["doctor-all-slots", doctorId],
    queryFn: () => getDoctorAllSlotsAction(doctorId),
    enabled: !!doctorId,
  })
}

export function useCreateBulkSlots() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slots: CreateSlotRequest[]) => createBulkSlotsAction(slots),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.data.message)
        queryClient.invalidateQueries({ queryKey: ["doctor-appointment-slots"] })
        queryClient.invalidateQueries({ queryKey: ["doctor-all-slots"] })
      } else {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error("Error creating bulk slots:", error)
      toast.error("Failed to create appointment slots")
    },
  })
}

// Practitioner pricing hooks
export function usePractitionerPricing(practitionerId: string) {
  return useQuery({
    queryKey: ["practitioner-pricing", practitionerId],
    queryFn: () => getPractitionerPricingAction(practitionerId),
    enabled: !!practitionerId,
  })
}

export function useExpertiseList() {
  return useQuery({
    queryKey: ["expertise-list"],
    queryFn: () => getExpertiseListAction(),
  })
}

export function useCreatePractitionerPricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pricingData: PractitionerPricingRequest) => 
      createPractitionerPricingAction(pricingData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: ["practitioner-pricing"] })
      } else {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error("Error creating practitioner pricing:", error)
      toast.error("Failed to create pricing")
    },
  })
}

export function useUpdatePractitionerPricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pricingId, pricingData }: { 
      pricingId: string
      pricingData: Partial<PractitionerPricingRequest> 
    }) => updatePractitionerPricingAction(pricingId, pricingData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: ["practitioner-pricing"] })
      } else {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error("Error updating practitioner pricing:", error)
      toast.error("Failed to update pricing")
    },
  })
}

export function useDeletePractitionerPricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pricingId: string) => deletePractitionerPricingAction(pricingId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: ["practitioner-pricing"] })
      } else {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error("Error deleting practitioner pricing:", error)
      toast.error("Failed to delete pricing")
    },
  })
}
