import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useGetPsychologistAvailabilityQuery } from "@/features/api/psychologistApi";
import { dateToKey } from "@/utils/dateUtils";

const BookingSection = ({
  psychologistId,
  onSelectDateTime,
  onClose,
  selectedDuration,
}) => {
  // Initialize with today's date instead of null
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    // Set to local midnight to match calendar grid dates and avoid timezone issues
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Get psychologist availability from API
  const { data: availabilityData, isLoading } =
    useGetPsychologistAvailabilityQuery(
      {
        id: psychologistId,
        duration: selectedDuration, // Pass duration to filter slots
      },
      { skip: !psychologistId }
    );

  // Convert availability data to usable format with proper timezone handling
  const schedule = useMemo(() => {
    if (!availabilityData?.availability) return {};

    const scheduleMap = {};
    availabilityData.availability.forEach((dayAvailability) => {
      try {
        // Parse date safely - handle different date formats
        let date;
        if (typeof dayAvailability.date === "string") {
          // Parse as UTC date to maintain consistency with server
          date = new Date(dayAvailability.date);
        } else {
          // If it's a Date object or timestamp
          date = new Date(dayAvailability.date);
        }

        if (!isNaN(date.getTime())) {
          // Use the UTC date components directly to avoid timezone issues
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, "0");
          const day = String(date.getUTCDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`;
          scheduleMap[dateKey] = dayAvailability.slots.map((slot) => slot.time);
        }
      } catch (error) {
        console.warn(
          "Error parsing availability date:",
          dayAvailability.date,
          error
        );
      }
    });

    return scheduleMap;
  }, [availabilityData]);

  const today = useMemo(() => {
    const d = new Date();
    // Set to local midnight to match calendar grid dates
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 3);
    return d;
  }, [today]);

  // Auto-select next available date if today has no slots (only on initial load)
  useEffect(() => {
    if (!schedule || Object.keys(schedule).length === 0 || hasUserSelectedDate)
      return;

    // Check if today has available slots
    const todayKey = dateToKey(today);
    const todaySlots = schedule[todayKey] || [];

    // Filter out past slots for today
    let availableTodaySlots = todaySlots;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    availableTodaySlots = todaySlots.filter((time) => {
      const [slotHour, slotMinute] = time
        .split(":")
        .map((num) => parseInt(num, 10));
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      // Only show slots that are at least 30 minutes in the future
      return slotTimeInMinutes > currentTimeInMinutes + 30;
    });

    // If today has available slots, keep today selected
    if (availableTodaySlots.length > 0) {
      return;
    }

    // Find next available date with slots
    let nextAvailableDate = null;
    const currentDate = new Date(today);

    // Look ahead for up to 90 days
    for (let i = 1; i <= 90; i++) {
      currentDate.setDate(today.getDate() + i);
      if (currentDate > maxDate) break;

      const dateKey = dateToKey(currentDate);
      const slotsForDay = schedule[dateKey] || [];

      if (slotsForDay.length > 0) {
        nextAvailableDate = new Date(currentDate);
        break;
      }
    }

    // If we found a date with slots, select it
    if (nextAvailableDate) {
      setSelectedDate(nextAvailableDate);
    }
  }, [schedule, today, maxDate, hasUserSelectedDate]);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Function to get filtered available slots count for a specific date
  const getFilteredSlotsCount = (date) => {
    const availableSlotsForDay = schedule[dateToKey(date)] || [];
    if (availableSlotsForDay.length === 0) return 0;

    const isToday = date.toDateString() === today.toDateString();
    if (!isToday) return availableSlotsForDay.length;

    // For today, filter out past time slots using local time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const futureSlots = availableSlotsForDay.filter((time) => {
      const [slotHour, slotMinute] = time
        .split(":")
        .map((num) => parseInt(num, 10));
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      return slotTimeInMinutes > currentTimeInMinutes + 30; // 30-minute buffer
    });

    return futureSlots.length;
  };

  const calendarGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `empty-${i}`, empty: true });
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date in local timezone to match calendar grid dates
      const date = new Date(year, month, day);
      days.push({
        key: `${year}-${month}-${day}`,
        day,
        date: date,
      });
    }
    return days;
  }, [currentMonth]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return null;
    let available = (schedule[dateToKey(selectedDate)] || []).sort();
    if (available.length === 0) return [];

    // Filter out past time slots if the selected date is today
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (isToday) {
      // Get current time in local timezone (simpler approach)
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Filter out past time slots
      available = available.filter((time) => {
        const [slotHour, slotMinute] = time
          .split(":")
          .map((num) => parseInt(num, 10));
        const slotTimeInMinutes = slotHour * 60 + slotMinute;

        // Only show slots that are at least 30 minutes in the future
        return slotTimeInMinutes > currentTimeInMinutes + 30;
      });
    }

    return {
      morning: available.filter((s) => parseInt(s.split(":")[0]) < 12),
      afternoon: available.filter(
        (s) => parseInt(s.split(":")[0]) >= 12 && parseInt(s.split(":")[0]) < 17
      ),
      evening: available.filter((s) => parseInt(s.split(":")[0]) >= 17),
    };
  }, [selectedDate, schedule, today]);

  const handlePrevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
      setSelectedTime(null);
      // Reset selected date if it's not in the new month
      if (
        selectedDate &&
        (selectedDate.getMonth() !== newMonth.getMonth() ||
          selectedDate.getFullYear() !== newMonth.getFullYear())
      ) {
        setSelectedDate(null);
      }
    }
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    const firstOfMonth = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      1
    );
    if (firstOfMonth <= maxDate) {
      setCurrentMonth(newMonth);
      setSelectedTime(null);
      // Reset selected date if it's not in the new month
      if (
        selectedDate &&
        (selectedDate.getMonth() !== newMonth.getMonth() ||
          selectedDate.getFullYear() !== newMonth.getFullYear())
      ) {
        setSelectedDate(null);
      }
    }
  };

  const handleDateSelect = (date) => {
    const isDisabled = date < today || date > maxDate;
    if (!isDisabled) {
      setSelectedDate(date);
      setSelectedTime(null);
      setHasUserSelectedDate(true); // Mark that user has manually selected a date
    }
  };

  const handleConfirm = async () => {
    if (selectedDate && selectedTime && !isBooking) {
      setIsBooking(true);
      try {
        await onSelectDateTime(selectedDate, selectedTime);
      } catch (error) {
        console.error("Booking failed:", error);
      } finally {
        setIsBooking(false);
      }
    }
  };

  const formatDisplayDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const isPrevDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();
  const isNextDisabled =
    currentMonth.getFullYear() === maxDate.getFullYear() &&
    currentMonth.getMonth() === maxDate.getMonth();

  // Show loading state while fetching availability
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[600px] overflow-y-auto animate-fade-in-up">
        <div className="grid md:grid-cols-2 gap-8 w-full min-h-full">
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec5228] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading availability...</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] overflow-y-auto animate-fade-in-up">
      <div className="grid md:grid-cols-2 gap-8 w-full min-h-full">
        {/* Calendar Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex flex-col transform transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#000080]">
              {formatDisplayDate(currentMonth)}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
                className="p-2 hover:text-[#ec5228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                disabled={isNextDisabled}
                className="p-2 hover:text-[#ec5228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-3 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-[#000080] py-3 text-sm bg-gray-50 rounded-lg"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3 min-h-[280px] content-start pb-4">
              {calendarGrid.map((dayInfo) => {
                if (dayInfo.empty) return <div key={dayInfo.key}></div>;

                const dayDate = dayInfo.date;
                const filteredSlotsCount = getFilteredSlotsCount(dayDate);
                const isDisabled = dayDate < today || dayDate > maxDate;
                const isSelected =
                  selectedDate && dayDate.getTime() === selectedDate.getTime();
                const isToday = dayDate.getTime() === today.getTime();

                return (
                  <div
                    key={dayInfo.key}
                    onClick={() => handleDateSelect(dayDate)}
                    className={`
                    relative h-12 w-full flex items-center justify-center rounded-xl transition-all duration-300 text-base font-semibold border-2 mb-3
                    ${
                      isDisabled
                        ? "text-gray-300 cursor-not-allowed border-transparent bg-gray-50"
                        : isSelected
                        ? "cursor-pointer text-[#000080] border-[#000080] bg-white shadow-lg scale-105"
                        : "cursor-pointer text-gray-700 border-gray-100 bg-white hover:border-[#000080] hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-[#000080] hover:shadow-lg hover:scale-105"
                    }
                    
                  `}
                  >
                    <span className="relative z-10">{dayInfo.day}</span>
                    {filteredSlotsCount > 0 && !isDisabled && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#ec5228] to-[#dc2626] text-white text-xs font-bold flex justify-center items-center leading-none shadow-md border-2 border-white">
                        {filteredSlotsCount}
                      </span>
                    )}
                    {filteredSlotsCount > 0 && !isDisabled && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#ec5228] to-[#dc2626] rounded-b-xl opacity-30"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Available Slots Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex flex-col transform transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#000080]">
              {selectedDate && !isNaN(selectedDate.getTime())
                ? `Available Slots for ${selectedDate.toLocaleDateString(
                    "en-IN",
                    { month: "long", day: "numeric" }
                  )}`
                : "Available Slots"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#ec5228] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {selectedDate ? (
            availableSlots && availableSlots.length === 0 ? (
              <div className="text-center text-gray-400 py-10 flex-1 flex flex-col justify-center">
                <div className="text-5xl mb-2">📭</div>
                <p>No slots scheduled for this day.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {availableSlots?.morning?.length > 0 && (
                    <div>
                      <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
                        <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
                        Morning
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.morning.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 border-2 ${
                              selectedTime === time
                                ? "bg-[#000080] text-white border-[#000080] shadow-lg transform scale-105"
                                : "bg-white text-[#000080] border-gray-200 hover:border-[#ec5228] hover:bg-[#fffae3] hover:shadow-md"
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableSlots?.afternoon?.length > 0 && (
                    <div>
                      <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
                        <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
                        Afternoon
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.afternoon.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 border-2 ${
                              selectedTime === time
                                ? "bg-[#000080] text-white border-[#000080] shadow-lg transform scale-105"
                                : "bg-white text-[#000080] border-gray-200 hover:border-[#ec5228] hover:bg-[#fffae3] hover:shadow-md"
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableSlots?.evening?.length > 0 && (
                    <div>
                      <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
                        <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
                        Evening
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.evening.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 border-2 ${
                              selectedTime === time
                                ? "bg-[#000080] text-white border-[#000080] shadow-lg transform scale-105"
                                : "bg-white text-[#000080] border-gray-200 hover:border-[#ec5228] hover:bg-[#fffae3] hover:shadow-md"
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime || isBooking}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedDate && selectedTime && !isBooking
                        ? "bg-[#ec5228] text-white hover:bg-[#d94720] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isBooking && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    )}
                    {isBooking
                      ? "Please Wait..."
                      : selectedDate && selectedTime
                      ? "Book Appointment"
                      : "Select Date & Time"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 flex-1 flex flex-col justify-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#fffae3] to-[#f0f9ff] rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#ec5228]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4M8 7H5l1 12h12l1-12h-3"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-[#000080] mb-2">
                Select a Date
              </h4>
              <p className="text-gray-400">
                Choose a date from the calendar to view available time slots
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BookingSection.propTypes = {
  psychologistId: PropTypes.string.isRequired,
  onSelectDateTime: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BookingSection;
