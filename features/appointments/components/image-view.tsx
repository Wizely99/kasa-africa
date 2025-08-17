"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed

export default function DoctorAvatar({
  doctor,
}: Readonly<{
  doctor: { avatar?: string; name: string };
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Avatar */}
      <div className="inline-block">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src={doctor.avatar || "/placeholder.svg"}
                alt={doctor.name}
                fill
                className="rounded-full object-cover transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer"
              />
            </div>
          </DialogTrigger>

          <DialogContent className="p-0 max-w-md">
            <div className="relative">
              <Image
                src={doctor.avatar || "/placeholder.svg"}
                alt={doctor.name}
                width={400}
                height={400}
                className="rounded-md object-cover"
              />
              <DialogClose asChild>
                <button className="absolute top-2 right-2 text-white text-xl font-bold">
                  &times;
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
