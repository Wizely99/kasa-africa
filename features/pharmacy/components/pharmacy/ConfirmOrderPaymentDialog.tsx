"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderConfirmationDialog({
  open,
  onOpenChange,
}: OrderConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            {/* Animated Backdrop */}
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 2 }, // 2s delay before fade out
                }}
              />
            </DialogOverlay>

            {/* Animated Content */}
            <DialogContent className="sm:max-w-[425px] p-0 border-0 bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                  transition: { duration: 0.25, delay: 2 }, // 2s delay before exit
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-background rounded-lg p-6 shadow-lg"
              >
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Order Confirmation
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium">
                    Order placed successfully!
                  </p>
                  <p className="text-muted-foreground">
                    You will receive a confirmation email shortly.
                  </p>
                  <Button className="mt-4" onClick={() => onOpenChange(false)}>
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
