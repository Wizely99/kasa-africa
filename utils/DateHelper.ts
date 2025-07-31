export class DateHelper {
  /**
   * Formats a date string to "MMM dd, yyyy" (e.g., "Dec 31, 2025")
   * @param dateString ISO date string or Date object
   * @returns Formatted date string
   */
  static formatDate(dateString: string | Date): string {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  /**
   * Formats a date string to "MMM dd, yyyy HH:mm" (e.g., "Dec 31, 2025 23:59")
   * @param dateString ISO date string or Date object
   * @returns Formatted date-time string
   */
  static formatDateTime(dateString: string | Date): string {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false // Uses 24-hour format
    });
  }

  /**
   * Calculates the percentage of time passed between two dates
   * @param startDate Start date (string or Date)
   * @param endDate End date (string or Date)
   * @returns Percentage of time covered (0 to 100)
   */
  static getTimeCoveredPercentage(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === "string" ? new Date(startDate).getTime() : startDate.getTime();
    const end = typeof endDate === "string" ? new Date(endDate).getTime() : endDate.getTime();
    const now = Date.now();

    if (now < start) return 0; // Before the start date
    if (now > end) return 100; // After the end date

    const percent = ((now - start) / (end - start)) * 100;
    return Math.floor(percent ); // Round to 2 decimal places
  }
}
