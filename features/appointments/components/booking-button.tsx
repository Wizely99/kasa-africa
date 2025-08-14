"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BookingButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/patient/book-appointment/booking");
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
