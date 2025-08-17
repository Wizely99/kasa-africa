"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileText,
  ImageIcon,
  Share2,
  Lock,
  Trash2,
  Eye,
  Calendar,
  User,
  Stethoscope,
  Zap,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { MedicalRecord } from "../types/medical-record";
import {
  toggleRecordSharingAction,
  deleteMedicalRecordAction,
} from "../actions/medical-record-actions";
import { OCRTextViewer } from "./ocr-text-viewer";

interface MedicalRecordCardProps {
  record: MedicalRecord;
  showPatientControls?: boolean;
  onUpdate?: () => void;
}

export function MedicalRecordCard({
  record,
  showPatientControls = false,
  onUpdate,
}: MedicalRecordCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSharing = async (isShared: boolean) => {
    setIsUpdating(true);

    try {
      const result = await toggleRecordSharingAction(record.id, isShared);

      if (result.success) {
        toast.success(result.message);
        onUpdate?.();
      } else {
        toast.error(result.error || "Failed to update sharing settings");
      }
    } catch (error) {
      toast.error("An error occurred while updating sharing settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteMedicalRecordAction(record.id);

      if (result.success) {
        toast.success(result.message);
        onUpdate?.();
      } else {
        toast.error(result.error || "Failed to delete record");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the record");
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors = {
      LAB_RESULT: "bg-blue-100 text-blue-800",
      PRESCRIPTION: "bg-green-100 text-green-800",
      DIAGNOSIS: "bg-red-100 text-red-800",
      IMAGING: "bg-purple-100 text-purple-800",
      VACCINATION: "bg-yellow-100 text-yellow-800",
      SURGERY: "bg-orange-100 text-orange-800",
      CONSULTATION_NOTE: "bg-indigo-100 text-indigo-800",
      DISCHARGE_SUMMARY: "bg-pink-100 text-pink-800",
      REFERRAL: "bg-teal-100 text-teal-800",
      ALLERGY_RECORD: "bg-red-100 text-red-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getOCRStatusIcon = () => {
    switch (record.ocrStatus) {
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "PROCESSING":
        return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
      case "FAILED":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case "PENDING":
        return <Loader2 className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{record.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getRecordTypeColor(record.recordType)}>
                {record.recordType.replace("_", " ")}
              </Badge>
              {record.isShared ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-600"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
              {record.ocrStatus !== "NOT_APPLICABLE" && (
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-600"
                >
                  {getOCRStatusIcon()}
                  <Zap className="h-3 w-3 mr-1" />
                  OCR {record.ocrStatus.toLowerCase()}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImageFile(record.fileUrl) ? (
              <ImageIcon className="h-5 w-5 text-purple-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {record.description}
        </p>

        {record.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {record.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(record.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Patient: {record.patientId.slice(-8)}
          </div>
          <div className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            Doctor: {record.doctorId.slice(-8)}
          </div>
          {record.appointmentId && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Appt: {record.appointmentId.slice(-8)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-3">
            {/* View Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-semibold mb-4">
                    {record.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div>
                      <strong className="font-semibold text-gray-700">
                        Type:
                      </strong>{" "}
                      {record.recordType.replace("_", " ")}
                    </div>
                    <div>
                      <strong className="font-semibold text-gray-700">
                        Created:
                      </strong>{" "}
                      {new Date(record.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <strong className="font-semibold text-gray-700">
                        Patient ID:
                      </strong>{" "}
                      {record.patientId}
                    </div>
                    <div>
                      <strong className="font-semibold text-gray-700">
                        Doctor ID:
                      </strong>{" "}
                      {record.doctorId}
                    </div>
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-700">
                      Description:
                    </strong>
                    <p className="mt-2 text-gray-600">{record.description}</p>
                  </div>
                  {record.tags.length > 0 && (
                    <div>
                      <strong className="font-semibold text-gray-700">
                        Tags:
                      </strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {record.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-1  bg-accent rounded-xl mb-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <OCRTextViewer record={record} onUpdate={onUpdate} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold">
                    Delete Medical Record
                  </AlertDialogTitle>
                  <AlertDialogDescription className="mt-2 text-gray-600">
                    Are you sure you want to delete this medical record? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex justify-end gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {showPatientControls && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Share:</span>
              <Switch
                checked={record.isShared}
                onCheckedChange={handleToggleSharing}
                disabled={isUpdating}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
