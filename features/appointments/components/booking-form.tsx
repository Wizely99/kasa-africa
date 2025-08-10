"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
    DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


import { Input } from "@/components/ui/input";
import { Schedules } from "./schedules";

// Mock doctor data for demo
const mockDoctor = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialization: "Cardiologist",
  consultationFee: 150,
  isAvailable: true,
  avatar: "/placeholder.svg"
};
export const BookingForm = ({ doctor = mockDoctor }: { doctor?: any }) => {
  

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Schedules />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
