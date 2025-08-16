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
}: {
  doctor: { avatar?: string; name: string };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Avatar */}
      <div className="inline-block">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Image
              height={64}
              width={64}
              src={doctor.avatar || "/placeholder.svg"}
              alt={doctor.name}
              className="rounded-full size-16 transform transition duration-300 ease-in-out hover:scale-130 cursor-pointer"
            />
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
