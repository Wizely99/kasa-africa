import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




/**
 * This function takes a string of names, splits it into words, 
 * and returns the first two words joined by a plus sign ("+").
 * 
 * @param {string} name - A string containing one or more names.
 * @returns {string} - The first two names joined by a "+".
 *                     If there are fewer than two names, returns the available names.
 */
export function formatName(name: string): string {
  return name.split(" ").slice(0, 2).join("+");
}




export function getInitials(name: string): string {
  // Split the full name into words
  const nameParts = name.split(' ');

  // If there's only one name, use the first letter twice
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase() + nameParts[0].charAt(1).toUpperCase();
  }

  // Otherwise, take the first letter of the first two words
  const initials = nameParts
    .slice(0, 2) 
    .map((part) => part.charAt(0).toUpperCase()) 
    .join('');

  return initials;
}
