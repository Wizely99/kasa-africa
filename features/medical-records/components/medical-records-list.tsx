"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Search, Filter, FileText, Share2, Lock, Zap } from "lucide-react"
import type { MedicalRecord, MedicalRecordFilters } from "../types/medical-record"
import { getMedicalRecordsAction } from "../actions/medical-record-actions"
import { MedicalRecordCard } from "./medical-record-card"

interface MedicalRecordsListProps {
  patientId?: string
  doctorId?: string
  showPatientControls?: boolean
}

export function MedicalRecordsList({ patientId, doctorId, showPatientControls = false }: MedicalRecordsListProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<MedicalRecordFilters>({
    patientId,
    doctorId,
  })

  useEffect(() => {
    loadRecords()
  }, [filters])

  const loadRecords = async () => {
    setIsLoading(true)
    try {
      const result = await getMedicalRecordsAction(filters)
      if (result.success) {
        setRecords(result.data)
      } else {
        toast.error("Failed to load medical records")
      }
    } catch (error) {
      toast.error("An error occurred while loading records")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery }))
  }

  const handleFilterChange = (key: keyof MedicalRecordFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({ patientId, doctorId })
  }

  const getStats = () => {
    const total = records.length
    const shared = records.filter((r) => r.isShared).length
    const privateRecords = records.filter((r) => !r.isShared).length
    const ocrCompleted = records.filter((r) => r.ocrStatus === "COMPLETED").length
    const ocrPending = records.filter((r) => r.ocrStatus === "PENDING" || r.ocrStatus === "PROCESSING").length

    return { total, shared, privateRecords, ocrCompleted, ocrPending }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Shared</p>
                <p className="text-2xl font-bold">{stats.shared}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Private</p>
                <p className="text-2xl font-bold">{stats.privateRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">OCR Complete</p>
                <p className="text-2xl font-bold">{stats.ocrCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">OCR Pending</p>
                <p className="text-2xl font-bold">{stats.ocrPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Select onValueChange={(value) => handleFilterChange("recordType", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="LAB_RESULT">Lab Result</SelectItem>
                <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                <SelectItem value="DIAGNOSIS">Diagnosis</SelectItem>
                <SelectItem value="IMAGING">Imaging</SelectItem>
                <SelectItem value="VACCINATION">Vaccination</SelectItem>
                <SelectItem value="SURGERY">Surgery</SelectItem>
                <SelectItem value="CONSULTATION_NOTE">Consultation Note</SelectItem>
                <SelectItem value="DISCHARGE_SUMMARY">Discharge Summary</SelectItem>
                <SelectItem value="REFERRAL">Referral</SelectItem>
                <SelectItem value="ALLERGY_RECORD">Allergy Record</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange("ocrStatus", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="OCR Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OCR Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
            <p className="text-gray-500">
              {filters.searchQuery || filters.recordType || filters.ocrStatus
                ? "Try adjusting your search criteria or filters"
                : "Start by adding your first medical record"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <MedicalRecordCard
              key={record.id}
              record={record}
              showPatientControls={showPatientControls}
              onUpdate={loadRecords}
            />
          ))}
        </div>
      )}
    </div>
  )
}
