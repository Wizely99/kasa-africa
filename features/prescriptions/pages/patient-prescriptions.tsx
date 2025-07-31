"use client"

import { useState, useEffect } from "react"
import { Pill, User, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getPatientPrescriptionsAction,
  getPatientLabResultsAction,
  getPatientDiagnosesAction,
} from "@/features/prescriptions/actions/prescription-actions"

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [labResults, setLabResults] = useState<any[]>([])
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionsRes, labResultsRes, diagnosesRes] = await Promise.all([
          getPatientPrescriptionsAction("patient-1"),
          getPatientLabResultsAction("patient-1"),
          getPatientDiagnosesAction("patient-1"),
        ])

        if (prescriptionsRes.success) setPrescriptions(prescriptionsRes.data)
        if (labResultsRes.success) setLabResults(labResultsRes.data)
        if (diagnosesRes.success) setDiagnoses(diagnosesRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">Loading your medical information...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">View your prescriptions, lab results, and diagnoses</p>
      </div>

      <Tabs defaultValue="prescriptions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results ({labResults.length})</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses ({diagnoses.length})</TabsTrigger>
        </TabsList>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No prescriptions found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5" />
                          Prescription from {prescription.doctorName}
                        </CardTitle>
                        <CardDescription>
                          Issued on {new Date(prescription.dateIssued).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                        {prescription.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Diagnosis</h4>
                      <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Medications</h4>
                      <div className="space-y-3">
                        {prescription.medications.map((medication: any) => (
                          <div key={medication.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium">{medication.medicationName}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {medication.dosage} • {medication.frequency} • {medication.duration}
                                </p>
                                {medication.instructions && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <strong>Instructions:</strong> {medication.instructions}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm">
                                <p>Qty: {medication.quantity}</p>
                                <p>Refills: {medication.refills}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prescription.instructions && (
                      <div>
                        <h4 className="font-semibold mb-2">General Instructions</h4>
                        <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Valid until: {new Date(prescription.validUntil).toLocaleDateString()}</span>
                      {prescription.refillsRemaining && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {prescription.refillsRemaining} refills remaining
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lab Results Tab */}
        <TabsContent value="lab-results" className="space-y-4">
          {labResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No lab results found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {labResults.map((labResult) => (
                <Card key={labResult.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {labResult.testName}
                        </CardTitle>
                        <CardDescription>
                          {labResult.testType} • Completed on {new Date(labResult.dateCompleted).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={labResult.status === "completed" ? "default" : "secondary"}>
                        {labResult.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Test Results</h4>
                      <div className="space-y-2">
                        {labResult.results.map((result: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h5 className="font-medium">{result.parameter}</h5>
                              <p className="text-sm text-muted-foreground">Reference: {result.referenceRange}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {result.value} {result.unit}
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
                          </div>
                        ))}
                      </div>
                    </div>

                    {labResult.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground">{labResult.notes}</p>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Ordered on: {new Date(labResult.dateOrdered).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Diagnoses Tab */}
        <TabsContent value="diagnoses" className="space-y-4">
          {diagnoses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No diagnoses found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {diagnoses.map((diagnosis) => (
                <Card key={diagnosis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {diagnosis.primaryDiagnosis}
                        </CardTitle>
                        <CardDescription>
                          Diagnosed on {new Date(diagnosis.dateCreated).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            diagnosis.severity === "mild"
                              ? "default"
                              : diagnosis.severity === "moderate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {diagnosis.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{diagnosis.status.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {diagnosis.secondaryDiagnoses.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Secondary Diagnoses</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.secondaryDiagnoses.map((secondary: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {secondary}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosis.symptoms.map((symptom: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Treatment Plan</h4>
                      <p className="text-sm text-muted-foreground">{diagnosis.treatmentPlan}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Follow-up Instructions</h4>
                      <p className="text-sm text-muted-foreground">{diagnosis.followUpInstructions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
