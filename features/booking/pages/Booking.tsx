"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AppointmentSummary } from "../components/AppointmentSummary";
import { PaymentMethods } from "../components/PaymentMethods";
import { SlotButton } from "../components/SlotButton";
import { Stepper } from "../components/Stepper";
import { mockDoctors } from "@/features/appointments/types/data";
import Image from "next/image";

// Types
type LocalTime = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};
type SlotType = "REGULAR" | "EMERGENCY" | "FOLLOW_UP";
type Slot = {
  id: string;
  doctorId: string;
  slotDate: string;
  startTime: LocalTime;
  endTime: LocalTime;
  isAvailable: boolean;
  slotType: SlotType;
  createdAt: string;
  updatedAt: string;
};
type AppointmentType = "IN_PERSON" | "VIRTUAL";
type AppointmentStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

type AppointmentPayload = {
  patientId: string;
  doctorId: string;
  facilityId: string;
  appointmentDate: string;
  startTime: LocalTime;
  endTime: LocalTime;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint: string;
  notes: string;
};
type AppointmentResponse = AppointmentPayload & { id: string };

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}
function timeObjToHHmm(t: LocalTime) {
  return `${pad2(t.hour)}:${pad2(t.minute)}`;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams?.get("doctorId");
  // Step control
  const [step, setStep] = useState<number>(1);

  // Step 1 state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const selectedDoctor = useMemo(() => {
    return mockDoctors.find((doctor) => doctor.id === doctorId) || null;
  }, [doctorId]);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Step 2 state
  const [patientId, setPatientId] = useState<string>(
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  );
  const [facilityId, setFacilityId] = useState<string>(
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  );
  const [appointmentType, setAppointmentType] =
    useState<AppointmentType>("IN_PERSON");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Step 3 state (payment)
  type PaymentMethod = "CARD" | "MOBILE_MONEY" | "CASH";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [paying, setPaying] = useState<boolean>(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);

  // Card fields
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");

  // Mobile money fields
  const [mmNetwork, setMmNetwork] = useState<string>("MTN");
  const [mmPhone, setMmPhone] = useState<string>("");

  // Step 4 state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdAppointment, setCreatedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId]
  );
  const selectedDateStr = useMemo(
    () => (selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""),
    [selectedDate]
  );
  const [seconds, setSeconds] = useState(5);

  // Fetch slots
  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    let aborted = false;
    async function load() {
      setLoadingSlots(true);
      setSelectedSlotId(null);
      try {
        const query = new URLSearchParams({
          date: selectedDateStr,
          doctorId: doctorId ?? "",
        });
        const res = await fetch(`/api/slots?${query.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load slots");
        const data: Slot[] = await res.json();
        if (!aborted) setSlots(data);
      } catch (e: unknown) {
        if (!aborted) {
          setSlots([]);
          toast("Unable to load slots", {
            description: e instanceof Error ? e.message : "Please try again.",
          });
        }
      } finally {
        if (!aborted) setLoadingSlots(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [selectedDateStr, doctorId, selectedDate]);

  // Validation per step
  const canGoNextFromStep1 = Boolean(
    selectedDate && selectedSlotId && doctorId
  );
  const canGoNextFromStep2 = Boolean(
    patientId &&
      facilityId &&
      appointmentType &&
      chiefComplaint.trim().length > 0
  );
  const canGoNextFromStep3 = paymentConfirmed;

  const goNext = () => {
    if (step === 1 && !canGoNextFromStep1) return;
    if (step === 2 && !canGoNextFromStep2) return;
    if (step === 3 && !canGoNextFromStep3) return;
    setStep((s) => Math.min(s + 1, 4));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePay = async () => {
    // Basic per-method validation
    if (paymentMethod === "CARD") {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
        toast.error("Payment details required", {
          description: "Fill all card fields.",
        });
        return;
      }
    } else if (paymentMethod === "MOBILE_MONEY") {
      if (!mmPhone || !mmNetwork) {
        toast.error("Payment details required", {
          description: "Provide mobile money phone and network.",
        });
        return;
      }
    }

    setPaying(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: paymentMethod,
          amount: 50_00,
          currency: "USD",
          card:
            paymentMethod === "CARD"
              ? {
                  name: cardName,
                  number: cardNumber,
                  exp: cardExpiry,
                  cvc: cardCvc,
                }
              : undefined,
          mobileMoney:
            paymentMethod === "MOBILE_MONEY"
              ? { network: mmNetwork, phone: mmPhone }
              : undefined,
        }),
      });
      if (!res.ok) throw new Error("Payment failed");
      const data = await res.json();
      if (data?.status === "succeeded") {
        setPaymentConfirmed(true);
        toast.success("Payment successful", {
          description: "Your payment has been confirmed.",
        });
      } else {
        throw new Error("Payment did not succeed");
      }
    } catch (e: unknown) {
      toast.error("Payment error", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setPaying(false);
    }
  };

  const handleCashReserve = async () => {
    // For cash, we simulate reservation approval so user can proceed.
    setPaying(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "CASH",
          amount: 50_00,
          currency: "USD",
        }),
      });
      if (!res.ok) throw new Error("Reservation failed");
      const data = await res.json();
      if (data?.status === "succeeded") {
        setPaymentConfirmed(true);
        toast.success("Reserved", {
          description: "Payment will be completed at the facility.",
        });
      } else {
        throw new Error("Reservation did not succeed");
      }
    } catch (e: unknown) {
      toast.error("Error", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setPaying(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDateStr || !selectedSlot || !patientId || !facilityId) return;
    setSubmitting(true);
    const payload: AppointmentPayload = {
      patientId,
      doctorId: doctorId ?? "",
      facilityId,
      appointmentDate: selectedDateStr,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      appointmentType,
      status: "SCHEDULED",
      chiefComplaint,
      notes,
    };
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create appointment");
      const created: AppointmentResponse = await res.json();
      setCreatedAppointment(created);
      setBookingConfirmed(true);
      toast.success("Booking confirmed", {
        description: "Your appointment has been scheduled.",
      });
    } catch (e: unknown) {
      toast.error("Booking failed", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (bookingConfirmed && createdAppointment) {
      const countdown = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      const redirect = setTimeout(() => {
        window.location.href = `/patient/appointments`;
      }, 4000);

      return () => {
        clearInterval(countdown);
        clearTimeout(redirect);
      };
    }
  }, [bookingConfirmed, createdAppointment]);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Follow the steps to schedule your visit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper current={step} />

          {step === 1 && (
            <section aria-labelledby="step-1">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  {selectedDoctor ? (
                    <>
                      <Image
                        width={15}
                        height={15}
                        src={selectedDoctor.avatar}
                        alt={selectedDoctor.name}
                        className="size-15 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{selectedDoctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDoctor.specialization}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No doctor selected</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 mt-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <div className="rounded-md border mt-3 ">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full rounded-md padding-2"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </div>
                  {/* <p className="text-sm text-muted-foreground">
                    <CalendarDays className="mr-1 inline h-4 w-4" />
                    {selectedDate
                      ? `Selected: ${format(selectedDate, "yyyy,MM,dd")}`
                      : "No date selected"}
                  </p> */}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      Available time slots
                    </h3>
                    {loadingSlots ? (
                      <Badge variant="outline" className="gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {slots.filter((s) => s.isAvailable).length} available
                      </Badge>
                    )}
                  </div>

                  <div className="min-h-[120px] rounded-md border p-3">
                    {loadingSlots ? (
                      <div className="flex h-[100px] items-center justify-center text-muted-foreground">
                        Loading slots...
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex h-[100px] items-center justify-center text-muted-foreground">
                        No slots available for this date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        {slots.map((slot) => {
                          const label = `${timeObjToHHmm(
                            slot.startTime
                          )} - ${timeObjToHHmm(slot.endTime)}`;
                          const selected = selectedSlotId === slot.id;
                          return (
                            <SlotButton
                              key={slot.id}
                              label={label}
                              selected={selected}
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedSlotId(slot.id)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section
              aria-labelledby="step-2"
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-id">Patient ID</Label>
                  <Input
                    id="patient-id"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Select value={facilityId} onValueChange={setFacilityId}>
                    <SelectTrigger id="facility">
                      <SelectValue placeholder="Choose facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3fa85f64-5717-4562-b3fc-2c963f66afa6">
                        Main Hospital
                      </SelectItem>
                      <SelectItem value="f2f2f2f2-1234-5678-9999-121212121212">
                        Satellite Clinic
                      </SelectItem>
                      <SelectItem value="0a0a0a0a-bb11-cc22-dd33-ee44ee44ee44">
                        Telehealth
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appt-type">Appointment Type</Label>
                  <Select
                    value={appointmentType}
                    onValueChange={(v) =>
                      setAppointmentType(v as AppointmentType)
                    }
                  >
                    <SelectTrigger id="appt-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PERSON">In person</SelectItem>
                      <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Chief Complaint</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Describe the main reason for your visit"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes for the clinician"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="md:col-span-2 rounded-md border p-4 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {selectedDateStr
                      ? format(new Date(selectedDateStr), "yyyy,MM,dd")
                      : "No date"}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedSlot
                      ? `${timeObjToHHmm(
                          selectedSlot.startTime
                        )} - ${timeObjToHHmm(selectedSlot.endTime)}`
                      : "No time"}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Doctor: {doctorId?.slice(0, 6)}...
                  </Badge>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section
              aria-labelledby="step-3"
              className="grid gap-6 lg:grid-cols-2"
            >
              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paying={paying}
                paymentConfirmed={paymentConfirmed}
                handlePay={handlePay}
                handleCashReserve={handleCashReserve}
                cardName={cardName}
                setCardName={setCardName}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                mmNetwork={mmNetwork}
                setMmNetwork={setMmNetwork}
                mmPhone={mmPhone}
                setMmPhone={setMmPhone}
                setPaymentConfirmed={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />

              <AppointmentSummary
                selectedDateStr={selectedDateStr}
                selectedSlot={selectedSlot}
                doctorId={doctorId}
                facilityId={facilityId}
                patientId={patientId}
                paymentMethod={paymentMethod}
                mmNetwork={mmNetwork}
              />
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="step-4" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Appointment Summary
                    </CardTitle>
                    <CardDescription>
                      Review your booking details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Date</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedDateStr
                            ? format(new Date(selectedDateStr), "yyyy,MM,dd")
                            : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Time</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedSlot
                            ? `${timeObjToHHmm(
                                selectedSlot.startTime
                              )} - ${timeObjToHHmm(selectedSlot.endTime)}`
                            : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Stethoscope className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Doctor</div>
                        <div className="text-sm text-muted-foreground">
                          {doctorId?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Facility</div>
                        <div className="text-sm text-muted-foreground">
                          {facilityId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Patient</div>
                        <div className="text-sm text-muted-foreground">
                          {patientId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Payment</CardTitle>
                    <CardDescription>Billing overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Consultation Fee</span>
                      <span className="font-medium">$50.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Payment Method</span>
                      <span className="text-muted-foreground">
                        {paymentMethod === "CARD" && "Card"}
                        {paymentMethod === "MOBILE_MONEY" &&
                          `Mobile Money (${mmNetwork})`}
                        {paymentMethod === "CASH" && "Cash at facility"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      <Badge
                        variant={paymentConfirmed ? "outline" : "destructive"}
                        className="gap-1"
                      >
                        {paymentConfirmed ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" /> Paid
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {createdAppointment ? (
                <div className="rounded-md border bg-emerald-50 p-4 text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <div className="font-medium">Appointment Confirmed</div>
                  </div>
                  <div className="mt-2 text-sm">
                    Appointment ID:
                    <span className="font-mono">{createdAppointment.id}</span>
                  </div>
                  <div className="mt-2 text-sm ">
                    You will be redirected to your appointment page in{" "}
                    <span className="font-bold">{seconds}</span> seconds...
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={!paymentConfirmed || submitting}
                    className="gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Confirm booking
                  </Button>
                  {!paymentConfirmed && (
                    <span className="text-sm text-muted-foreground">
                      Complete payment to proceed.
                    </span>
                  )}
                </div>
              )}
            </section>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={goNext}
            disabled={
              (step === 1 && !canGoNextFromStep1) ||
              (step === 2 && !canGoNextFromStep2) ||
              (step === 3 && !canGoNextFromStep3) ||
              step === 4
            }
            className={cn(step < 4 ? "" : "pointer-events-none opacity-50")}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
