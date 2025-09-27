import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Edit3,
  Save,
  Users,
  UserCheck,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  useGetAllBHAssociatesQuery,
  useGetAssociateAvailabilityQuery,
  useUpdateAssociateAvailabilityMutation,
  useClearAssociateAvailabilityMutation,
  useBulkUpdateAssociateAvailabilityMutation,
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

// Helper function to get role icon
const getRoleIcon = () => {
  // Use a general professional icon for all BH associates
  return <UserCheck className="w-5 h-5 text-blue-600" />;
};

// --- Main Component ---
const ManageSchedule = () => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 3);
    return d;
  }, [today]);

  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [viewingDate, setViewingDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [schedule, setSchedule] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [bufferSlots, setBufferSlots] = useState({});
  const [slotDetails, setSlotDetails] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // API hooks
  const { data: associatesData, isLoading: isLoadingAssociates } =
    useGetAllBHAssociatesQuery();

  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    refetch: refetchAvailability,
  } = useGetAssociateAvailabilityQuery(
    selectedAssociate
      ? {
          associateId: selectedAssociate._id,
          startDate: formatDateForAPI(today),
          endDate: formatDateForAPI(maxDate),
        }
      : {},
    { skip: !selectedAssociate }
  );

  const [updateAssociateAvailability] =
    useUpdateAssociateAvailabilityMutation();
  const [clearAssociateAvailability] = useClearAssociateAvailabilityMutation();
  const [bulkUpdateAssociateAvailability] =
    useBulkUpdateAssociateAvailabilityMutation();

  // Reset state when associate changes
  useEffect(() => {
    if (selectedAssociate) {
      setSchedule({});
      setBookedSlots({});
      setBufferSlots({});
      setSlotDetails({});
      setViewingDate(today);
      setSelectedDate(today);
    }
  }, [selectedAssociate, today]);

  // Convert API data to component format
  useEffect(() => {
    if (
      availabilityData?.success &&
      availabilityData?.data &&
      selectedAssociate
    ) {
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
            const bufferSlots = calculateBufferSlots(
              slot.time,
              slot.duration,
              selectedAssociate.type
            );

            bufferSlots.forEach((bufferTime) => {
              if (!bufferSlotsForDay.includes(bufferTime)) {
                bufferSlotsForDay.push(bufferTime);
              }
            });
          }
        });

        if (availableSlots.length > 0) {
          formattedSchedule[dateKey] = availableSlots.sort();
        }
        if (bookedSlotsForDay.length > 0) {
          formattedBookedSlots[dateKey] = bookedSlotsForDay.sort();
        }
        if (bufferSlotsForDay.length > 0) {
          formattedBufferSlots[dateKey] = bufferSlotsForDay.sort();
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
  }, [availabilityData, selectedAssociate]);

  // --- Event Handlers ---
  const handleEditSchedule = useCallback((associate) => {
    setSelectedAssociate(associate);
  }, []);

  const handleCloseScheduleEditor = useCallback(() => {
    setSelectedAssociate(null);
  }, []);

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
      if (!selectedDate || !selectedAssociate) return;

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
            await bulkUpdateAssociateAvailability({
              associateId: selectedAssociate._id,
              pattern: "day",
              startDate: formatDateForAPI(firstOfMonth),
              endDate: formatDateForAPI(endOfMonth),
              dayOfWeek: selectedDate.getDay(),
              slots: template,
            });
            break;
          case "week":
            await bulkUpdateAssociateAvailability({
              associateId: selectedAssociate._id,
              pattern: "week",
              startDate: formatDateForAPI(startOfWeek),
              endDate: formatDateForAPI(endOfWeek),
              slots: template,
            });
            break;
          case "month":
            await bulkUpdateAssociateAvailability({
              associateId: selectedAssociate._id,
              pattern: "month",
              startDate: formatDateForAPI(firstOfMonth),
              endDate: formatDateForAPI(endOfMonth),
              slots: template,
            });
            break;
          case "clearDate":
            await clearAssociateAvailability({
              associateId: selectedAssociate._id,
              dates: [formatDateForAPI(selectedDate)],
            });
            break;
          case "clearDay": {
            // Clear all dates of the same day of week in the month
            const dayDates = [];
            const monthDate = new Date(firstOfMonth);
            while (monthDate <= endOfMonth) {
              if (
                monthDate.getDay() === selectedDate.getDay() &&
                monthDate >= today &&
                monthDate <= maxDate
              ) {
                dayDates.push(formatDateForAPI(monthDate));
              }
              monthDate.setDate(monthDate.getDate() + 1);
            }
            await clearAssociateAvailability({
              associateId: selectedAssociate._id,
              dates: dayDates,
            });
            break;
          }
          case "clearWeek": {
            // Clear all dates in the week
            const weekDates = [];
            const weekDate = new Date(startOfWeek);
            while (weekDate <= endOfWeek) {
              if (weekDate >= today && weekDate <= maxDate) {
                weekDates.push(formatDateForAPI(weekDate));
              }
              weekDate.setDate(weekDate.getDate() + 1);
            }
            await clearAssociateAvailability({
              associateId: selectedAssociate._id,
              dates: weekDates,
            });
            break;
          }
          case "clearMonth": {
            // Clear all dates in the month
            const monthDates = [];
            const monthDate = new Date(firstOfMonth);
            while (monthDate <= endOfMonth) {
              if (monthDate >= today && monthDate <= maxDate) {
                monthDates.push(formatDateForAPI(monthDate));
              }
              monthDate.setDate(monthDate.getDate() + 1);
            }
            await clearAssociateAvailability({
              associateId: selectedAssociate._id,
              dates: monthDates,
            });
            break;
          }
          default:
            break;
        }

        // Refetch data and show success
        await refetchAvailability();
        toast.success(
          `Schedule updated successfully for ${selectedAssociate.name}!`
        );
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
      selectedAssociate,
      schedule,
      today,
      maxDate,
      bulkUpdateAssociateAvailability,
      clearAssociateAvailability,
      refetchAvailability,
    ]
  );

  const saveSchedule = useCallback(async () => {
    if (isSaving || !selectedAssociate) return;
    setIsSaving(true);

    try {
      // Convert schedule format to API format
      const availabilityData = Object.entries(schedule).map(
        ([dateKey, slots]) => ({
          date: dateKey,
          slots: slots,
        })
      );

      await updateAssociateAvailability({
        associateId: selectedAssociate._id,
        availabilityData,
      });
      await refetchAvailability();

      setLastSaved(new Date());
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 2000);
      toast.success(
        `Schedule saved successfully for ${selectedAssociate.name}!`
      );
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    selectedAssociate,
    schedule,
    updateAssociateAvailability,
    refetchAvailability,
  ]);

  // Show loading for associates
  if (isLoadingAssociates) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#ec5228] to-[#d14a22] rounded-full flex items-center justify-center animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#000080] mb-2">
            Loading Associates...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch BH Associate information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-32 pb-12">
        {selectedAssociate ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-4 rounded-full shadow-lg flex items-center justify-center">
                      {<UserCheck className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-[#000080] mb-1">
                        {selectedAssociate.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-gray-600">
                        <span className="font-medium">
                          {selectedAssociate.type?.toUpperCase().slice(0, 1) +
                            selectedAssociate.type?.slice(1).toLowerCase()}
                        </span>
                        {selectedAssociate.specialization && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span>{selectedAssociate.specialization}</span>
                          </>
                        )}
                        {selectedAssociate.phoneNumber && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{selectedAssociate.phoneNumber}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:ml-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Schedule Management</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>Active Status</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleCloseScheduleEditor}
                className="bg-white hover:bg-[#ec5228] hover:text-white border-2 border-[#ec5228] text-[#ec5228] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Associates
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingAvailability ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#ec5228] to-[#d14a22] rounded-full flex items-center justify-center animate-pulse">
                    {getRoleIcon()}
                  </div>
                  <h2 className="text-xl font-semibold text-[#000080] mb-2">
                    Loading Schedule...
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Please wait while we fetch {selectedAssociate.name}&apos;s
                    availability
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec5228]"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4"></div>

                    <Button
                      onClick={saveSchedule}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] hover:from-[#d14a22] hover:to-[#b8411f] text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {isSaving ? "Saving Changes..." : "Save Schedule"}
                    </Button>

                    {lastSaved && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>
                          Last saved:{" "}
                          {lastSaved.toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-4 rounded-full shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-[#000080] mb-2">
                    Manage Schedules
                  </h1>
                  <p className="text-lg text-gray-600">
                    Better Health Associate Management
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Select a Better Health associate to view and manage their
                  availability schedule. You can add or remove time slots, apply
                  bulk changes, and manage their calendar efficiently.
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] mb-1">
                      {associatesData?.associates?.length || 0}
                    </h3>
                    <p className="text-gray-600 text-sm">Total Associates</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-center mb-3">
                      <UserCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] mb-1">
                      {associatesData?.associates?.filter(
                        (a) => a.isActive === true
                      ).length || 0}
                    </h3>
                    <p className="text-gray-600 text-sm">Active Associates</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-center mb-3">
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] mb-1">
                      {associatesData?.associates?.filter(
                        (a) => a.type === "psychologist"
                      ).length || 0}
                    </h3>
                    <p className="text-gray-600 text-sm">Psychologists</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-center mb-3">
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] mb-1">
                      {associatesData?.associates?.filter(
                        (a) => a.type === "cosmetologist"
                      ).length || 0}
                    </h3>
                    <p className="text-gray-600 text-sm">Cosmetologists</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Associates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {associatesData?.associates?.map((associate) => (
                <Card
                  key={associate._id}
                  className="bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden group"
                >
                  <CardHeader
                    className={`pb-3 bg-gradient-to-r ${
                      associate.type === "psychologist"
                        ? "from-blue-50 to-indigo-50"
                        : "from-green-50 to-teal-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        {getRoleIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-[#000080] text-lg font-bold truncate">
                          {associate.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 font-medium">
                          BH Associate
                        </p>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                        {associate.type?.toUpperCase().slice(0, 1) +
                          associate.type?.slice(1).toLowerCase()}
                      </span>
                      {associate.specialization && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                          {associate.specialization}
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    {associate.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{associate.phoneNumber}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                          <p className="text-xs text-gray-600">Experience</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {associate.experienceYears || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <Clock
                            className={`w-5 h-5 mx-auto mb-1 ${
                              associate.isActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                          <p className="text-xs text-gray-600">Status</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {associate.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <Button
                        onClick={() => handleEditSchedule(associate)}
                        className="w-full bg-gradient-to-r from-[#ec5228] to-[#d14a22] hover:from-[#d14a22] hover:to-[#b8411f] text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

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
                {selectedAssociate?.name}&apos;s availability has been updated
                successfully.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSchedule;
