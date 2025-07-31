import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes while handling conditional class names.
 * @param inputs - Class values to be merged.
 * @returns A merged and optimized class string.
 * 
 * ⚠️ ALERT: Do not move this function as it is used by ShadCN UI.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
