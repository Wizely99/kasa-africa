import { type NextRequest, NextResponse } from "next/server"

type LocalTime = {
  hour: number
  minute: number
  second: number
  nano: number
}

type Slot = {
  id: string
  doctorId: string
  slotDate: string // YYYY-MM-DD
  startTime: LocalTime
  endTime: LocalTime
  isAvailable: boolean
  slotType: "REGULAR"
  createdAt: string
  updatedAt: string
}

function pad2(n: number) {
  return n.toString().padStart(2, "0")
}

function time(h: number, m: number): LocalTime {
  return { hour: h, minute: m, second: 0, nano: 0 }
}

function addMinutes(t: LocalTime, minutes: number): LocalTime {
  const total = t.hour * 60 + t.minute + minutes
  const hour = Math.floor(total / 60) % 24
  const minute = total % 60
  return { hour, minute, second: 0, nano: 0 }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date") // YYYY-MM-DD
  const doctorId = searchParams.get("doctorId")

  if (!date || !doctorId) {
    return NextResponse.json({ error: "Missing date or doctorId" }, { status: 400 })
  }

  // Generate example slots from 09:00 to 17:00, every 30 minutes
  const startH = 9
  const endH = 17
  const SLOT_MINUTES = 30

  const slots: Slot[] = []
  for (let h = startH; h < endH; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const start = time(h, m)
      const end = addMinutes(start, SLOT_MINUTES)
      const id = crypto.randomUUID()
      // Simple availability rule: mark some as unavailable to demonstrate UI
      const key = `${date}-${pad2(h)}:${pad2(m)}-${doctorId.slice(0, 4)}`
      const hash = Array.from(key).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
      const isAvailable = hash % 3 !== 0

      slots.push({
        id,
        doctorId,
        slotDate: date,
        startTime: start,
        endTime: end,
        isAvailable,
        slotType: "REGULAR",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json(slots)
}
