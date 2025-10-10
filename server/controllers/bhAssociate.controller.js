import BHAssociate from "../models/bhAssociate.model.js";
import { User } from "../models/user.model.js";

// Helper function to subtract minutes from time string
function subtractMinutesFromTime(timeString, minutesToSubtract) {
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
}
// Helper function to update lastScheduleUpdates array
function updateLastScheduleUpdates(bhAssociate) {
  const now = new Date();
  // Convert to UTC first, then add IST offset (UTC+5:30)
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);

  const day = String(istTime.getDate()).padStart(2, "0");
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const year = istTime.getFullYear();
  const hours = String(istTime.getHours()).padStart(2, "0");
  const minutes = String(istTime.getMinutes()).padStart(2, "0");

  const timestamp = `${day}-${month}-${year}   ${hours}:${minutes}`;

  // Add to beginning of array and keep only latest 5
  bhAssociate.lastScheduleUpdates.unshift(timestamp);
  if (bhAssociate.lastScheduleUpdates.length > 5) {
    bhAssociate.lastScheduleUpdates = bhAssociate.lastScheduleUpdates.slice(
      0,
      5
    );
  }
}

// Helper function to update slot restrictions based on existing 80-minute bookings
const updateSlotRestrictionsFor80MinBookings = async (
  bhAssociate,
  targetDate
) => {
  try {
    // Find the availability for the specific date
    const dateAvailability = bhAssociate.availability.find((avail) => {
      const availDate = new Date(avail.date);
      return availDate.toDateString() === targetDate.toDateString();
    });

    if (!dateAvailability) {
      return; // No availability data for this date
    }

    // Find all 80-minute bookings for this date
    const eightyMinuteBookings = dateAvailability.slots.filter(
      (slot) => slot.isBooked && parseInt(slot.duration) === 80
    );

    // For each 80-minute booking, check if there's a slot 60 minutes before it
    // and restrict that slot to 50 minutes only
    for (const booking of eightyMinuteBookings) {
      const slot60MinutesBefore = subtractMinutesFromTime(booking.time, 60);

      // Find the slot 60 minutes before this 80-minute booking
      const targetSlot = dateAvailability.slots.find(
        (slot) =>
          slot.time === slot60MinutesBefore &&
          slot.isAvailable &&
          !slot.isBooked
      );

      if (targetSlot) {
        // Restrict this slot to 50 minutes only
        targetSlot.possibleDurations = [50];
        console.log(
          `Slot ${slot60MinutesBefore} restricted to 50min only due to 80min booking at ${booking.time}`
        );
      }
    }
  } catch (error) {
    console.error(
      "Error updating slot restrictions for 80-min bookings:",
      error
    );
  }
};

