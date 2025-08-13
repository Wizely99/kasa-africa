import { type NextRequest, NextResponse } from "next/server"

type LocalTime = {
  hour: number
  minute: number
  second: number
  nano: number
}

type AppointmentPayload = {
  patientId: string
  doctorId: string
  facilityId: string
  appointmentDate: string // YYYY-MM-DD
  startTime: LocalTime
  endTime: LocalTime
  appointmentType: "IN_PERSON" | "VIRTUAL"
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
  chiefComplaint: string
  notes: string
}

export async function POST(req: NextRequest) {
  try {
    const payload: AppointmentPayload = await req.json()

    // Basic validation
    if (
      !payload.patientId ||
      !payload.doctorId ||
      !payload.facilityId ||
      !payload.appointmentDate ||
      !payload.startTime ||
      !payload.endTime
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Simulate persistence and echo back with an ID
    const response = {
      id: crypto.randomUUID(),
      ...payload,
    }

    return NextResponse.json(response, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }
}
