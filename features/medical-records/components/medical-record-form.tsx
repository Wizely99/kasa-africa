"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Upload, X, Plus, FileText, Zap } from "lucide-react"
import { createMedicalRecordSchema, type MedicalRecordFormData } from "../schemas/medical-record-schemas"
import { createMedicalRecordAction, uploadMedicalFileAction } from "../actions/medical-record-actions"
import type { RecordType } from "../types/medical-record"

interface MedicalRecordFormProps {
  patientId?: string
  doctorId?: string
  appointmentId?: string
  onSuccess?: () => void
}

const recordTypeOptions: { value: RecordType; label: string }[] = [
  { value: "LAB_RESULT", label: "Lab Result" },
  { value: "PRESCRIPTION", label: "Prescription" },
  { value: "DIAGNOSIS", label: "Diagnosis" },
  { value: "IMAGING", label: "Imaging" },
  { value: "VACCINATION", label: "Vaccination" },
  { value: "SURGERY", label: "Surgery" },
  { value: "CONSULTATION_NOTE", label: "Consultation Note" },
  { value: "DISCHARGE_SUMMARY", label: "Discharge Summary" },
  { value: "REFERRAL", label: "Referral" },
  { value: "ALLERGY_RECORD", label: "Allergy Record" },
]

export function MedicalRecordForm({ patientId, doctorId, appointmentId, onSuccess }: MedicalRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(createMedicalRecordSchema),
    defaultValues: {
      patientId: patientId || "",
      doctorId: doctorId || "",
      appointmentId: appointmentId || "",
      recordType: "LAB_RESULT",
      title: "",
      description: "",
      tags: [],
      isShared: true,
    },
  })

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or image file")
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setUploadedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }, [])

  const removeFile = () => {
    setUploadedFile(null)
    setFilePreview(null)
  }

  const addTag = () => {
    if (!newTag.trim()) return

    const currentTags = form.getValues("tags")
    if (!currentTags.includes(newTag.trim())) {
      form.setValue("tags", [...currentTags, newTag.trim()])
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    )
  }

  const isOCRSupported = (file: File | null) => {
    if (!file) return false
    return file.type === "application/pdf" || file.type.startsWith("image/")
  }

  const onSubmit = async (data: MedicalRecordFormData) => {
    if (!uploadedFile) {
      toast.error("Please upload a file")
      return
    }

    setIsSubmitting(true)

    try {
      // Upload file first
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const uploadResult = await uploadMedicalFileAction(formData)

      if (!uploadResult.success) {
        toast.error(uploadResult.error || "Failed to upload file")
        return
      }

      // Create medical record with file URL
      const result = await createMedicalRecordAction({
        ...data,
        fileUrl: uploadResult.fileUrl!,
      })

      if (result.success) {
        toast.success(result.message)
        if (isOCRSupported(uploadedFile)) {
          toast.info("OCR processing started. You'll be notified when text extraction is complete.")
        }
        form.reset()
        setUploadedFile(null)
        setFilePreview(null)
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to create medical record")
      }
    } catch (error) {
      toast.error("An error occurred while creating the record")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Medical Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter patient ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter doctor ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recordType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recordTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="appointmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter appointment ID (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter record title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter detailed description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <div className="space-y-4">
              <FormLabel>Upload File *</FormLabel>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or click to upload
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">PDF, PNG, JPG, GIF up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {filePreview ? (
                          <img
                            src={filePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <FileText className="h-12 w-12 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isOCRSupported(uploadedFile) && (
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription>
                        This file supports automatic text extraction. OCR processing will begin after upload and you'll
                        receive a notification when complete.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {form.watch("tags").length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch("tags").map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isShared"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Share with Healthcare Providers</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow other healthcare providers to access this record
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Record..." : "Create Medical Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
