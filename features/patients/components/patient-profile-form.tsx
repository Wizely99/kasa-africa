"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, Heart, Phone, Shield, Activity, MessageSquare, Plus, X, Stethoscope } from "lucide-react"
import type { PatientProfile, PatientProfileFormData } from "../types/patient-profile"
import { patientProfileSchema } from "../schemas/patient-profile-schemas"
import { updatePatientProfile, createPatientProfile } from "../actions/patient-profile-actions"

interface PatientProfileFormProps {
  initialData?: PatientProfile | null
  mode?: "create" | "edit"
}

export function PatientProfileForm({ initialData, mode = "edit" }: PatientProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newMedicalHistory, setNewMedicalHistory] = useState("")
  const [newFamilyHistory, setNewFamilyHistory] = useState("")

  const form = useForm<PatientProfileFormData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: initialData
      ? {
          userProfileId: initialData.userProfileId,
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone,
          dateOfBirth: initialData.dateOfBirth,
          gender: initialData.gender,
          maritalStatus: initialData.maritalStatus,
          address: initialData.address,
          city: initialData.city,
          state: initialData.state,
          zipCode: initialData.zipCode,
          bloodType: initialData.bloodType,
          height: initialData.height || "",
          weight: initialData.weight || "",
          emergencyContact: initialData.emergencyContact,
          emergencyPhone: initialData.emergencyPhone,
          emergencyRelationship: initialData.emergencyRelationship,
          insuranceProvider: initialData.insuranceProvider || "",
          insuranceNumber: initialData.insuranceNumber || "",
          insurancePolicyHolder: initialData.insurancePolicyHolder || "",
          allergies: initialData.allergies,
          medications: initialData.medications,
          medicalHistory: initialData.medicalHistory,
          familyHistory: initialData.familyHistory,
          smokingStatus: initialData.smokingStatus,
          alcoholConsumption: initialData.alcoholConsumption,
          exerciseFrequency: initialData.exerciseFrequency,
          preferredLanguage: initialData.preferredLanguage,
          communicationPreferences: initialData.communicationPreferences,
        }
      : {
          userProfileId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "Prefer not to say",
          maritalStatus: "Single",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          bloodType: "O_POSITIVE",
          height: "",
          weight: "",
          emergencyContact: "",
          emergencyPhone: "",
          emergencyRelationship: "",
          insuranceProvider: "",
          insuranceNumber: "",
          insurancePolicyHolder: "",
          allergies: [],
          medications: [],
          medicalHistory: [],
          familyHistory: [],
          smokingStatus: "Never",
          alcoholConsumption: "Never",
          exerciseFrequency: "Sometimes",
          preferredLanguage: "English",
          communicationPreferences: [],
        },
  })

  const onSubmit = async (data: PatientProfileFormData) => {
    setIsLoading(true)
    try {
      const result = mode === "create" ? await createPatientProfile(data) : await updatePatientProfile(data)

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = (
    field: keyof Pick<PatientProfileFormData, "allergies" | "medications" | "medicalHistory" | "familyHistory">,
    value: string,
    setter: (value: string) => void,
  ) => {
    if (value.trim()) {
      const currentValues = form.getValues(field) || []
      form.setValue(field, [...currentValues, value.trim()])
      setter("")
    }
  }

  const removeItem = (
    field: keyof Pick<PatientProfileFormData, "allergies" | "medications" | "medicalHistory" | "familyHistory">,
    index: number,
  ) => {
    const currentValues = form.getValues(field) || []
    form.setValue(
      field,
      currentValues.filter((_, i) => i !== index),
    )
  }

  const communicationOptions = [
    { id: "email", label: "Email" },
    { id: "sms", label: "SMS" },
    { id: "phone", label: "Phone Call" },
    { id: "portal", label: "Patient Portal" },
  ]

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...form.register("firstName")}
              placeholder="Enter first name"
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...form.register("lastName")}
              placeholder="Enter last name"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Enter email address"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="Enter phone number"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...form.register("dateOfBirth")}
            />
            {form.formState.errors.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select value={form.watch("gender")} onValueChange={(value) => form.setValue("gender", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select value={form.watch("maritalStatus")} onValueChange={(value) => form.setValue("maritalStatus", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="Enter street address"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...form.register("city")}
              placeholder="Enter city"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              {...form.register("state")}
              placeholder="Enter state"
            />
            {form.formState.errors.state && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...form.register("zipCode")}
              placeholder="Enter ZIP code"
            />
            {form.formState.errors.zipCode && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.zipCode.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="bloodType">Blood Type *</Label>
            <Select value={form.watch("bloodType")} onValueChange={(value) => form.setValue("bloodType", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A_POSITIVE">A+</SelectItem>
                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                <SelectItem value="B_POSITIVE">B+</SelectItem>
                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                <SelectItem value="O_POSITIVE">O+</SelectItem>
                <SelectItem value="O_NEGATIVE">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              {...form.register("height")}
              placeholder="e.g., 5'6\"
            />
          </div>

          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              {...form.register("weight")}
              placeholder="e.g., 140 lbs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="emergencyContact">Contact Name *</Label>
            <Input
              id="emergencyContact"
              {...form.register("emergencyContact")}
              placeholder="Enter contact name"
            />
            {form.formState.errors.emergencyContact && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.emergencyContact.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyPhone">Phone Number *</Label>
            <Input
              id="emergencyPhone"
              {...form.register("emergencyPhone")}
              placeholder="Enter phone number"
            />
            {form.formState.errors.emergencyPhone && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.emergencyPhone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyRelationship">Relationship *</Label>
            <Input
              id="emergencyRelationship"
              {...form.register("emergencyRelationship")}
              placeholder="e.g., Spouse, Parent"
            />
            {form.formState.errors.emergencyRelationship && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.emergencyRelationship.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              {...form.register("insuranceProvider")}
              placeholder="Enter insurance provider"
            />
          </div>

          <div>
            <Label htmlFor="insuranceNumber">Insurance Number</Label>
            <Input
              id="insuranceNumber"
              {...form.register("insuranceNumber")}
              placeholder="Enter insurance number"
            />
          </div>

          <div>
            <Label htmlFor="insurancePolicyHolder">Policy Holder</Label>
            <Input
              id="insurancePolicyHolder"
              {...form.register("insurancePolicyHolder")}
              placeholder="Enter policy holder name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Medical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div>
            <Label>Allergies</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem('allergies', newAllergy, setNewAllergy)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addItem('allergies', newAllergy, setNewAllergy)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("allergies")?.map((allergy, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {allergy}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeItem('allergies', index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <Label>Current Medications</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add medication"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem('medications', newMedication, setNewMedication)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addItem('medications', newMedication, setNewMedication)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("medications")?.map((medication, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {medication}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeItem('medications', index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div>
            <Label>Medical History</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newMedicalHistory}
                onChange={(e) => setNewMedicalHistory(e.target.value)}
                placeholder="Add medical condition"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem('medicalHistory', newMedicalHistory, setNewMedicalHistory)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addItem('medicalHistory', newMedicalHistory, setNewMedicalHistory)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("medicalHistory")?.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeItem('medicalHistory', index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Family History */}
          <div>
            <Label>Family History</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newFamilyHistory}
                onChange={(e) => setNewFamilyHistory(e.target.value)}
                placeholder="Add family medical history"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem('familyHistory', newFamilyHistory, setNewFamilyHistory)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addItem('familyHistory', newFamilyHistory, setNewFamilyHistory)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("familyHistory")?.map((history, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {history}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeItem('familyHistory', index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Lifestyle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="smokingStatus">Smoking Status</Label>
            <Select value={form.watch("smokingStatus")} onValueChange={(value) => form.setValue("smokingStatus", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Former">Former</SelectItem>
                <SelectItem value="Current">Current</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
            <Select value={form.watch("alcoholConsumption")} onValueChange={(value) => form.setValue("alcoholConsumption", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select alcohol consumption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Occasionally">Occasionally</SelectItem>
                <SelectItem value="Regularly">Regularly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
            <Select value={form.watch("exerciseFrequency")} onValueChange={(value) => form.setValue("exerciseFrequency", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select exercise frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Rarely">Rarely</SelectItem>
                <SelectItem value="Sometimes">Sometimes</SelectItem>
                <SelectItem value="Often">Often</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            <Input
              id="preferredLanguage"
              {...form.register("preferredLanguage")}
              placeholder="Enter preferred language"
            />
          </div>

          <div>
            <Label>Communication Methods</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {communicationOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={form.watch("communicationPreferences")?.includes(option.label)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("communicationPreferences") || []
                      if (checked) {
                        form.setValue("communicationPreferences", [...current, option.label])
                      } else {
                        form.setValue("communicationPreferences", current.filter(item => item !== option.label))
                      }
                    }}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create Profile" : "Update Profile"}
        </Button>
      </div>
    </form>
  )
}
