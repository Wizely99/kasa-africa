import { type NextRequest, NextResponse } from "next/server";

type LocalTime = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

type Slot = {
  id: string;
  doctorId: string;
  slotDate: string; // YYYY-MM-DD
  startTime: LocalTime;
  endTime: LocalTime;
  isAvailable: boolean;
  slotType: "REGULAR";
  createdAt: string;
  updatedAt: string;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function time(h: number, m: number): LocalTime {
  return { hour: h, minute: m, second: 0, nano: 0 };
}

function addMinutes(t: LocalTime, minutes: number): LocalTime {
  const total = t.hour * 60 + t.minute + minutes;
  const hour = Math.floor(total / 60) % 24;
  const minute = total % 60;
  return { hour, minute, second: 0, nano: 0 };
}

// Assume a function to check booked slots. In a real app, this would be a DB query.
const bookedSlots = new Set<string>(); // Stores booked slot IDs

function isBooked(slotId: string): boolean {
  // In a real application, you would check a database for booked slots.
  // For this example, we'll simulate a few booked slots.
  const sampleBookedIds = new Set([
    "some-booked-slot-id-1",
    "some-booked-slot-id-2",
  ]);
  return sampleBookedIds.has(slotId) || bookedSlots.has(slotId);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD
  const doctorId = searchParams.get("doctorId");

  if (!date || !doctorId) {
    return NextResponse.json(
      { error: "Missing date or doctorId" },
      { status: 400 }
    );
  }

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const slots: Slot[] = [];
  const numberOfSlots = Math.floor(Math.random() * 2) + 4; // 4 or 5 slots
  const dailyStart = time(8, 0); // Start time at 8:00 AM
  const dailyEnd = time(17, 0); // End time at 5:00 PM
  let currentTime = { ...dailyStart };

  for (let i = 0; i < numberOfSlots; i++) {
    // Generate a random duration between 60 and 210 minutes, in 30-minute increments
    const slotDuration =
      Math.floor(Math.random() * ((180 - 60) / 30 + 1)) * 30 + 60;
    
    const start = { ...currentTime };
    const end = addMinutes(start, slotDuration);

    // If the slot's end time exceeds the daily end time, break the loop
    if (end.hour > dailyEnd.hour || (end.hour === dailyEnd.hour && end.minute > dailyEnd.minute)) {
      break;
    }

    const id = crypto.randomUUID();
    let isAvailable = true;

    // Simple availability rule based on a hash
    const key = `${date}-${pad2(start.hour)}:${pad2(start.minute)}-${doctorId.slice(0, 4)}`;
    const hash = Array.from(key).reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0
    );
    if (hash % 3 === 0) {
      isAvailable = false;
    }

    // Rule 1: Mark slots as unavailable if they are in the past today
    if (date === todayDateString) {
      if (
        start.hour < currentHour ||
        (start.hour === currentHour && start.minute < currentMinute)
      ) {
        isAvailable = false;
      }
    }

    // Rule 2: Mark slots as unavailable if they are booked
    if (isBooked(id)) {
      isAvailable = false;
    }

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
    });

    // Add a random gap of 15, 30, or 45 minutes before the next slot
    const gapDuration = Math.floor(Math.random() * 3) * 15 + 45;
    currentTime = addMinutes(end, gapDuration);

    // Check if the next slot would go past the daily end time
    if (currentTime.hour > dailyEnd.hour ||
       (currentTime.hour === dailyEnd.hour && currentTime.minute > dailyEnd.minute)) {
      break;
    }
  }

  return NextResponse.json(slots);
}