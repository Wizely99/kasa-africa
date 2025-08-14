// "use client"

// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Clock, AlertCircle, CalendarIcon, FileText, CreditCard, MapPin, Video, Phone } from "lucide-react"
// import { format } from "date-fns"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Separator } from "@/components/ui/separator"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { bookAppointmentSchema, type BookAppointmentFormData } from "../schemas/appointment-schemas"
// import { getDoctorSlotsAction, bookAppointmentAction, getFacilitiesAction } from "../actions/appointment-actions"
// import type { Doctor, Facility } from "../types/appointment"
// import { cn } from "@/lib/utils"

// interface AppointmentBookingFormProps {
//   doctor: Doctor
//   onSuccess: (appointment: any) => void
//   onCancel: () => void
// }

// interface TimeSlot {
//   id: string
//   doctorId: string
//   date: string
//   time: string
//   duration: number
//   isAvailable: boolean
//   price: number
// }

// export function AppointmentBookingForm({ doctor, onSuccess, onCancel }: AppointmentBookingFormProps) {
//   const [selectedDate, setSelectedDate] = useState<Date>()
//   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
//   const [facilities, setFacilities] = useState<Facility[]>([])
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState<string>("")

//   const form = useForm<BookAppointmentFormData>({
//     resolver: zodResolver(bookAppointmentSchema),
//     defaultValues: {
//       doctorId: doctor.id,
//       patientId: "patient-1", // Replace with actual patient ID
//       appointmentType: "IN_PERSON",
//       status: "SCHEDULED",
//     },
//   })

//   // Load facilities on component mount
//   useEffect(() => {
//     const loadFacilities = async () => {
//       const result = await getFacilitiesAction()
//       if (result.success) {
//         setFacilities(result.data ?? [])
//         // Set default facility if only one available
//         if (result.data?.length === 1) {
//           form.setValue("facilityId", result.data[0]?.id)
//         }
//       }
//     }
//     loadFacilities()
//   }, [form])

//   const handleDateSelect = async (date: Date | undefined) => {
//     if (!date) return

//     setSelectedDate(date)
//     setLoading(true)
//     setError("")

//     try {
//       const dateString = date.toISOString().split("T")[0]
//       const result = await getDoctorSlotsAction(doctor.id, dateString)
//       if (result.success) {
//         setAvailableSlots(result.data)
//       } else {
//         setError("Failed to load available slots")
//       }
//     } catch (error) {
//       console.error("Failed to load slots:", error)
//       setError("Failed to load available slots")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const parseTimeSlot = (timeString: string) => {
//     const [hour, minute] = timeString.split(":").map(Number)
//     return { hour, minute, second: 0, nano: 0 }
//   }

//   const onSubmit = async (data: BookAppointmentFormData) => {
//     setSubmitting(true)
//     setError("")

//     try {
//       // Find selected slot to get time information
//       const selectedSlot = availableSlots.find((slot) => slot.id === data.slotId)
//       if (!selectedSlot) {
//         setError("Please select a time slot")
//         return
//       }

//       const startTime = parseTimeSlot(selectedSlot.time)
//       const endTime = {
//         hour: startTime.hour,
//         minute: startTime.minute + selectedSlot.duration,
//         second: 0,
//         nano: 0,
//       }

//       // Handle minute overflow
//       if (endTime.minute >= 60) {
//         endTime.hour += Math.floor(endTime.minute / 60)
//         endTime.minute = endTime.minute % 60
//       }

//       const appointmentData = {
//         patientId: data.patientId,
//         doctorId: data.doctorId,
//         facilityId: data.facilityId,
//         appointmentDate: data.appointmentDate,
//         startTime,
//         endTime,
//         appointmentType: data.appointmentType,
//         status: data.status,
//         chiefComplaint: data.chiefComplaint,
//         notes: data.notes,
//       }

//       const result = await bookAppointmentAction(appointmentData)

//       if (result.success) {
//         onSuccess(result.data)
//       } else {
//         setError(result.error || "Failed to book appointment")
//       }
//     } catch (error) {
//       console.error("Booking failed:", error)
//       setError("Failed to book appointment. Please try again.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const selectedSlot = availableSlots.find((slot) => slot.id === form.watch("slotId"))
//   const selectedFacility = facilities.find((facility) => facility.id === form.watch("facilityId"))
//   const appointmentType = form.watch("appointmentType")

