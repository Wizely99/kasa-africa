"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Edit3,
  Save,
  X,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { MedicalRecord } from "../types/medical-record";
import { updateOCRTextAction } from "../actions/medical-record-actions";

interface OCRTextViewerProps {
  record: MedicalRecord;
  onUpdate?: () => void;
}

export function OCRTextViewer({ record, onUpdate }: OCRTextViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(record.ocrText || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedText.trim()) {
      toast.error("OCR text cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateOCRTextAction(record.id, editedText);

      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast.error(result.error || "Failed to update OCR text");
      }
    } catch (error) {
      toast.error("An error occurred while updating OCR text");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedText(record.ocrText || "");
    setIsEditing(false);
  };

  const getStatusIcon = () => {
    switch (record.ocrStatus) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PROCESSING":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <Loader2 className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (record.ocrStatus) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusMessage = () => {
    switch (record.ocrStatus) {
      case "COMPLETED":
        return `Text extracted with ${record.ocrConfidence}% confidence`;
      case "PROCESSING":
        return "Processing document...";
      case "FAILED":
        return "Failed to extract text from document";
      case "PENDING":
        return "Queued for text extraction";
      case "NOT_APPLICABLE":
        return "Text extraction not available for this file type";
      default:
        return "Unknown status";
    }
  };

  if (record.ocrStatus === "NOT_APPLICABLE") {
    return null;
  }

  return (
    <Card className="border border-gray-200 shadow-xs rounded-xl overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-semibold text-gray-800">
            <FileText className="h-5 w-5 text-gray-600" />
            Extracted Text
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor()} flex items-center gap-1`}>
              {getStatusIcon()}
              <span>{record.ocrStatus.replace("_", " ")}</span>
            </Badge>
            {record.ocrStatus === "COMPLETED" && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2">{getStatusMessage()}</p>
        {record.ocrProcessedAt && (
          <p className="text-xs text-gray-500 mt-1">
            Processed on {new Date(record.ocrProcessedAt).toLocaleString()}
          </p>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4">
        {record.ocrStatus === "PENDING" || record.ocrStatus === "PROCESSING" ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>
              {record.ocrStatus === "PENDING"
                ? "Waiting to process document..."
                : "Extracting text from document..."}
            </span>
          </div>
        ) : record.ocrStatus === "FAILED" ? (
          <div className="flex flex-col items-center justify-center py-8 text-red-500 gap-2">
            <AlertCircle className="h-6 w-6" />
            <span>Failed to extract text from this document</span>
          </div>
        ) : record.ocrStatus === "COMPLETED" && record.ocrText ? (
          <div className="grid grid-cols-2 gap-4">
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm border-gray-300 focus:border-blue-500"
                  placeholder="Edit the extracted text..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {record.ocrText}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
            <FileText className="h-6 w-6" />
            <span>No text extracted yet</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
