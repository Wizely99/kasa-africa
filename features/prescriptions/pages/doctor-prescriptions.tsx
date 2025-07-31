"use client"

import { useState } from "react"
import { Plus, FileText, Upload, Save, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Medication {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
  refills: number
}

interface LabTest {
  id: string
  parameter: string
  value: string
  unit: string
  referenceRange: string
  status: "normal" | "high" | "low" | "critical"
}

export default function DoctorPrescriptions() {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState("")
  const [medications, setMedications] = useState<Medication[]>([])
  const [labResults, setLabResults] = useState<LabTest[]>([])

  // Dialog states for Medication
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [isEditMedicationOpen, setIsEditMedicationOpen] = useState(false)
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null)
  const [medicationForm, setMedicationForm] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    quantity: 0,
    refills: 0,
  })

  // Dialog states for Lab Test
  const [isAddLabTestOpen, setIsAddLabTestOpen] = useState(false)
  const [isEditLabTestOpen, setIsEditLabTestOpen] = useState(false)
  const [currentLabTest, setCurrentLabTest] = useState<LabTest | null>(null)
  const [labTestForm, setLabTestForm] = useState({
    parameter: "",
    value: "",
    unit: "",
    referenceRange: "",
    status: "normal" as "normal" | "high" | "low" | "critical",
  })

  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "",
    instructions: "",
    validityDays: 90,
  })
  const [diagnosisData, setDiagnosisData] = useState({
    primaryDiagnosis: "",
    secondaryDiagnoses: "",
    symptoms: "",
    treatmentPlan: "",
    followUpInstructions: "",
    severity: "mild" as "mild" | "moderate" | "severe",
  })
  const [labData, setLabData] = useState({
    testName: "",
    testType: "",
    notes: "",
  })

  // Mock patients and appointments
  const mockPatients = [
    { id: "1", name: "John Doe", age: 35 },
    { id: "2", name: "Jane Smith", age: 28 },
    { id: "3", name: "Robert Johnson", age: 45 },
  ]

  const mockAppointments = [
    { id: "1", patientId: "1", date: "2025-01-15", time: "10:00 AM", type: "Consultation" },
    { id: "2", patientId: "2", date: "2025-01-15", time: "2:00 PM", type: "Follow-up" },
    { id: "3", patientId: "3", date: "2025-01-16", time: "9:00 AM", type: "Check-up" },
  ]

  const resetMedicationForm = () => {
    setMedicationForm({
      medicationName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      quantity: 0,
      refills: 0,
    })
    setCurrentMedication(null)
  }

  const handleAddMedication = () => {
    if (medicationForm.medicationName && medicationForm.dosage) {
      setMedications([...medications, { id: String(Date.now()), ...medicationForm }])
      setIsAddMedicationOpen(false)
      resetMedicationForm()
    }
  }

  const handleEditMedication = () => {
    if (currentMedication && medicationForm.medicationName && medicationForm.dosage) {
      setMedications(medications.map((med) => (med.id === currentMedication.id ? { ...med, ...medicationForm } : med)))
      setIsEditMedicationOpen(false)
      resetMedicationForm()
    }
  }

  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const resetLabTestForm = () => {
    setLabTestForm({
      parameter: "",
      value: "",
      unit: "",
      referenceRange: "",
      status: "normal",
    })
    setCurrentLabTest(null)
  }

  const handleAddLabTest = () => {
    if (labTestForm.parameter && labTestForm.value) {
      setLabResults([...labResults, { id: String(Date.now()), ...labTestForm }])
      setIsAddLabTestOpen(false)
      resetLabTestForm()
    }
  }

  const handleEditLabTest = () => {
    if (currentLabTest && labTestForm.parameter && labTestForm.value) {
      setLabResults(labResults.map((test) => (test.id === currentLabTest.id ? { ...test, ...labTestForm } : test)))
      setIsEditLabTestOpen(false)
      resetLabTestForm()
    }
  }

  const removeLabTest = (id: string) => {
    setLabResults(labResults.filter((test) => test.id !== id))
  }

  const handleCreatePrescription = () => {
    console.log("Creating prescription:", {
      patientId: selectedPatient,
      appointmentId: selectedAppointment,
      medications,
      ...prescriptionData,
    })
    alert("Prescription created successfully!")
    // Reset form
    setMedications([])
    setPrescriptionData({ diagnosis: "", instructions: "", validityDays: 90 })
  }

  const handleSaveDiagnosis = () => {
    console.log("Saving diagnosis:", {
      patientId: selectedPatient,
      appointmentId: selectedAppointment,
      ...diagnosisData,
      secondaryDiagnoses: diagnosisData.secondaryDiagnoses
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      symptoms: diagnosisData.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
    alert("Diagnosis saved successfully!")
  }

  const handleUploadLabResults = () => {
    console.log("Uploading lab results:", {
      patientId: selectedPatient,
      appointmentId: selectedAppointment,
      ...labData,
      results: labResults,
    })
    alert("Lab results uploaded successfully!")
    // Reset form
    setLabResults([])
    setLabData({ testName: "", testType: "", notes: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Care Management</h1>
        <p className="text-muted-foreground">Create prescriptions, diagnoses, and upload lab results</p>
      </div>

      {/* Patient and Appointment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient & Appointment</CardTitle>
          <CardDescription>Choose the patient and appointment for this consultation</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} (Age: {patient.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="appointment">Appointment</Label>
            <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment" />
              </SelectTrigger>
              <SelectContent>
                {mockAppointments
                  .filter((apt) => !selectedPatient || apt.patientId === selectedPatient)
                  .map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.date} at {appointment.time} - {appointment.type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="prescription" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prescription">Create Prescription</TabsTrigger>
          <TabsTrigger value="diagnosis">Add Diagnosis</TabsTrigger>
          <TabsTrigger value="lab-results">Upload Lab Results</TabsTrigger>
        </TabsList>

        {/* Prescription Tab */}
        <TabsContent value="prescription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Prescription</CardTitle>
              <CardDescription>Add medications and prescription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Medication Form */}
              <Dialog
                open={isAddMedicationOpen}
                onOpenChange={(open) => {
                  setIsAddMedicationOpen(open)
                  if (!open) resetMedicationForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-fit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                    <DialogDescription>Enter details for the medication to be prescribed</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="medicationName">Medication Name</Label>
                        <Input
                          id="medicationName"
                          value={medicationForm.medicationName}
                          onChange={(e) => setMedicationForm((prev) => ({ ...prev, medicationName: e.target.value }))}
                          placeholder="e.g., Amoxicillin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                          id="dosage"
                          value={medicationForm.dosage}
                          onChange={(e) => setMedicationForm((prev) => ({ ...prev, dosage: e.target.value }))}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select
                          value={medicationForm.frequency}
                          onValueChange={(value) => setMedicationForm((prev) => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Once daily">Once daily</SelectItem>
                            <SelectItem value="Twice daily">Twice daily</SelectItem>
                            <SelectItem value="3 times daily">3 times daily</SelectItem>
                            <SelectItem value="4 times daily">4 times daily</SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={medicationForm.duration}
                          onChange={(e) => setMedicationForm((prev) => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={medicationForm.quantity}
                          onChange={(e) =>
                            setMedicationForm((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 0 }))
                          }
                          placeholder="e.g., 21"
                        />
                      </div>
                      <div>
                        <Label htmlFor="refills">Refills</Label>
                        <Input
                          id="refills"
                          type="number"
                          value={medicationForm.refills}
                          onChange={(e) =>
                            setMedicationForm((prev) => ({ ...prev, refills: Number.parseInt(e.target.value) || 0 }))
                          }
                          placeholder="e.g., 2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={medicationForm.instructions}
                        onChange={(e) => setMedicationForm((prev) => ({ ...prev, instructions: e.target.value }))}
                        placeholder="e.g., Take with food"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMedicationOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMedication}>Add Medication</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Medications List */}
              {medications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Added Medications</h3>
                  {medications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {med.medicationName} - {med.dosage}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {med.frequency} for {med.duration} • Qty: {med.quantity} • Refills: {med.refills}
                        </p>
                        {med.instructions && (
                          <p className="text-sm text-muted-foreground mt-1">Instructions: {med.instructions}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={isEditMedicationOpen && currentMedication?.id === med.id}
                          onOpenChange={(open) => {
                            setIsEditMedicationOpen(open)
                            if (!open) resetMedicationForm()
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentMedication(med)
                                setMedicationForm({ ...med })
                                setIsEditMedicationOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Medication</DialogTitle>
                              <DialogDescription>Modify details for this medication</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label htmlFor="editMedicationName">Medication Name</Label>
                                  <Input
                                    id="editMedicationName"
                                    value={medicationForm.medicationName}
                                    onChange={(e) =>
                                      setMedicationForm((prev) => ({ ...prev, medicationName: e.target.value }))
                                    }
                                    placeholder="e.g., Amoxicillin"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDosage">Dosage</Label>
                                  <Input
                                    id="editDosage"
                                    value={medicationForm.dosage}
                                    onChange={(e) => setMedicationForm((prev) => ({ ...prev, dosage: e.target.value }))}
                                    placeholder="e.g., 500mg"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editFrequency">Frequency</Label>
                                  <Select
                                    value={medicationForm.frequency}
                                    onValueChange={(value) =>
                                      setMedicationForm((prev) => ({ ...prev, frequency: value }))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Once daily">Once daily</SelectItem>
                                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                                      <SelectItem value="3 times daily">3 times daily</SelectItem>
                                      <SelectItem value="4 times daily">4 times daily</SelectItem>
                                      <SelectItem value="As needed">As needed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="editDuration">Duration</Label>
                                  <Input
                                    id="editDuration"
                                    value={medicationForm.duration}
                                    onChange={(e) =>
                                      setMedicationForm((prev) => ({ ...prev, duration: e.target.value }))
                                    }
                                    placeholder="e.g., 7 days"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editQuantity">Quantity</Label>
                                  <Input
                                    id="editQuantity"
                                    type="number"
                                    value={medicationForm.quantity}
                                    onChange={(e) =>
                                      setMedicationForm((prev) => ({
                                        ...prev,
                                        quantity: Number.parseInt(e.target.value) || 0,
                                      }))
                                    }
                                    placeholder="e.g., 21"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editRefills">Refills</Label>
                                  <Input
                                    id="editRefills"
                                    type="number"
                                    value={medicationForm.refills}
                                    onChange={(e) =>
                                      setMedicationForm((prev) => ({
                                        ...prev,
                                        refills: Number.parseInt(e.target.value) || 0,
                                      }))
                                    }
                                    placeholder="e.g., 2"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="editInstructions">Instructions</Label>
                                <Textarea
                                  id="editInstructions"
                                  value={medicationForm.instructions}
                                  onChange={(e) =>
                                    setMedicationForm((prev) => ({ ...prev, instructions: e.target.value }))
                                  }
                                  placeholder="e.g., Take with food"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditMedicationOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditMedication}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(med.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Prescription Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Prescription Details</h3>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={prescriptionData.diagnosis}
                    onChange={(e) => setPrescriptionData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="Primary diagnosis"
                  />
                </div>
                <div>
                  <Label htmlFor="prescriptionInstructions">General Instructions</Label>
                  <Textarea
                    id="prescriptionInstructions"
                    value={prescriptionData.instructions}
                    onChange={(e) => setPrescriptionData((prev) => ({ ...prev, instructions: e.target.value }))}
                    placeholder="General instructions for the patient"
                  />
                </div>
                <div>
                  <Label htmlFor="validity">Prescription Validity (Days)</Label>
                  <Input
                    id="validity"
                    type="number"
                    value={prescriptionData.validityDays}
                    onChange={(e) =>
                      setPrescriptionData((prev) => ({ ...prev, validityDays: Number.parseInt(e.target.value) || 90 }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleCreatePrescription}
                className="w-full"
                size="lg"
                disabled={!selectedPatient || !selectedAppointment || medications.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Diagnosis</CardTitle>
              <CardDescription>Record patient diagnosis and treatment plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                <Input
                  id="primaryDiagnosis"
                  value={diagnosisData.primaryDiagnosis}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, primaryDiagnosis: e.target.value }))}
                  placeholder="e.g., Acute bacterial sinusitis"
                />
              </div>

              <div>
                <Label htmlFor="secondaryDiagnoses">Secondary Diagnoses (comma-separated)</Label>
                <Input
                  id="secondaryDiagnoses"
                  value={diagnosisData.secondaryDiagnoses}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, secondaryDiagnoses: e.target.value }))}
                  placeholder="e.g., Allergic rhinitis, Hypertension"
                />
              </div>

              <div>
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Textarea
                  id="symptoms"
                  value={diagnosisData.symptoms}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="e.g., Nasal congestion, Facial pain, Headache"
                />
              </div>

              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={diagnosisData.severity}
                  onValueChange={(value: "mild" | "moderate" | "severe") =>
                    setDiagnosisData((prev) => ({ ...prev, severity: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  value={diagnosisData.treatmentPlan}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, treatmentPlan: e.target.value }))}
                  placeholder="Detailed treatment plan and medications"
                />
              </div>

              <div>
                <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
                <Textarea
                  id="followUpInstructions"
                  value={diagnosisData.followUpInstructions}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, followUpInstructions: e.target.value }))}
                  placeholder="When to return, warning signs, etc."
                />
              </div>

              <Button
                onClick={handleSaveDiagnosis}
                className="w-full"
                size="lg"
                disabled={!selectedPatient || !selectedAppointment || !diagnosisData.primaryDiagnosis}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Diagnosis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Results Tab */}
        <TabsContent value="lab-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Lab Results</CardTitle>
              <CardDescription>Add laboratory test results and findings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lab Test Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="testName">Test Name</Label>
                  <Input
                    id="testName"
                    value={labData.testName}
                    onChange={(e) => setLabData((prev) => ({ ...prev, testName: e.target.value }))}
                    placeholder="e.g., Complete Blood Count (CBC)"
                  />
                </div>
                <div>
                  <Label htmlFor="testType">Test Type</Label>
                  <Select
                    value={labData.testType}
                    onValueChange={(value) => setLabData((prev) => ({ ...prev, testType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blood Test">Blood Test</SelectItem>
                      <SelectItem value="Urine Test">Urine Test</SelectItem>
                      <SelectItem value="Imaging">Imaging</SelectItem>
                      <SelectItem value="Biopsy">Biopsy</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Lab Test Result */}
              <Dialog
                open={isAddLabTestOpen}
                onOpenChange={(open) => {
                  setIsAddLabTestOpen(open)
                  if (!open) resetLabTestForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-fit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Result
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lab Test Result</DialogTitle>
                    <DialogDescription>Enter details for a specific lab test parameter</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="parameter">Parameter</Label>
                        <Input
                          id="parameter"
                          value={labTestForm.parameter}
                          onChange={(e) => setLabTestForm((prev) => ({ ...prev, parameter: e.target.value }))}
                          placeholder="e.g., White Blood Cells"
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          value={labTestForm.value}
                          onChange={(e) => setLabTestForm((prev) => ({ ...prev, value: e.target.value }))}
                          placeholder="e.g., 7.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={labTestForm.unit}
                          onChange={(e) => setLabTestForm((prev) => ({ ...prev, unit: e.target.value }))}
                          placeholder="e.g., K/uL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="referenceRange">Reference Range</Label>
                        <Input
                          id="referenceRange"
                          value={labTestForm.referenceRange}
                          onChange={(e) => setLabTestForm((prev) => ({ ...prev, referenceRange: e.target.value }))}
                          placeholder="e.g., 4.0-11.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={labTestForm.status}
                          onValueChange={(value: "normal" | "high" | "low" | "critical") =>
                            setLabTestForm((prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddLabTestOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLabTest}>Add Test Result</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Lab Results List */}
              {labResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Test Results</h3>
                  {labResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{result.parameter}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.value} {result.unit} (Reference: {result.referenceRange})
                        </p>
                        <Badge
                          variant={
                            result.status === "normal"
                              ? "default"
                              : result.status === "critical"
                                ? "destructive"
                                : "secondary"
                          }
                          className="mt-1"
                        >
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={isEditLabTestOpen && currentLabTest?.id === result.id}
                          onOpenChange={(open) => {
                            setIsEditLabTestOpen(open)
                            if (!open) resetLabTestForm()
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentLabTest(result)
                                setLabTestForm({ ...result })
                                setIsEditLabTestOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Lab Test Result</DialogTitle>
                              <DialogDescription>Modify details for this lab test parameter</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label htmlFor="editParameter">Parameter</Label>
                                  <Input
                                    id="editParameter"
                                    value={labTestForm.parameter}
                                    onChange={(e) => setLabTestForm((prev) => ({ ...prev, parameter: e.target.value }))}
                                    placeholder="e.g., White Blood Cells"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editValue">Value</Label>
                                  <Input
                                    id="editValue"
                                    value={labTestForm.value}
                                    onChange={(e) => setLabTestForm((prev) => ({ ...prev, value: e.target.value }))}
                                    placeholder="e.g., 7.2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editUnit">Unit</Label>
                                  <Input
                                    id="editUnit"
                                    value={labTestForm.unit}
                                    onChange={(e) => setLabTestForm((prev) => ({ ...prev, unit: e.target.value }))}
                                    placeholder="e.g., K/uL"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editReferenceRange">Reference Range</Label>
                                  <Input
                                    id="editReferenceRange"
                                    value={labTestForm.referenceRange}
                                    onChange={(e) =>
                                      setLabTestForm((prev) => ({ ...prev, referenceRange: e.target.value }))
                                    }
                                    placeholder="e.g., 4.0-11.0"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editStatus">Status</Label>
                                  <Select
                                    value={labTestForm.status}
                                    onValueChange={(value: "normal" | "high" | "low" | "critical") =>
                                      setLabTestForm((prev) => ({ ...prev, status: value }))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditLabTestOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditLabTest}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLabTest(result.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lab Notes */}
              <div>
                <Label htmlFor="labNotes">Additional Notes</Label>
                <Textarea
                  id="labNotes"
                  value={labData.notes}
                  onChange={(e) => setLabData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional observations or notes about the test results"
                />
              </div>

              <Button
                onClick={handleUploadLabResults}
                className="w-full"
                size="lg"
                disabled={!selectedPatient || !selectedAppointment || !labData.testName || labResults.length === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Lab Results
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
