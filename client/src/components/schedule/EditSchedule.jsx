import { useMemo } from "react";
import { Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { dateToKey } from "@/utils/dateUtils";

// --- Constants ---
const DAY_NAMES_PLURAL = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
];

const generateAllTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }
  return slots;
};

const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const EditSchedule = ({
  selectedDate,
  schedule,
  bookedSlots,
  bufferSlots,
  slotDetails,
  onScheduleChange,
  onBulkUpdate,
  isUpdating,
}) => {
  const allTimeSlots = useMemo(() => generateAllTimeSlots(), []);
  const dayName = selectedDate
    ? DAY_NAMES_PLURAL[selectedDate.getDay()]
    : "Day";

  // Memoize derived data to prevent unnecessary re-renders
  const dateKey = useMemo(
    () => (selectedDate ? dateToKey(selectedDate) : null),
    [selectedDate]
  );
  const enabledSlots = useMemo(
    () => (dateKey ? schedule[dateKey] || [] : []),
    [schedule, dateKey]
  );
  const bookedSlotsForDay = useMemo(
    () => (dateKey ? bookedSlots[dateKey] || [] : []),
    [bookedSlots, dateKey]
  );
  const bufferSlotsForDay = useMemo(
    () => (dateKey ? bufferSlots[dateKey] || [] : []),
    [bufferSlots, dateKey]
  );
  const slotDetailsForDay = useMemo(
    () => (dateKey ? slotDetails?.[dateKey] || {} : {}),
    [slotDetails, dateKey]
  );

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-[#000080] mb-4">
          Edit Schedule
        </h3>
        <div className="text-center text-gray-400 py-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#fffae3] to-[#f0f9ff] rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-[#ec5228]" />
          </div>
          <h4 className="text-lg font-semibold text-[#000080] mb-2">
            Select a Date
          </h4>
          <p className="text-gray-400">
            Choose a date from the calendar to edit its schedule
          </p>
        </div>
      </div>
    );
  }

  const slotsToDisplay = allTimeSlots.filter((time) => {
    const [h, m] = time.split(":").map(Number);
    // Hide sleeping slots (12:00 AM to 5:30 AM)
    const isSleepingSlot = (h === 0 && m >= 0) || (h > 0 && h < 6); // 01:00 to 05:30
    return !isSleepingSlot;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-[#000080]">
          Edit Schedule for{" "}
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onBulkUpdate("day")}
            disabled={isUpdating}
            variant="outline"
            className="text-sm font-semibold text-[#000080] bg-blue-100 hover:bg-blue-200 border-blue-200 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : `Apply to all ${dayName}`}
          </Button>
          <Button
            onClick={() => onBulkUpdate("week")}
            disabled={isUpdating}
            variant="outline"
            className="text-sm font-semibold text-[#000080] bg-blue-100 hover:bg-blue-200 border-blue-200 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Apply to Week"}
          </Button>
          <Button
            onClick={() => onBulkUpdate("month")}
            disabled={isUpdating}
            variant="outline"
            className="text-sm font-semibold text-[#000080] bg-blue-100 hover:bg-blue-200 border-blue-200 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Apply to Month"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {slotsToDisplay.map((time) => {
          const isEnabled = enabledSlots.includes(time);
          const isBooked = bookedSlotsForDay.includes(time);
          const isBuffer = bufferSlotsForDay.includes(time);
          const slotInfo = slotDetailsForDay[time] || {};
          const possibleDurations = slotInfo.possibleDurations || [30, 50, 80];
          const isRestricted =
            possibleDurations.length === 1 && possibleDurations[0] === 50;
          const isDisabled = isUpdating || isBooked || isBuffer;

          let buttonClass =
            "text-sm p-2 rounded-md border-2 transition-all duration-200 relative ";
          let title = "";

          if (isBooked) {
            buttonClass +=
              "border-green-400 bg-green-100 text-green-700 cursor-not-allowed opacity-75";
            title = "Booked (cannot modify)";
          } else if (isBuffer) {
            buttonClass +=
              "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed opacity-75";
            title = "Buffer slot (cannot modify)";
          } else if (isEnabled) {
            buttonClass +=
              "border-[#000080] bg-blue-50 font-semibold text-[#000080] hover:bg-blue-100";
            title = isRestricted
              ? "Available (50min sessions only) - Click to disable"
              : "Available - Click to disable";
          } else {
            buttonClass +=
              "border-gray-200 hover:bg-gray-100 text-gray-700 hover:border-[#000080]";
            title = "Click to enable";
          }

          if (isUpdating && !isBooked && !isBuffer) {
            buttonClass += " opacity-50 cursor-not-allowed";
            title = "Updating...";
          }

          return (
            <button
              key={time}
              disabled={isDisabled}
              title={title}
              className={buttonClass}
              onClick={() =>
                !isBooked &&
                !isBuffer &&
                onScheduleChange(dateKey, time, !isEnabled)
              }
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">{formatTime(time)}</span>
                {isBooked && <span className="text-xs">Booked</span>}
                {isBuffer && <span className="text-xs">Buffer</span>}
                {isEnabled && isRestricted && (
                  <span className="text-xs text-blue-700 mt-1">50min only</span>
                )}
              </div>
              {isEnabled && isRestricted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-[#000080] mb-3">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#000080] bg-blue-50 rounded"></div>
            <span>Available (All Durations)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 bg-blue-200 rounded relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <span>Available (50min only)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-200 bg-white rounded"></div>
            <span>Not Set</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-400 bg-green-100 rounded"></div>
            <span>Booked (cannot modify)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 bg-gray-100 rounded"></div>
            <span>Buffer (cannot modify)</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 flex flex-wrap gap-2 justify-end">
        <Button
          onClick={() => onBulkUpdate("clearDate")}
          disabled={isUpdating}
          variant="outline"
          className="text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 border-red-200 disabled:opacity-50"
        >
          {isUpdating ? "Clearing..." : "Clear This Date"}
        </Button>
        <Button
          onClick={() => onBulkUpdate("clearDay")}
          disabled={isUpdating}
          variant="outline"
          className="text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 border-red-200 disabled:opacity-50"
        >
          {isUpdating ? "Clearing..." : `Clear all ${dayName}`}
        </Button>
        <Button
          onClick={() => onBulkUpdate("clearWeek")}
          disabled={isUpdating}
          variant="outline"
          className="text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 border-red-200 disabled:opacity-50"
        >
          {isUpdating ? "Clearing..." : "Clear This Week"}
        </Button>
        <Button
          onClick={() => onBulkUpdate("clearMonth")}
          disabled={isUpdating}
          variant="outline"
          className="text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 border-red-200 disabled:opacity-50"
        >
          {isUpdating ? "Clearing..." : "Clear This Month"}
        </Button>
      </div>
    </div>
  );
};

EditSchedule.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  schedule: PropTypes.object.isRequired,
  bookedSlots: PropTypes.object.isRequired,
  bufferSlots: PropTypes.object.isRequired,
  slotDetails: PropTypes.object,
  onScheduleChange: PropTypes.func.isRequired,
  onBulkUpdate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
};

export default EditSchedule;
