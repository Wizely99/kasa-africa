"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Share2, Lock, Zap } from "lucide-react";
import type {
  MedicalRecord,
  MedicalRecordFilters,
} from "../types/medical-record";
import { getMedicalRecordsAction } from "../actions/medical-record-actions";
import { MedicalRecordCard } from "./medical-record-card";
import { MetricsGrid } from "./record-metric-grid";
import { SearchAndFilterCard } from "./medical-record-filter";

interface MedicalRecordsListProps {
  patientId?: string;
  doctorId?: string;
  showPatientControls?: boolean;
}

const recordTypeOptions = [
  { value: "all", label: "All Types" },
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
];
const ocrStatusOptions = [
  { value: "all", label: "All OCR Status" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
];

export function MedicalRecordsList({
  patientId,
  doctorId,
  showPatientControls = false,
}: Readonly<MedicalRecordsListProps>) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MedicalRecordFilters>({
    patientId,
    doctorId,
  });

  useEffect(() => {
    loadRecords();
  }, [filters]);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const result = await getMedicalRecordsAction(filters);
      if (result.success) {
        setRecords(result.data);
      } else {
        toast.error("Failed to load medical records");
      }
    } catch (error) {
      toast.error("An error occurred while loading records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const handleFilterChange = (key: string, value?: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ patientId, doctorId });
  };

  const getStats = () => {
    const total = records.length;
    const shared = records.filter((r) => r.isShared).length;
    const privateRecords = records.filter((r) => !r.isShared).length;
    const ocrCompleted = records.filter(
      (r) => r.ocrStatus === "COMPLETED"
    ).length;
    const ocrPending = records.filter(
      (r) => r.ocrStatus === "PENDING" || r.ocrStatus === "PROCESSING"
    ).length;

    return { total, shared, privateRecords, ocrCompleted, ocrPending };
  };

  const stats = getStats();

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
    );
  }

  const MetricStats = [
    {
      title: "Total Records",
      value: stats.total,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-blue-500", // calm and professional
    },
    {
      title: "Shared Records",
      value: stats.shared,
      icon: <Share2 className="h-5 w-5" />,
      color: "bg-green-500", // success/positive
    },
    {
      title: "Private Records",
      value: stats.privateRecords,
      icon: <Lock className="h-5 w-5" />,
      color: "bg-red-500", // warning/restricted
    },
    {
      title: "OCR Complete",
      value: stats.ocrCompleted,
      icon: <Zap className="h-5 w-5" />,
      color: "bg-purple-500", // distinct & high contrast
    },
    {
      title: "OCR Pending",
      value: stats.ocrPending,
      icon: <Zap className="h-5 w-5" />,
      color: "bg-amber-500", // waiting/in-progress
    },
  ];

  return (
    <div className="space-y-4 ">
      {/* Statistics Cards */}
      <MetricsGrid metrics={MetricStats} />

      <SearchAndFilterCard
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        recordTypeOptions={recordTypeOptions}
        ocrStatusOptions={ocrStatusOptions}
      />

      {/* Records Grid */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400  mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No medical records found
            </h3>
            <p className="text-gray-500">
              {filters.searchQuery || filters.recordType || filters.ocrStatus
                ? "Try adjusting your search criteria or filters"
                : "Start by adding your first medical record"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
  );
}
