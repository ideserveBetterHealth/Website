/**
 * Utility functions for handling dates consistently across the application
 * to avoid timezone-related issues when communicating with the backend.
 */

/**
 * Formats a date for API communication without timezone issues
 * @param {Date|string} date - The date to format (can be Date object or ISO string)
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const formatDateForAPI = (date) => {
  // Handle both Date objects and ISO strings
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Create a new date in UTC to avoid timezone issues
  const utcDate = new Date(
    dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
  );
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utcDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Creates a date key for mapping availability data
 * @param {Date} date - The date to convert to key
 * @returns {string} - Date key in YYYY-MM-DD format
 */
export const dateToKey = (date) => {
  return formatDateForAPI(date);
};

/**
 * Parses date from API response without timezone issues
 * @param {string|Date} dateString - The date string from API
 * @returns {Date} - Local date object
 */
export const parseDateFromAPI = (dateString) => {
  // If it's already a Date object, return as is
  if (dateString instanceof Date) return dateString;

  // Parse the date string and ensure we get the correct local date
  const date = new Date(dateString);
  // If the date seems to be in UTC but we want local date, adjust it
  if (dateString.includes("T") && dateString.includes("Z")) {
    // This is an ISO string in UTC, convert to local date
    const localDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    return localDate;
  }
  return date;
};