//   const getAppointmentTypeIcon = (type: string) => {
//     switch (type) {
//       case "IN_PERSON":
//         return <MapPin className="h-4 w-4" />
//       case "VIRTUAL":
//         return <Video className="h-4 w-4" />
//       case "PHONE_CONSULTATION":
//         return <Phone className="h-4 w-4" />
//       default:
//         return <MapPin className="h-4 w-4" />
//     }
//   }

//   const getAppointmentTypeLabel = (type: string) => {
//     switch (type) {
//       case "IN_PERSON":
//         return "In-Person Visit"
//       case "VIRTUAL":
//         return "Virtual Consultation"
//       case "PHONE_CONSULTATION":
//         return "Phone Consultation"
//       default:
//         return "In-Person Visit"
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Doctor Summary Card */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
//               <AvatarFallback>
//                 {doctor.name
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{doctor.name}</h2>
//               <p className="text-primary font-medium">{doctor.specialization}</p>
//               <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
//                 <span>{doctor.experience} years experience</span>
//                 <span>•</span>
//                 <span>Rating: {doctor.rating}/5</span>
//                 <span>•</span>
//                 <span className="font-medium text-foreground">${doctor.consultationFee} consultation</span>
//               </div>
//             </div>
//             <Badge variant={doctor.isAvailable ? "default" : "secondary"}>
//               {doctor.isAvailable ? "Available" : "Busy"}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Booking Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CalendarIcon className="h-5 w-5" />
//                 Schedule Your Appointment
//               </CardTitle>
//               <CardDescription>Select your preferred date, time, and appointment details</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   {/* Appointment Type Selection */}
//                   <div className="space-y-4">
//                     <h3 className="font-medium flex items-center gap-2">
//                       <FileText className="h-4 w-4" />
//                       Appointment Type
//                     </h3>
//                     <FormField
//                       // control={form.control}
//                       name="appointmentType"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                               className="grid grid-cols-1 sm:grid-cols-3 gap-4"
//                             >
//                               <div className="flex items-center space-x-2">
//                                 <RadioGroupItem value="IN_PERSON" id="in-person" />
//                                 <Label htmlFor="in-person" className="flex items-center gap-2 cursor-pointer">
//                                   <MapPin className="h-4 w-4" />
//                                   In-Person Visit
//                                 </Label>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <RadioGroupItem value="VIRTUAL" id="virtual" />
//                                 <Label htmlFor="virtual" className="flex items-center gap-2 cursor-pointer">
//                                   <Video className="h-4 w-4" />
//                                   Virtual Consultation
//                                 </Label>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <RadioGroupItem value="PHONE_CONSULTATION" id="phone" />
//                                 <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
//                                   <Phone className="h-4 w-4" />
//                                   Phone Consultation
//                                 </Label>
//                               </div>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Facility Selection (only for in-person appointments) */}
//                   {appointmentType === "IN_PERSON" && (
//                     <FormField
//                       // control={form.control}
//                       name="facilityId"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Select Facility</FormLabel>
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Choose a facility" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {facilities.map((facility) => (
//                                 <SelectItem key={facility.id} value={facility.id}>
//                                   <div className="flex flex-col">
//                                     <span className="font-medium">{facility.name}</span>
//                                     <span className="text-sm text-muted-foreground">
//                                       {facility.address}, {facility.city}
//                                     </span>
//                                   </div>
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}

