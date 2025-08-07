"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPatients } from "../data";
import { Patient } from "../types/patient";
import { PatientDetailsDialog } from "./PatientDetailsDialog";
import { PatientSearchFilters } from "./PatientSearchFilters";
import { PatientsTable } from "./PatientsTable";
import { PatientStatsCards } from "./PatientStatsCard";



export default function PatientList() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const isDocView = view === "doctor";

  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDialog, setShowPatientDialog] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activePatients = patients.filter((p) => p.status === "Active").length;
  const totalPatients = patients.length;
  const upcomingAppointments = patients.filter((p) => p.nextAppointment).length;

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isDocView ? "My Patients" : "Patients"}
        </h1>
        <p className="text-muted-foreground">
          {isDocView
            ? "Manage your assigned patients"
            : "Manage all patients in the system"}
        </p>
      </div>

      <PatientStatsCards
        totalPatients={totalPatients}
        activePatients={activePatients}
        upcomingAppointments={upcomingAppointments}
      />

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Search and filter patients</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSearchFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
          />

          <PatientsTable
            patients={filteredPatients}
            onViewPatient={handleViewPatient}
          />
        </CardContent>
      </Card>

      <PatientDetailsDialog
        patient={selectedPatient}
        open={showPatientDialog}
        onOpenChange={setShowPatientDialog}
      />
    </div>
  );
}
