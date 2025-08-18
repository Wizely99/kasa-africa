"use client";

import {
  Building2,
  CalendarDays,
  Clock,
  CreditCard,
  Stethoscope,
  User,
} from "lucide-react";

type AppointmentSummaryProps = {
  selectedDateStr: string;
  selectedSlot: {
    startTime: { hour: number; minute: number };
    endTime: { hour: number; minute: number };
  } | null;
  doctorId: string;
  doctorName?: string;
  facilityName?: string;
  patientName: string;
  paymentMethod: string;
  mmNetwork?: string;
  facilityAddress?: string;
};

export function AppointmentSummary({
  selectedDateStr,
  selectedSlot,
  doctorName,
  facilityAddress,
  facilityName,
  paymentMethod,
  mmNetwork,
}: AppointmentSummaryProps) {
  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="text-sm text-muted-foreground">Summary</div>
      <div className="grid gap-3 text-sm">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Date</div>
            <div className="text-muted-foreground">
              {selectedDateStr
                ? new Date(selectedDateStr).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date selected"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Time</div>
            <div className="text-muted-foreground">
              {selectedSlot
                ? `${formatTime(selectedSlot.startTime)} - ${formatTime(
                    selectedSlot.endTime
                  )}`
                : "No time selected"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Stethoscope className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Doctor Name</div>

            <div className="text-muted-foreground">{doctorName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Facility</div>
            {/* <div className="text-muted-foreground">
              {facilityId.slice(0, 8)}...
            </div> */}
            <div className="text-muted-foreground">{facilityName}</div>
            {facilityAddress && (
              <div className="text-xs text-muted-foreground">
                {facilityAddress}
              </div>
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Patient</div>
             <div className="text-muted-foreground">
              {patientId.slice(0, 8)}...
            </div> 
          </div>
        </div> */}
        <div className="flex items-center gap-3">
          <CreditCard className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Payment</div>
            <div className="text-muted-foreground">
              {paymentMethod === "CARD" && "Card"}
              {paymentMethod === "MOBILE_MONEY" &&
                `Mobile Money (${mmNetwork})`}
              {paymentMethod === "CASH" && "Cash at facility"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(time: { hour: number; minute: number }) {
  return `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;
}
