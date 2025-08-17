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
      disabled={!doctor.isAvailable}
      className={`px-2 py-1 rounded-md text-white ${
        doctor.isAvailable
          ? "bg-blue-600 cursor-pointer"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      size="sm"
    >
      {doctor.isAvailable ? "Book now" : "Unavailable"}
    </Button>
  );
}
