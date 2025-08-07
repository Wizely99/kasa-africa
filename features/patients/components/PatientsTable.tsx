import {
  Eye,
  Calendar,
  MessageSquare,
  Pill,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Patient } from "./types";

interface PatientsTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
}

export function PatientsTable({ patients, onViewPatient }: PatientsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={patient.avatar || "/placeholder.svg"}
                    alt={patient.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {patient.id}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{patient.age} years</div>
                  <div className="text-sm text-muted-foreground">
                    {patient.gender}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{patient.condition}</Badge>
              </TableCell>
              <TableCell>{patient.lastVisit}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    patient.status === "Active" ? "default" : "secondary"
                  }
                >
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewPatient(patient)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pill className="mr-2 h-4 w-4" />
                      Add Prescription
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
