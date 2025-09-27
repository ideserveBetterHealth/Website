import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useGetAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useClearAvailabilityMutation,
  useBulkUpdateAvailabilityMutation,
} from "@/features/api/bhAssociateApi";
import {
  ScheduleCalendar,
  AvailableSlots,
  EditSchedule,
} from "@/components/schedule";
import {
  dateToKey,
  formatDateForAPI,
  parseDateFromAPI,
} from "@/utils/dateUtils";
import { calculateBufferSlots } from "@/utils/scheduleHelpers";

// --- Main Component ---
const MySchedule = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state?.auth?.user);

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

  const [viewingDate, setViewingDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [schedule, setSchedule] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [bufferSlots, setBufferSlots] = useState({});
  const [slotDetails, setSlotDetails] = useState({}); // Store possibleDurations and other slot info
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // API hooks
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    refetch: refetchAvailability,
  } = useGetAvailabilityQuery({
    startDate: formatDateForAPI(today),
    endDate: formatDateForAPI(maxDate),
  });

  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [clearAvailability] = useClearAvailabilityMutation();
  const [bulkUpdateAvailability] = useBulkUpdateAvailabilityMutation();

  // Convert API data to component format
  useEffect(() => {
    if (availabilityData?.success && availabilityData?.data) {
      const formattedSchedule = {};
      const formattedBookedSlots = {};
      const formattedBufferSlots = {};
      const formattedSlotDetails = {};

      availabilityData.data.forEach((dayAvail) => {
        const dateKey = dateToKey(parseDateFromAPI(dayAvail.date));
        const availableSlots = [];
        const bookedSlotsForDay = [];
        const bufferSlotsForDay = [];
        const slotDetailsForDay = {};

        dayAvail.slots.forEach((slot) => {
          // Store slot details including possibleDurations
          slotDetailsForDay[slot.time] = {
            possibleDurations: slot.possibleDurations || [30, 50, 80],
            duration: slot.duration,
            isBooked: slot.isBooked,
            isAvailable: slot.isAvailable,
          };

          if (slot.isAvailable && !slot.isBooked) {
            // Regular available slot
            availableSlots.push(slot.time);
          } else if (slot.isBooked && !slot.isAvailable) {
            // Booked slot
            bookedSlotsForDay.push(slot.time);

            // Calculate buffer slots for booked appointments
            if (slot.duration && user?.type) {
              const bufferTimesForSlot = calculateBufferSlots(
                slot.time,
                slot.duration,
                user.type
              );
              bufferSlotsForDay.push(...bufferTimesForSlot);
            }
          } else if (!slot.isBooked && !slot.isAvailable) {
            // Buffer slot
            bufferSlotsForDay.push(slot.time);
          }
        });

        if (availableSlots.length > 0) {
          formattedSchedule[dateKey] = availableSlots.sort();
        }
        if (bookedSlotsForDay.length > 0) {
          formattedBookedSlots[dateKey] = bookedSlotsForDay.sort();
        }
        if (bufferSlotsForDay.length > 0) {
          formattedBufferSlots[dateKey] = [
            ...new Set(bufferSlotsForDay),
          ].sort();
        }
        if (Object.keys(slotDetailsForDay).length > 0) {
          formattedSlotDetails[dateKey] = slotDetailsForDay;
        }
      });

      setSchedule(formattedSchedule);
      setBookedSlots(formattedBookedSlots);
      setBufferSlots(formattedBufferSlots);
      setSlotDetails(formattedSlotDetails);
    }
  }, [availabilityData, user?.type]);

  // --- Event Handlers ---
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleNavChange = useCallback((monthOffset) => {
    setViewingDate((current) => {
      const newDate = new Date(current);
      newDate.setMonth(newDate.getMonth() + monthOffset);
      return newDate;
    });
    setSelectedDate(null);
  }, []);

  const handleScheduleChange = useCallback(
    (dateKey, time, isEnabled) => {
      // Check if this slot is booked or buffer before allowing changes
      const bookedSlotsForDay = bookedSlots[dateKey] || [];
      const bufferSlotsForDay = bufferSlots[dateKey] || [];

      if (
        bookedSlotsForDay.includes(time) ||
        bufferSlotsForDay.includes(time)
      ) {
        toast.error("Cannot modify booked or buffer time slots");
        return;
      }

      setSchedule((currentSchedule) => {
        const newSchedule = { ...currentSchedule };
        const currentSlots = newSchedule[dateKey]
          ? [...newSchedule[dateKey]]
          : [];
        const slotIndex = currentSlots.indexOf(time);

        if (isEnabled && slotIndex === -1) {
          currentSlots.push(time);
        } else if (!isEnabled && slotIndex > -1) {
          currentSlots.splice(slotIndex, 1);
        }
        newSchedule[dateKey] = currentSlots.sort();
        return newSchedule;
      });
    },
    [bookedSlots, bufferSlots]
  );

  const handleBulkUpdate = useCallback(
    async (type) => {
      if (!selectedDate) return;

      try {
        setIsSaving(true);
        const selectedDateKey = dateToKey(selectedDate);
        const template = schedule[selectedDateKey] || [];

        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const firstOfMonth = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0
        );

        switch (type) {
          case "day":
            await bulkUpdateAvailability({
              pattern: "day",
              startDate: formatDateForAPI(firstOfMonth),
              endDate: formatDateForAPI(endOfMonth),
              dayOfWeek: selectedDate.getDay(),
              slots: template,
            });
            break;
          case "week":
            await bulkUpdateAvailability({
              pattern: "week",
              startDate: formatDateForAPI(startOfWeek),
              endDate: formatDateForAPI(endOfWeek),
              slots: template,
            });
            break;
          case "month":
            await bulkUpdateAvailability({
              pattern: "month",
              startDate: formatDateForAPI(firstOfMonth),
              endDate: formatDateForAPI(endOfMonth),
              slots: template,
            });
            break;
          case "clearDate":
            await clearAvailability([formatDateForAPI(selectedDate)]);
            break;
          case "clearDay": {
            // Get all dates in month that match the day of week
            const datesToClear = [];
            let currentDate = new Date(firstOfMonth);
            while (currentDate <= endOfMonth) {
              if (
                currentDate.getDay() === selectedDate.getDay() &&
                currentDate >= today &&
                currentDate <= maxDate
              ) {
                datesToClear.push(formatDateForAPI(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
            await clearAvailability(datesToClear);
            break;
          }
          case "clearWeek": {
            const weekDates = [];
            let weekDate = new Date(startOfWeek);
            while (weekDate <= endOfWeek) {
              if (weekDate >= today && weekDate <= maxDate) {
                weekDates.push(formatDateForAPI(weekDate));
              }
              weekDate.setDate(weekDate.getDate() + 1);
            }
            await clearAvailability(weekDates);
            break;
          }
          case "clearMonth": {
            const monthDates = [];
            let monthDate = new Date(firstOfMonth);
            while (monthDate <= endOfMonth) {
              if (monthDate >= today && monthDate <= maxDate) {
                monthDates.push(formatDateForAPI(monthDate));
              }
              monthDate.setDate(monthDate.getDate() + 1);
            }
            await clearAvailability(monthDates);
            break;
          }
          default:
            break;
        }

        // Refetch data and show success
        await refetchAvailability();
        toast.success(`Schedule updated successfully!`);
        setLastSaved(new Date());
        setShowSaveModal(true);
        setTimeout(() => setShowSaveModal(false), 2000);
      } catch (error) {
        console.error("Error updating schedule:", error);
        toast.error("Failed to update schedule. Please try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [
      selectedDate,
      schedule,
      today,
      maxDate,
      bulkUpdateAvailability,
      clearAvailability,
      refetchAvailability,
    ]
  );

  const saveSchedule = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Convert schedule format to API format
      const availabilityData = Object.entries(schedule).map(
        ([dateKey, slots]) => ({
          date: dateKey,
          slots: slots,
        })
      );

      await updateAvailability(availabilityData);
      await refetchAvailability();

      setLastSaved(new Date());
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 2000);
      toast.success("Schedule saved successfully!");
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, schedule, updateAvailability, refetchAvailability]);

  if (isLoadingAvailability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#ec5228] to-[#d14a22] rounded-full flex items-center justify-center animate-pulse">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#000080] mb-2">
            Loading Schedule...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your availability
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-32 pb-12 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-3 rounded-full shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#000080]">
              My Schedule
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your availability and time slots. Select dates to add or
            remove available appointment times for your clients.
          </p>
        </div>

        {/* Calendar and Available Slots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ScheduleCalendar
            viewingDate={viewingDate}
            selectedDate={selectedDate}
            schedule={schedule}
            bookedSlots={bookedSlots}
            today={today}
            maxDate={maxDate}
            onDateSelect={handleDateSelect}
            onNavChange={handleNavChange}
          />
          <AvailableSlots
            selectedDate={selectedDate}
            schedule={schedule}
            slotDetails={slotDetails}
          />
        </div>

        {/* Edit Schedule Section */}
        <EditSchedule
          selectedDate={selectedDate}
          schedule={schedule}
          bookedSlots={bookedSlots}
          bufferSlots={bufferSlots}
          slotDetails={slotDetails}
          onScheduleChange={handleScheduleChange}
          onBulkUpdate={handleBulkUpdate}
          isUpdating={isSaving}
        />

        {/* Save Section */}
        <div className="text-center space-y-4">
          <Button
            onClick={saveSchedule}
            disabled={isSaving}
            className="bg-[#ec5228] hover:bg-[#d14a22] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving Changes..." : "Save Schedule"}
          </Button>

          {lastSaved && (
            <p className="text-sm text-gray-500">
              Last saved:{" "}
              {lastSaved.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Save Success Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform transition-transform duration-300 max-w-md mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#000080] mb-2">
              Schedule Saved!
            </h3>
            <p className="text-gray-600">
              Your availability has been updated successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;
