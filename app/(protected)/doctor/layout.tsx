import type { Metadata } from "next";
import type React from "react";
import { DoctorLayoutClient } from "./doctor-layout";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "Doctor dashboard for the healthcare management system.",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoctorLayoutClient>{children}</DoctorLayoutClient>;
}