// Get BH Associate profile with availability
export const getBHAssociateProfile = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can access this endpoint.",
      });
    }

    const bhAssociate = await BHAssociate.findOne({ userId }).populate(
      "userId",
      "name email phoneNumber"
    );

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bhAssociate,
    });
  } catch (error) {
    console.error("Error fetching BH Associate profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get availability for a specific date range
export const getAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { startDate, endDate } = req.query;

    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can access this endpoint.",
      });
    }

    const bhAssociate = await BHAssociate.findOne({ userId });

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate profile not found",
      });
    }

    let availabilityData = bhAssociate.availability;

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate + "T00:00:00.000Z");
      const end = new Date(endDate + "T00:00:00.000Z");

      availabilityData = availabilityData.filter((avail) => {
        const availDate = new Date(avail.date);
        return availDate >= start && availDate <= end;
      });
    }

    res.status(200).json({
      success: true,
      data: availabilityData,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update availability for specific dates
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { availabilityData } = req.body; // Array of {date, slots: [time strings]}

    console.log("=== UPDATE AVAILABILITY DEBUG ===");
    console.log("User ID:", userId);
    console.log(
      "Availability Data:",
      JSON.stringify(availabilityData, null, 2)
    );

    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can update availability.",
      });
    }

    const bhAssociate = await BHAssociate.findOne({ userId });

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate profile not found",
      });
    }

    // Process each date's availability
    for (const dateAvail of availabilityData) {
      const { date, slots } = dateAvail;
      // Create date in UTC to avoid timezone issues
      const targetDate = new Date(date + "T00:00:00.000Z");

      // Find existing availability for this date
      const existingIndex = bhAssociate.availability.findIndex((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === targetDate.toDateString();
      });

      if (existingIndex !== -1) {
        // Update existing availability - preserve booked slots and possibleDurations
        const existingSlots = bhAssociate.availability[existingIndex].slots;
        const mergedSlots = [];

        // Add new slots
        slots.forEach((time) => {
          const existingSlot = existingSlots.find((slot) => slot.time === time);
          if (existingSlot && existingSlot.isBooked) {
            // Keep booked slots as they are
            mergedSlots.push(existingSlot);
          } else {
            // Create new available slot, preserving possibleDurations if it existed
            const newSlot = {
              time,
              isAvailable: true,
              isBooked: false,
              duration: 30, // Default 30-minute duration for availability slots
              possibleDurations: existingSlot?.possibleDurations || [
                30, 50, 80,
              ], // Preserve existing possibleDurations
            };
            mergedSlots.push(newSlot);
          }
        });

        // Keep any booked slots that aren't in the new slots list
        existingSlots.forEach((existingSlot) => {
          if (
            existingSlot.isBooked &&
            !slots.find((time) => time === existingSlot.time)
          ) {
            mergedSlots.push(existingSlot);
          }
        });

        bhAssociate.availability[existingIndex].slots = mergedSlots;
      } else {
        // Add new availability for this date
        const slotObjects = slots.map((time) => ({
          time,
          isAvailable: true,
          isBooked: false,
          duration: 30, // Default 30-minute duration for availability slots
          possibleDurations: [30, 50, 80], // Default possible durations for new slots
        }));

        bhAssociate.availability.push({
          date: targetDate,
          slots: slotObjects,
        });
      }

      // After updating this date's availability, check for 80-minute booking restrictions
      await updateSlotRestrictionsFor80MinBookings(bhAssociate, targetDate);
    }

    // Update lastScheduleUpdates
    updateLastScheduleUpdates(bhAssociate);

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear availability for specific dates
export const clearAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { dates } = req.body; // Array of date strings

    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can clear availability.",
      });
    }

    const bhAssociate = await BHAssociate.findOne({ userId });

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate profile not found",
      });
    }

    // Remove availability for specified dates (only non-booked slots)
    dates.forEach((dateStr) => {
      const targetDate = new Date(dateStr + "T00:00:00.000Z");
      const existingIndex = bhAssociate.availability.findIndex((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === targetDate.toDateString();
      });

      if (existingIndex !== -1) {
        // Keep only booked slots
        const bookedSlots = bhAssociate.availability[
          existingIndex
        ].slots.filter((slot) => slot.isBooked);

        if (bookedSlots.length > 0) {
          bhAssociate.availability[existingIndex].slots = bookedSlots;
        } else {
          // Remove the entire date if no booked slots
          bhAssociate.availability.splice(existingIndex, 1);
        }
      }
    });

    // Update lastScheduleUpdates
    updateLastScheduleUpdates(bhAssociate);

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: "Availability cleared successfully",
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error clearing availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Bulk update availability (for applying patterns)
export const bulkUpdateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { pattern, startDate, endDate, dayOfWeek, slots } = req.body;

    console.log("=== BULK UPDATE AVAILABILITY DEBUG ===");
    console.log("User ID:", userId);
    console.log("Pattern:", pattern);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Day of Week:", dayOfWeek);
    console.log("Slots:", slots);

    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can update availability.",
      });
    }

    const bhAssociate = await BHAssociate.findOne({ userId });

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate profile not found",
      });
    }

    const start = new Date(startDate + "T00:00:00.000Z");
    const end = new Date(endDate + "T00:00:00.000Z");

    // Generate dates based on pattern
    const datesToUpdate = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      if (pattern === "day" && dayOfWeek !== undefined) {
        if (currentDate.getDay() === dayOfWeek) {
          datesToUpdate.push(new Date(currentDate));
        }
      } else if (pattern === "week" || pattern === "month") {
        datesToUpdate.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Update availability for all dates in the pattern
    for (const date of datesToUpdate) {
      const existingIndex = bhAssociate.availability.findIndex((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === date.toDateString();
      });

      if (existingIndex !== -1) {
        // Update existing - preserve booked slots and possibleDurations
        const existingSlots = bhAssociate.availability[existingIndex].slots;
        const mergedSlots = [];

        slots.forEach((time) => {
          const existingSlot = existingSlots.find((slot) => slot.time === time);
          if (existingSlot && existingSlot.isBooked) {
            // Keep booked slots as they are
            mergedSlots.push(existingSlot);
          } else {
            // Create new available slot, preserving possibleDurations if it existed
            const newSlot = {
              time,
              isAvailable: true,
              isBooked: false,
              duration: 30, // Default 30-minute duration for availability slots
              possibleDurations: existingSlot?.possibleDurations || [
                30, 50, 80,
              ], // Preserve existing possibleDurations
            };
            mergedSlots.push(newSlot);
          }
        });

        // Keep booked slots not in new pattern
        existingSlots.forEach((existingSlot) => {
          if (
            existingSlot.isBooked &&
            !slots.find((time) => time === existingSlot.time)
          ) {
            mergedSlots.push(existingSlot);
          }
        });

        bhAssociate.availability[existingIndex].slots = mergedSlots;
      } else {
        // Add new availability
        const slotObjects = slots.map((time) => ({
          time,
          isAvailable: true,
          isBooked: false,
          duration: 30, // Default 30-minute duration for availability slots
          possibleDurations: [30, 50, 80], // Default possible durations for new slots
        }));

        bhAssociate.availability.push({
          date: date,
          slots: slotObjects,
        });
      }

      // After updating this date's availability, check for 80-minute booking restrictions
      await updateSlotRestrictionsFor80MinBookings(bhAssociate, date);
    }

    // Update lastScheduleUpdates
    updateLastScheduleUpdates(bhAssociate);

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: `Availability updated for ${pattern} pattern`,
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error bulk updating availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --- ADMIN FUNCTIONS ---

// Get all BH Associates (Admin only)
export const getAllBHAssociates = async (req, res) => {
  try {
    const userId = req.id;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    } 

    // Get all BH Associates with their user data
    const bhAssociates = await BHAssociate.find({})
      .populate(
        "userId",
        "name email phoneNumber role type isVerified isActive createdAt updatedAt lastActiveAt"
      )
      .lean();

    // Format the response
    const formattedAssociates = bhAssociates.map((associate) => ({
      _id: associate._id,
      name: associate.userId.name,
      email: associate.userId.email,
      phoneNumber: associate.userId.phoneNumber,
      role: associate.userId.role,
      type: associate.userId.type,
      designation: associate.designation,
      specialization: associate.specialization,
      experienceYears: associate.experience,
      bio: associate.bio,
      isVerified: associate.userId.isVerified,
      isActive: associate.userId.isActive,
      createdAt: associate.userId.createdAt,
      lastActiveAt: associate.userId.lastActiveAt || "Never",
      lastScheduleUpdates: associate.lastScheduleUpdates || [],
    }));

    res.status(200).json({
      success: true,
      associates: formattedAssociates,
    });
  } catch (error) {
    console.error("Error fetching all BH Associates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all cosmetologists with availability filtering (Public endpoint)
export const getCosmetologists = async (req, res) => {
  try {
    const cosmetologists = await User.find({
      role: "doctor",
      type: "cosmetologist",
      isActive: true,
      isVerified: "verified",
    }).select("name photoUrl aboutUser.languages");

    // Get associate details for each cosmetologist
    const cosmetologistsWithDetails = await Promise.all(
      cosmetologists.map(async (cosmetologist) => {
        const associate = await BHAssociate.findOne({
          userId: cosmetologist._id,
        });

        // Find next available slot
        let nextAvailableSlot = null;
        if (associate?.availability) {
          const istTime = new Date();
          console.log(
            "Current IST Time:",
            istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          );
          const today = new Date(
            istTime.getFullYear(),
            istTime.getMonth(),
            istTime.getDate()
          );

          // Find the earliest available slot from today onwards
          for (const day of associate.availability.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )) {
            const slotDate = new Date(day.date);
            slotDate.setHours(0, 0, 0, 0);
            if (slotDate >= today) {
              const availableSlots = day.slots.filter(
                (slot) => slot.isAvailable && !slot.isBooked
              );
              if (availableSlots.length > 0) {
                // Sort slots by time
                const sortedSlots = availableSlots.sort((a, b) =>
                  a.time.localeCompare(b.time)
                );

                // Find the earliest slot that is not in the past for today
                let earliestSlot = null;
                const isToday = slotDate.getTime() === today.getTime();
                if (isToday) {
                  const currentHour = istTime.getHours();
                  const currentMinute = istTime.getMinutes();
                  const currentTimeInMinutes =
                    currentHour * 60 + currentMinute + 30; // Add 30 minutes buffer for notifications
                  for (const slot of sortedSlots) {
                    const [slotHour, slotMinute] = slot.time
                      .split(":")
                      .map(Number);
                    const slotTimeInMinutes = slotHour * 60 + slotMinute;
                    if (slotTimeInMinutes > currentTimeInMinutes) {
                      earliestSlot = slot;
                      break;
                    }
                  }
                } else {
                  earliestSlot = sortedSlots[0];
                }

                if (!earliestSlot) {
                  continue; // No future slots on today, go to next day
                }

                // Convert time to 12-hour format with AM/PM
                const convertTo12Hour = (time24) => {
                  const [hours, minutes] = time24.split(":");
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? "PM" : "AM";
                  const hour12 = hour % 12 || 12;
                  return `${hour12}:${minutes} ${ampm}`;
                };

                nextAvailableSlot = {
                  date:
                    slotDate.getFullYear() +
                    "-" +
                    String(slotDate.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(slotDate.getDate()).padStart(2, "0"),
                  time: convertTo12Hour(earliestSlot.time),
                  day: slotDate.toLocaleDateString("en-US", {
                    weekday: "short",
                  }),
                  fullDate: slotDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }),
                };
                break;
              }
            }
          }
        }

        console.log(
          `Next available slot for ${cosmetologist.name}:`,
          nextAvailableSlot
        );

        return {
          _id: cosmetologist._id,
          name: cosmetologist.name,
          photoUrl: cosmetologist.photoUrl,
          designation: associate?.designation || "Cosmetologist",
          bio: associate?.bio || "Experienced cosmetology professional",
          experience: associate?.experience || "1+ years",
          expertise: associate?.expertise || [
            "Facial",
            "Hair Care",
            "Skin Care",
          ],
          qualifications: associate?.qualifications || [
            "MBBS",
            "MD - Dermatology",
          ],
          languages: cosmetologist.aboutUser?.languages || ["Hindi", "English"],
          nextAvailableSlot: nextAvailableSlot,
        };
      })
    );

    // Filter out cosmetologists who don't have any available slots
    const cosmetologistsWithAvailableSlots = cosmetologistsWithDetails.filter(
      (cosmetologist) => cosmetologist.nextAvailableSlot !== null
    );

    // Sort cosmetologists by nearest available slot
    cosmetologistsWithAvailableSlots.sort((a, b) => {
      // If one has no available slot, put it at the end
      if (!a.nextAvailableSlot && !b.nextAvailableSlot) return 0;
      if (!a.nextAvailableSlot) return 1;
      if (!b.nextAvailableSlot) return -1;

      // Compare dates first
      const dateA = new Date(a.nextAvailableSlot.date);
      const dateB = new Date(b.nextAvailableSlot.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      // If same date, compare times
      return a.nextAvailableSlot.time.localeCompare(b.nextAvailableSlot.time);
    });

    res.status(200).json({
      success: true,
      cosmetologists: cosmetologistsWithAvailableSlots,
    });
  } catch (error) {
    console.error("Error fetching cosmetologists:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Associate Availability by ID (Admin only)
export const getAssociateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { associateId } = req.params;
    const { startDate, endDate } = req.query;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const bhAssociate = await BHAssociate.findById(associateId).populate(
      "userId",
      "name email"
    );

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate not found",
      });
    }

    let availabilityData = bhAssociate.availability;

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      availabilityData = availabilityData.filter((avail) => {
        const availDate = new Date(avail.date);
        return availDate >= start && availDate <= end;
      });
    }

    res.status(200).json({
      success: true,
      data: availabilityData,
      associate: {
        id: bhAssociate._id,
        name: bhAssociate.userId.name,
        email: bhAssociate.userId.email,
        type: bhAssociate.type,
        designation: bhAssociate.designation,
      },
    });
  } catch (error) {
    console.error("Error fetching associate availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Associate Availability by ID (Admin only)
export const updateAssociateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { associateId } = req.params;
    const { availabilityData } = req.body;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const bhAssociate = await BHAssociate.findById(associateId);

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate not found",
      });
    }

    // Process each date in availabilityData
    for (const dayData of availabilityData) {
      const targetDate = new Date(dayData.date);

      // Find existing availability for this date
      let dateAvailability = bhAssociate.availability.find((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === targetDate.toDateString();
      });

      if (!dateAvailability) {
        // Create new availability for this date
        dateAvailability = {
          date: targetDate,
          slots: [],
        };
        bhAssociate.availability.push(dateAvailability);
      }

      // Clear existing available slots (keep booked ones)
      dateAvailability.slots = dateAvailability.slots.filter(
        (slot) => slot.isBooked
      );

      // Add new available slots
      for (const timeSlot of dayData.slots) {
        // Check if this time slot already exists as booked
        const existingSlot = dateAvailability.slots.find(
          (slot) => slot.time === timeSlot
        );

        if (!existingSlot) {
          dateAvailability.slots.push({
            time: timeSlot,
            isAvailable: true,
            isBooked: false,
            duration: 30, // Default duration for available slots
            possibleDurations: [30, 50, 80],
          });
        }
      }

      // Sort slots by time
      dateAvailability.slots.sort((a, b) => a.time.localeCompare(b.time));

      // Update slot restrictions based on existing bookings
      await updateSlotRestrictionsFor80MinBookings(bhAssociate, targetDate);
    }

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: "Associate availability updated successfully",
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error updating associate availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear Associate Availability by ID (Admin only)
export const clearAssociateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { associateId } = req.params;
    const { dates } = req.body;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const bhAssociate = await BHAssociate.findById(associateId);

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate not found",
      });
    }

    // Clear availability for specified dates
    for (const dateStr of dates) {
      const targetDate = new Date(dateStr);

      // Find availability for this date
      const dateAvailability = bhAssociate.availability.find((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === targetDate.toDateString();
      });

      if (dateAvailability) {
        // Remove only available slots, keep booked ones
        dateAvailability.slots = dateAvailability.slots.filter(
          (slot) => slot.isBooked
        );

        // If no slots left, remove the entire date entry
        if (dateAvailability.slots.length === 0) {
          bhAssociate.availability = bhAssociate.availability.filter(
            (avail) => {
              const availDate = new Date(avail.date);
              return availDate.toDateString() !== targetDate.toDateString();
            }
          );
        }
      }
    }

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: "Associate availability cleared successfully",
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error clearing associate availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Bulk Update Associate Availability by ID (Admin only)
export const bulkUpdateAssociateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { associateId } = req.params;
    const { pattern, startDate, endDate, dayOfWeek, slots } = req.body;

    // Get the requesting user to check if they're admin
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const bhAssociate = await BHAssociate.findById(associateId);

    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH Associate not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const datesToUpdate = [];

    // Generate dates based on pattern
    if (pattern === "day") {
      // Apply to all dates with the same day of week in the range
      const currentDate = new Date(start);
      while (currentDate <= end) {
        if (currentDate.getDay() === dayOfWeek) {
          datesToUpdate.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (pattern === "week" || pattern === "month") {
      // Apply to all dates in the range
      const currentDate = new Date(start);
      while (currentDate <= end) {
        datesToUpdate.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Update availability for each date
    for (const targetDate of datesToUpdate) {
      // Find existing availability for this date
      let dateAvailability = bhAssociate.availability.find((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === targetDate.toDateString();
      });

      if (!dateAvailability) {
        // Create new availability for this date
        dateAvailability = {
          date: targetDate,
          slots: [],
        };
        bhAssociate.availability.push(dateAvailability);
      }

      // Clear existing available slots (keep booked ones)
      dateAvailability.slots = dateAvailability.slots.filter(
        (slot) => slot.isBooked
      );

      // Add new available slots
      for (const timeSlot of slots) {
        // Check if this time slot already exists as booked
        const existingSlot = dateAvailability.slots.find(
          (slot) => slot.time === timeSlot
        );

        if (!existingSlot) {
          dateAvailability.slots.push({
            time: timeSlot,
            isAvailable: true,
            isBooked: false,
            duration: 30, // Default duration for available slots
            possibleDurations: [30, 50, 80],
          });
        }
      }

      // Sort slots by time
      dateAvailability.slots.sort((a, b) => a.time.localeCompare(b.time));

      // Update slot restrictions based on existing bookings
      await updateSlotRestrictionsFor80MinBookings(bhAssociate, targetDate);
    }

    await bhAssociate.save();

    res.status(200).json({
      success: true,
      message: `Associate availability updated for ${pattern} pattern`,
      data: bhAssociate.availability,
    });
  } catch (error) {
    console.error("Error bulk updating associate availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
