"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, X, DollarSign, User, Building, Award, Languages, Calendar } from "lucide-react"
import { doctorProfileSchema, type DoctorProfileFormData } from "../schemas/doctor-schemas"
import {
  updateDoctorProfileAction,
  getDepartmentsAction,
  getFacilitiesAction,
  getRolesAction,
  getExpertiseAction,
} from "../actions/doctor-actions"
import type { DoctorProfile, Department, Facility, Role, Expertise } from "../types/doctor"

interface DoctorProfileFormProps {
  doctorProfile?: DoctorProfile
  doctorId: string
}

const ADMIN_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "STAFF", label: "Staff" },
]

const LANGUAGES = ["English", "Yoruba", "Hausa", "Igbo", "French", "Arabic", "Swahili", "Portuguese", "Spanish"]

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export function DoctorProfileForm({ doctorProfile, doctorId }: DoctorProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [expertise, setExpertise] = useState<Expertise[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(doctorProfile?.languages || [])

  const form = useForm<DoctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      adminRole: doctorProfile?.adminRole || "STAFF",
      departmentId: doctorProfile?.departmentId || "",
      facilityId: doctorProfile?.facilityId || "",
      roleId: doctorProfile?.roleId || "",
      userProfileId: doctorProfile?.userProfileId || "",
      licenseNumber: doctorProfile?.licenseNumber || "",
      specialization: doctorProfile?.specialization || "",
      yearsOfExperience: doctorProfile?.yearsOfExperience || 0,
      qualification: doctorProfile?.qualification || "",
      expertiseIds: doctorProfile?.expertiseIds || [],
      bio: doctorProfile?.bio || "",
      consultationFee: doctorProfile?.consultationFee || 0,
      followUpFee: doctorProfile?.followUpFee || 0,
      emergencyFee: doctorProfile?.emergencyFee || 0,
      languages: doctorProfile?.languages || [],
      availabilityHours: doctorProfile?.availabilityHours || {},
    },
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptResult, facilityResult, roleResult, expResult] = await Promise.all([
          getDepartmentsAction(),
          getFacilitiesAction(),
          getRolesAction(),
          getExpertiseAction(),
        ])

        if (deptResult.success) setDepartments(deptResult.data)
        if (facilityResult.success) setFacilities(facilityResult.data)
        if (roleResult.success) setRoles(roleResult.data)
        if (expResult.success) setExpertise(expResult.data)
      } catch (error) {
        console.error("Error loading form data:", error)
        toast.error("Failed to load form data")
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: DoctorProfileFormData) => {
    setIsLoading(true)
    try {
      const result = await updateDoctorProfileAction(doctorId, {
        ...data,
        languages: selectedLanguages,
      })

      if (result.success) {
        toast.success(result.message || "Profile updated successfully")
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language])
    }
  }

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential details about your medical practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="MD-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="MBBS, MD Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about your medical practice and expertise..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Details
            </CardTitle>
            <CardDescription>Your role and department within the healthcare facility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adminRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ADMIN_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Expertise & Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Expertise & Languages
            </CardTitle>
            <CardDescription>Your areas of medical expertise and languages spoken</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="expertiseIds"
              render={() => (
                <FormItem>
                  <FormLabel>Areas of Expertise</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {expertise.map((exp) => (
                      <FormField
                        key={exp.id}
                        control={form.control}
                        name="expertiseIds"
                        render={({ field }) => {
                          return (
                            <FormItem key={exp.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(exp.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, exp.id])
                                      : field.onChange(field.value?.filter((value) => value !== exp.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{exp.name}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages Spoken
              </FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary" className="flex items-center gap-1">
                    {language}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeLanguage(language)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter((lang) => !selectedLanguages.includes(lang)).map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Consultation Fees
            </CardTitle>
            <CardDescription>Set your consultation fees for different types of appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="consultationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="150.00"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="followUpFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="100.00"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="300.00"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability Hours
            </CardTitle>
            <CardDescription>Set your general availability hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.key} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-24">
                  <FormLabel className="text-sm font-medium">{day.label}</FormLabel>
                </div>

                <FormField
                  control={form.control}
                  name={`availabilityHours.${day.key}.isAvailable` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch(`availabilityHours.${day.key}.isAvailable` as any) && (
                  <>
                    <FormField
                      control={form.control}
                      name={`availabilityHours.${day.key}.start` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-32" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <span className="text-muted-foreground">to</span>

                    <FormField
                      control={form.control}
                      name={`availabilityHours.${day.key}.end` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-32" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  )
}
