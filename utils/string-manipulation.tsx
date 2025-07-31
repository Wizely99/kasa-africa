export const toSnakeCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toUpperCase();
  };

  

  export function formatToTitleCase(name: string): string {
    return name
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase/PascalCase
        .replace(/[_-]/g, " ") // Replace underscores or dashes with spaces
        .toLowerCase() // Convert everything to lowercase
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}

export function minimizeString(str:string, maxLength:number = 70) {
  if (str.length <= maxLength) {
    return str;  // No change needed if string is already short enough
  }
  const splitLength=Math.floor(maxLength/2)-2;

  const start = str.slice(0,splitLength);  // First 5 characters
  const end = str.slice(-splitLength);      // Last 5 characters
  return `${start}...${end}`;     // Combine start, ellipsis, and end
}

/**
 * Converts a string or an array of strings into a safe displayable string.
 * 
 * - If a single string is provided, it returns the string as-is.
 * - If an array of strings is provided, it joins them with a comma and space.
 * - If the input is null or undefined, it returns an empty string.
 * 
 * @param value - A string or an array of strings, or null/undefined.
 * @returns A string suitable for display.
 */
export function toSafeString(value: string | number | string[] | null | undefined): string {
  if (value == null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

