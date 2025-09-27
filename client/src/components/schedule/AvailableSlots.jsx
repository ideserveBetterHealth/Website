import { useMemo } from "react";
import { Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { dateToKey } from "@/utils/dateUtils";

const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const AvailableSlots = ({ selectedDate, schedule, slotDetails }) => {
  const slots = useMemo(() => {
    if (!selectedDate) return null;
    const available = (schedule[dateToKey(selectedDate)] || []).sort();
    if (available.length === 0)
      return { morning: [], afternoon: [], evening: [] };

    return {
      morning: available.filter((s) => parseInt(s.split(":")[0]) < 12),
      afternoon: available.filter(
        (s) => parseInt(s.split(":")[0]) >= 12 && parseInt(s.split(":")[0]) < 17
      ),
      evening: available.filter((s) => parseInt(s.split(":")[0]) >= 17),
    };
  }, [selectedDate, schedule]);

  const renderSlot = (time) => {
    const dateKey = dateToKey(selectedDate);
    const slotInfo = slotDetails?.[dateKey]?.[time] || {};
    const possibleDurations = slotInfo.possibleDurations || [30, 50, 80];
    const isRestricted =
      possibleDurations.length === 1 && possibleDurations[0] === 50;

    return (
      <div
        key={time}
        className={`py-2 px-3 text-sm font-medium rounded-lg border-2 relative ${
          isRestricted
            ? "bg-orange-50 text-orange-700 border-orange-200"
            : "bg-white text-[#000080] border-gray-200"
        }`}
      >
        <div className="flex flex-col">
          <span className="font-semibold">{formatTime(time)}</span>
          {isRestricted && (
            <span className="text-xs text-orange-600 mt-1">Only 50min</span>
          )}
        </div>
        {isRestricted && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!selectedDate) {
      return (
        <div className="text-center text-gray-500 flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#fffae3] to-[#f0f9ff] rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-[#ec5228]" />
          </div>
          <h4 className="text-lg font-semibold text-[#000080] mb-2">
            Select a Date
          </h4>
          <p className="text-gray-400">
            Choose a date from the calendar to view available slots
          </p>
        </div>
      );
    }

    if (
      !slots ||
      slots.morning.length + slots.afternoon.length + slots.evening.length === 0
    ) {
      return (
        <div className="text-center text-gray-400 py-10 flex-1 flex flex-col justify-center">
          <div className="text-5xl mb-4">📭</div>
          <h4 className="text-lg font-semibold text-[#000080] mb-2">
            No Available Slots
          </h4>
          <p className="text-gray-400">
            No appointment slots are scheduled for this date
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {slots.morning.length > 0 && (
          <div>
            <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
              <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
              Morning
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {slots.morning.map((time) => renderSlot(time))}
            </div>
          </div>
        )}

        {slots.afternoon.length > 0 && (
          <div>
            <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
              <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
              Afternoon
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {slots.afternoon.map((time) => renderSlot(time))}
            </div>
          </div>
        )}

        {slots.evening.length > 0 && (
          <div>
            <h5 className="text-[#000080] font-semibold mb-3 text-sm flex items-center">
              <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-2"></span>
              Evening
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {slots.evening.map((time) => renderSlot(time))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px] flex flex-col">
      <h3 className="text-lg font-bold text-[#000080] mb-4">
        {selectedDate
          ? `Available Slots for ${selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}`
          : "Available Slots"}
      </h3>
      {renderContent()}
    </div>
  );
};

AvailableSlots.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  schedule: PropTypes.object.isRequired,
  slotDetails: PropTypes.object,
};

export default AvailableSlots;
