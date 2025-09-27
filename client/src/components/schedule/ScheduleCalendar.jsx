import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { dateToKey } from "@/utils/dateUtils";

// --- Constants ---
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ScheduleCalendar = ({
  viewingDate,
  selectedDate,
  schedule,
  bookedSlots,
  today,
  maxDate,
  onDateSelect,
  onNavChange,
}) => {
  const year = viewingDate.getFullYear();
  const month = viewingDate.getMonth();

  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++)
      days.push({ key: `empty-${i}`, empty: true });
    for (let day = 1; day <= daysInMonth; day++)
      days.push({
        key: `${year}-${month}-${day}`,
        day,
        date: new Date(year, month, day),
      });

    return days;
  }, [year, month]);

  const isPrevDisabled =
    viewingDate.getFullYear() === today.getFullYear() &&
    viewingDate.getMonth() === today.getMonth();
  const isNextDisabled =
    viewingDate.getFullYear() === maxDate.getFullYear() &&
    viewingDate.getMonth() === maxDate.getMonth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#000080]">
          {`${MONTH_NAMES[month]} ${year}`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onNavChange(-1)}
            disabled={isPrevDisabled}
            className="p-2 hover:text-[#ec5228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavChange(1)}
            disabled={isNextDisabled}
            className="p-2 hover:text-[#ec5228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-3 mb-6">
          {DAY_NAMES_SHORT.map((day) => (
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
            const availableSlotsForDay = schedule[dateToKey(dayDate)] || [];
            const bookedSlotsForDay = bookedSlots[dateToKey(dayDate)] || [];
            const isDisabled = dayDate < today || dayDate > maxDate;
            const isSelected =
              selectedDate && dayDate.getTime() === selectedDate.getTime();
            const isToday = dayDate.getTime() === today.getTime();

            return (
              <div
                key={dayInfo.key}
                onClick={() => !isDisabled && onDateSelect(dayDate)}
                className={`
                  relative h-12 w-full flex items-center justify-center rounded-xl transition-all duration-300 text-base font-semibold border-2 mb-3
                  ${
                    isDisabled
                      ? "text-gray-300 cursor-not-allowed border-transparent bg-gray-50"
                      : isSelected
                      ? "cursor-pointer text-[#000080] border-[#000080] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
                      : "cursor-pointer text-gray-700 border-gray-100 bg-white hover:border-[#000080] hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-[#000080] hover:shadow-lg hover:scale-105 transition-all duration-200"
                  }
                  ${
                    isToday && !isSelected
                      ? "text-[#ec5228] font-bold bg-gradient-to-br from-orange-50 to-red-50 border-[#ec5228] ring-2 ring-[#ec5228]/20"
                      : ""
                  }
                `}
              >
                <span className="relative z-10">{dayInfo.day}</span>

                {/* Available slots indicator */}
                {availableSlotsForDay.length > 0 && (
                  <div
                    className="absolute -top-2 -right-0 z-40 flex items-center justify-end"
                    title={`${availableSlotsForDay.length} available slot${
                      availableSlotsForDay.length > 1 ? "s" : ""
                    }`}
                    role="status"
                    aria-label={`${availableSlotsForDay.length} available slots`}
                  >
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-orange-400 to-red-500 shadow border border-white">
                      {availableSlotsForDay.length > 9
                        ? "9+"
                        : availableSlotsForDay.length}
                    </span>
                  </div>
                )}

                {/* Booked slots indicator */}
                {bookedSlotsForDay.length > 0 && (
                  <div
                    className="absolute -bottom-2 -right-0 z-40 flex items-center justify-end"
                    title={`${bookedSlotsForDay.length} booked slot${
                      bookedSlotsForDay.length > 1 ? "s" : ""
                    }`}
                    role="img"
                    aria-label={`${bookedSlotsForDay.length} booked slots`}
                  >
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 shadow border border-white">
                      {bookedSlotsForDay.length > 9
                        ? "9+"
                        : bookedSlotsForDay.length}
                    </span>
                  </div>
                )}

                {/* Today indicator */}
                {isToday && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#ec5228] rounded-full shadow-sm"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ScheduleCalendar.propTypes = {
  viewingDate: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  schedule: PropTypes.object.isRequired,
  bookedSlots: PropTypes.object.isRequired,
  today: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  onDateSelect: PropTypes.func.isRequired,
  onNavChange: PropTypes.func.isRequired,
};

export default ScheduleCalendar;
