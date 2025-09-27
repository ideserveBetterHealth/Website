import { User } from "../models/user.model.js";
import BHAssociate from "../models/bhAssociate.model.js";

export const getPsychologists = async (req, res) => {
  try {
    const psychologists = await User.find({
      role: "doctor",
      type: "psychologist",
      isActive: true,
      isVerified: "verified",
    }).select("name photoUrl aboutUser.languages");

    // Get associate details for each psychologist
    const psychologistsWithDetails = await Promise.all(
      psychologists.map(async (psych) => {
        const associate = await BHAssociate.findOne({ userId: psych._id });

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
          `Next available slot for ${psych.name}:`,
          nextAvailableSlot
        );

        return {
          _id: psych._id,
          name: psych.name,
          photoUrl: psych.photoUrl,
          designation: associate?.designation || "Clinical Psychologist",
          bio: associate?.bio || "Experienced mental health professional",
          qualifications:
            associate?.qualifications || "M.A., Ph.D. in Psychology",
          experience: associate?.experience || "1+ years",
          expertise: associate?.expertise || ["CBT", "Counseling", "Therapy"],
          languages: psych.aboutUser?.languages || ["Hindi", "English"],
          nextAvailableSlot: nextAvailableSlot,
        };
      })
    );

    // Filter out psychologists who don't have any available slots
    const psychologistsWithAvailableSlots = psychologistsWithDetails.filter(
      (psych) => psych.nextAvailableSlot !== null
    );

    // Sort psychologists by nearest available slot
    psychologistsWithAvailableSlots.sort((a, b) => {
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

      // If dates are the same, compare times
      return a.nextAvailableSlot.time.localeCompare(b.nextAvailableSlot.time);
    });

    return res.status(200).json({
      success: true,
      psychologists: psychologistsWithAvailableSlots,
    });
  } catch (error) {
    console.log("Error in getPsychologists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get psychologists.",
    });
  }
};

export const getPsychologistAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, duration } = req.query;

    const associate = await BHAssociate.findOne({ userId: id });

    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Psychologist not found.",
      });
    }

    let availability = [];

    if (date) {
      // Get availability for specific date
      const requestedDate = new Date(date);

      const dateAvailability = associate.availability.find((av) => {
        const avDate = new Date(av.date);
        return avDate.toDateString() === requestedDate.toDateString();
      });

      if (dateAvailability) {
        availability = [dateAvailability];
      }
    } else {
      // Get availability for next 30 days
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

      const thirtyDaysLater = new Date(today);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

      availability = associate.availability.filter((av) => {
        const avDate = new Date(av.date);
        return avDate >= today && avDate <= thirtyDaysLater;
      });
    }

    // Filter only available slots and check possibleDurations if duration is provided
    const filteredAvailability = availability
      .map((day) => ({
        date: day.date,
        slots: day.slots.filter((slot) => {
          // Basic availability check
          const isBasicallyAvailable = slot.isAvailable && !slot.isBooked;

          // If no duration specified, return all available slots
          if (!duration || !isBasicallyAvailable) {
            return isBasicallyAvailable;
          }

          // Check if the requested duration is allowed for this slot
          const requestedDuration = parseInt(duration);
          if (slot.possibleDurations && slot.possibleDurations.length > 0) {
            return slot.possibleDurations.includes(requestedDuration);
          }

          // If no possibleDurations specified, allow all standard durations
          return true;
        }),
      }))
      .filter((day) => day.slots.length > 0);

    return res.status(200).json({
      success: true,
      availability: filteredAvailability,
    });
  } catch (error) {
    console.log("Error in getPsychologistAvailability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get availability.",
    });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;
    const { availability } = req.body;

    const user = await User.findById(userId);

    // Only the psychologist themselves or admin can update availability
    if (user.role !== "admin" && userId !== id) {
      return res.status(403).json({
        message: "Access denied: You can only update your own availability.",
      });
    }

    const associate = await BHAssociate.findOne({ userId: id });

    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Psychologist not found.",
      });
    }

    // Update availability
    associate.availability = availability;
    await associate.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      availability: associate.availability,
    });
  } catch (error) {
    console.log("Error in updateAvailability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update availability.",
    });
  }
};
