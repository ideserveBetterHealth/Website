// Helper functions for buffer calculation
export const subtractMinutesFromTime = (timeString, minutesToSubtract) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  totalMinutes -= minutesToSubtract;

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Handle midnight crossing
  }

  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

export const addMinutesToTime = (timeString, minutesToAdd) => {
  // 1. Parse the string and convert to total minutes
  const [hours, minutes] = timeString.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;

  // 2. Perform the calculation (addition)
  totalMinutes += minutesToAdd;

  // 3. Convert back to "HH:MM" format
  // The modulo operator (%) handles rollover past midnight automatically
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  // Format with leading zeros to ensure "HH:MM"
  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

// Calculate buffer slots based on service type and duration
export const calculateBufferSlots = (meetingTime, duration, doctorType) => {
  const buffer = [];
  const durationNum = parseInt(duration, 10);

  if (doctorType?.toLowerCase().includes("psychologist")) {
    if (durationNum === 50) {
      buffer.push(subtractMinutesFromTime(meetingTime, 30));
      buffer.push(addMinutesToTime(meetingTime, 30));
    } else if (durationNum === 80) {
      buffer.push(subtractMinutesFromTime(meetingTime, 30));
      buffer.push(addMinutesToTime(meetingTime, 30));
      buffer.push(addMinutesToTime(meetingTime, 60));
    }
  } else if (doctorType?.toLowerCase().includes("cosmetologist")) {
    buffer.push(subtractMinutesFromTime(meetingTime, 30));
    buffer.push(addMinutesToTime(meetingTime, 30));
  }

  return buffer;
};