//                   {/* Date Selection */}
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="font-medium mb-3 flex items-center gap-2">
//                         <CalendarIcon className="h-4 w-4" />
//                         Select Date
//                       </h3>
//                       <CalendarComponent
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={(date) => {
//                           handleDateSelect(date)
//                           if (date) {
//                             form.setValue("appointmentDate", date.toISOString().split("T")[0])
//                           }
//                         }}
//                         disabled={(date) => {
//                           const today = new Date()
//                           today.setHours(0, 0, 0, 0)
//                           return date < today || date.getDay() === 0 // Disable past dates and Sundays
//                         }}
//                         className="rounded-md border w-fit"
//                       />
//                     </div>

//                     {/* Time Slots */}
//                     {selectedDate && (
//                       <div>
//                         <h3 className="font-medium mb-3 flex items-center gap-2">
//                           <Clock className="h-4 w-4" />
//                           Available Time Slots
//                           {loading && (
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
//                           )}
//                         </h3>

//                         {loading ? (
//                           <div className="text-sm text-muted-foreground">Loading available slots...</div>
//                         ) : availableSlots.length === 0 ? (
//                           <div className="text-sm text-muted-foreground">
//                             No available slots for {format(selectedDate, "MMMM d, yyyy")}
//                           </div>
//                         ) : (
//                           <FormField
//                             // control={form.control}
//                             name="slotId"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                                     {availableSlots.map((slot) => (
//                                       <div
//                                         key={slot.id}
//                                         className={cn(
//                                           "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
//                                           field.value === slot.id
//                                             ? "border-primary bg-primary/5 ring-1 ring-primary"
//                                             : "border-border",
//                                         )}
//                                         onClick={() => field.onChange(slot.id)}
//                                       >
//                                         <div className="flex items-center justify-between">
//                                           <div className="flex items-center gap-2">
//                                             <Clock className="h-4 w-4" />
//                                             <span className="font-medium">{slot.time}</span>
//                                           </div>
//                                           <Badge variant="outline">{slot.duration} min</Badge>
//                                         </div>
//                                         <div className="text-xs text-muted-foreground mt-1">${slot.price}</div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <Separator />

//                   {/* Appointment Details */}
//                   <div className="space-y-4">
//                     <h3 className="font-medium flex items-center gap-2">
//                       <FileText className="h-4 w-4" />
//                       Appointment Details
//                     </h3>

//                     <FormField
//                       // control={form.control}
//                       name="chiefComplaint"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Chief Complaint / Reason for Visit *</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Please describe your main symptoms or reason for this appointment..."
//                               className="min-h-[80px]"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       // control={form.control}
//                       name="notes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Additional Notes (Optional)</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Any additional information you'd like the doctor to know..."
//                               className="min-h-[60px]"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-4 pt-4">
//                     <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
//                       Back to Doctors
//                     </Button>
//                     <Button
//                       type="submit"
//                       disabled={submitting || !form.formState.isValid || !selectedDate || !form.watch("slotId")}
//                       className="flex-1"
//                     >
//                       {submitting ? (
//                         <div className="flex items-center gap-2">
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           Booking...
//                         </div>
//                       ) : (
//                         "Confirm Booking"
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Booking Summary */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Booking Summary
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Doctor:</span>
//                   <span className="font-medium">{doctor.name}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Specialization:</span>
//                   <span>{doctor.specialization}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Type:</span>
//                   <span className="flex items-center gap-1">
//                     {getAppointmentTypeIcon(appointmentType)}
//                     {getAppointmentTypeLabel(appointmentType)}
//                   </span>
//                 </div>
//                 {appointmentType === "IN_PERSON" && selectedFacility && (
//                   <div className="flex justify-between text-sm">
//                     <span>Facility:</span>
//                     <span className="font-medium">{selectedFacility.name}</span>
//                   </div>
//                 )}
//                 {selectedDate && (
//                   <div className="flex justify-between text-sm">
//                     <span>Date:</span>
//                     <span className="font-medium">{format(selectedDate, "MMM d, yyyy")}</span>
//                   </div>
//                 )}
//                 {selectedSlot && (
//                   <>
//                     <div className="flex justify-between text-sm">
//                       <span>Time:</span>
//                       <span className="font-medium">{selectedSlot.time}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Duration:</span>
//                       <span>{selectedSlot.duration} minutes</span>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Consultation Fee:</span>
//                   <span>${selectedSlot?.price || doctor.consultationFee}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Platform Fee:</span>
//                   <span>$5</span>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between font-medium">
//                   <span>Total:</span>
//                   <span>${(selectedSlot?.price || doctor.consultationFee) + 5}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Important Notes */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm">Important Notes</CardTitle>
//             </CardHeader>
//             <CardContent className="text-xs space-y-2 text-muted-foreground">
//               {appointmentType === "IN_PERSON" ? (
//                 <>
//                   <p>• Please arrive 10 minutes before your appointment</p>
//                   <p>• Bring a valid ID and insurance card</p>
//                   <p>• You can reschedule up to 24 hours before</p>
//                   <p>• Cancellation fee may apply for late cancellations</p>
//                 </>
//               ) : (
//                 <>
//                   <p>• You'll receive a meeting link via email</p>
//                   <p>• Test your camera and microphone beforehand</p>
//                   <p>• Ensure stable internet connection</p>
//                   <p>• You can reschedule up to 24 hours before</p>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
