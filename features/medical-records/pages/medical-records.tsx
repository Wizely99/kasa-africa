"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { MedicalRecordForm } from "../components/medical-record-form";
import { MedicalRecordsList } from "../components/medical-records-list";
import { OCRNotifications } from "../components/ocr-notifications";

interface MedicalRecordsPageProps {
  patientId?: string;
  doctorId?: string;
  showPatientControls?: boolean;
}

export function MedicalRecordsPage({
  patientId,
  doctorId,
  showPatientControls = false,
}: MedicalRecordsPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    // The list will automatically refresh due to the onUpdate callback
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-gray-600">
            {showPatientControls
              ? "Manage your medical records and privacy settings"
              : "View and manage patient medical records"}
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Medical Record</DialogTitle>
            </DialogHeader>
            <MedicalRecordForm
              patientId={patientId}
              doctorId={doctorId}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Show OCR notifications for patients */}
      {showPatientControls && patientId && (
        <div className=" gap-6 space-y-3">
          <div className="">
            <MedicalRecordsList
              patientId={patientId}
              doctorId={doctorId}
              showPatientControls={showPatientControls}
            />
          </div>
          <div>
            <OCRNotifications patientId={patientId} />
          </div>
        </div>
      )}

      {/* Show full width for doctors/admins */}
      {!showPatientControls && (
        <MedicalRecordsList
          patientId={patientId}
          doctorId={doctorId}
          showPatientControls={showPatientControls}
        />
      )}
    </div>
  );
}
