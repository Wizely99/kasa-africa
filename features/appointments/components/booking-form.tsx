"use client";

import { useRouter } from "next/navigation";

export default function BookingButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/patient/book-appointment/booking");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Book Appointment
    </button>
  );
}
