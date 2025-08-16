"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Doctors } from "../types/data";
interface BookingButtonProps {
  doctor: Doctors;
}

export default function BookingButton({ doctor }: BookingButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/patient/book-appointment/booking?doctorId=${doctor.id}`);
  };

  return (
    <Button
      onClick={handleClick}
      className="px-2 py-1 bg-blue-600 text-white rounded-md cursor-pointer"
    >
      Book Appointment
    </Button>
  );
}
