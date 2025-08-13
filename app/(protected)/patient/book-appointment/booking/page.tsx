import BookingPage from "@/features/booking/pages/Booking";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
};

export default page;
