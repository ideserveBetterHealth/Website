import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import BHAssociate from "../models/bhAssociate.model.js";
import { Meeting } from "../models/meetings.model.js";
import moment from "moment-timezone";
import sendMessageViaWhatsApp from "../services/whatsappService.js";

// Helper function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Helper function to format date with comma
const formatDateWithComma = (date) => {
  const dateObj = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};

// const updateAvailabilitySlot = async (
//   bhAssociateId,
//   serviceType,
//   meetingTime,
//   meetingDate,
//   duration
// ) => {

// };

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

function addMinutesToTime(timeString, minutesToAdd) {
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
}

const jitsiMeetGenerator = (clientName, bhAssocName) => {
  return `https://meet.jit.si/${bhAssocName}_AND_${clientName}_BH_Mid_${Math.floor(
    Math.random() * 100000
  )}`;
};

const createMeeting = async (
  userId,
  bhAssociateId,
  meetingDate,
  meetingTime,
  duration,
  clientName = null,
  serviceType,
  questionnaireResponses = {}
) => {
  try {
    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user name if clientName is provided and user doesn't have a name or name is empty
    if (
      clientName &&
      clientName.trim() &&
      (!user.name || user.name.trim() === "")
    ) {
      console.log(`Updating user name from "${user.name}" to "${clientName}"`);
      user.name = clientName.trim();
      try {
        await user.save();
        console.log(`User name updated successfully to: ${user.name}`);
      } catch (saveError) {
        console.error("Error saving user name:", saveError);
        // Don't throw here, continue with meeting creation
      }
    }

    const bhAssociate = await BHAssociate.findOne({
      userId: bhAssociateId,
    }).populate("userId");
    if (!bhAssociate) {
      throw new Error("BH Associate not found");
    }

    // Check slot availability BEFORE creating the meeting
    const appointmentDate = new Date(meetingDate);

    // Find the BH Associate and check the specific slot
    const associateToUpdate = await BHAssociate.findOne({
      userId: bhAssociateId,
    });

    if (!associateToUpdate) {
      throw new Error("Associate not found for slot validation");
    }

    // Find the availability for the specific date
    const dateAvailability = associateToUpdate.availability.find((avail) => {
      console.log(appointmentDate);
      const availDate = new Date(avail.date);
      return availDate.toDateString() === appointmentDate.toDateString();
    });

    if (!dateAvailability) {
      throw new Error(
        `No availability found for associate on ${appointmentDate.toDateString()}`
      );
    }

    // Find the specific time slot
    const timeSlot = dateAvailability.slots.find(
      (slot) => slot.time === meetingTime && slot.isAvailable && !slot.isBooked
    );

    if (!timeSlot) {
      throw new Error(
        `Time slot ${meetingTime} is not available or already booked on ${appointmentDate.toDateString()}`
      );
    }

    // Check if the requested duration is allowed for this slot
    if (timeSlot.possibleDurations && timeSlot.possibleDurations.length > 0) {
      const requestedDuration = parseInt(duration);
      if (!timeSlot.possibleDurations.includes(requestedDuration)) {
        throw new Error(
          `Duration ${duration} minutes is not allowed for this time slot. Available durations: ${timeSlot.possibleDurations.join(
            ", "
          )}`
        );
      }
    }

    // Double-check the slot is still available (race condition protection)
    if (!timeSlot.isAvailable || timeSlot.isBooked) {
      throw new Error(
        `Time slot ${meetingTime} was just booked by someone else. Please select another time.`
      );
    }

    // Create the meeting only if slot is available
    const meetingLink = jitsiMeetGenerator(
      user.name.split(" ")[0],
      bhAssociate.userId.name.toLowerCase().includes("dr.")
        ? bhAssociate.userId.name.split(" ")[1]
        : bhAssociate.userId.name.split(" ")[0]
    );

    const meeting = await Meeting.create({
      userId,
      clientName: user.name,
      bhAssocId: bhAssociateId,
      bhAssocName: bhAssociate.userId.name,
      meetingDate,
      meetingTime,
      duration,
      meetingLink,
      formLink: "https://forms.gle/xyz",
      serviceType,
      questionnaireResponses: new Map(
        Object.entries(questionnaireResponses || {})
      ),
    });

    // Update the main slot: mark as unavailable and booked, set meetingId
    timeSlot.isAvailable = false;
    timeSlot.isBooked = true;
    timeSlot.meetingId = meeting._id;
    timeSlot.duration = duration;

    // Get slots to update for blocking adjacent slots (but don't save yet)
    let slotsToBlock = [];
    let only50PossibleSlots = [];

    if (serviceType === "mental_health") {
      if (duration == 50 || duration === "50") {
        slotsToBlock.push(subtractMinutesFromTime(meetingTime, 30));
        slotsToBlock.push(addMinutesToTime(meetingTime, 30));
      }
      if (duration == 80 || duration === "80") {
        slotsToBlock.push(subtractMinutesFromTime(meetingTime, 30));
        slotsToBlock.push(addMinutesToTime(meetingTime, 30));
        slotsToBlock.push(addMinutesToTime(meetingTime, 60));
        // The 60-minute before slot needs special handling
        only50PossibleSlots.push(subtractMinutesFromTime(meetingTime, 60));
      }
    }
    if (serviceType === "cosmetology") {
      slotsToBlock.push(subtractMinutesFromTime(meetingTime, 30));
      slotsToBlock.push(addMinutesToTime(meetingTime, 30));
    }

    // Update slots to block
    for (const timeString of slotsToBlock) {
      const slot = dateAvailability.slots.find((s) => s.time === timeString);
      if (slot && slot.isAvailable && !slot.isBooked) {
        slot.isAvailable = false;
        slot.isBooked = false;
        console.log(`Slot ${timeString} was available and is now blocked.`);
      }
    }

    // Update slots that need possibleDurations changed to [50]
    for (const timeString of only50PossibleSlots) {
      const slot = dateAvailability.slots.find((s) => s.time === timeString);
      if (slot && slot.isAvailable && !slot.isBooked) {
        slot.possibleDurations = [50];
        console.log(`Slot ${timeString} possibleDurations changed to [50].`);
      }
    }

    // Save the document once with all changes (with retry for version conflicts)
    let retries = 3;
    while (retries > 0) {
      try {
        await associateToUpdate.save();
        console.log(
          `Successfully updated availability slot for associate ${bhAssociateId} on ${appointmentDate.toDateString()} at ${meetingTime}`
        );
        break; // Success, exit retry loop
      } catch (saveError) {
        retries--;
        if (saveError.name === "VersionError" && retries > 0) {
          console.log(
            `Version conflict detected, retrying... (${retries} attempts remaining)`
          );
          // Refetch the document to get the latest version
          const refreshedAssociate = await BHAssociate.findOne({
            userId: bhAssociateId,
          });
          if (refreshedAssociate) {
            // Find the date availability again
            const refreshedDateAvailability =
              refreshedAssociate.availability.find((avail) => {
                const availDate = new Date(avail.date);
                return (
                  availDate.toDateString() === appointmentDate.toDateString()
                );
              });

            if (refreshedDateAvailability) {
              // Re-apply all the slot updates to the refreshed document
              const refreshedTimeSlot = refreshedDateAvailability.slots.find(
                (slot) => slot.time === meetingTime
              );

              if (
                refreshedTimeSlot &&
                refreshedTimeSlot.isAvailable &&
                !refreshedTimeSlot.isBooked
              ) {
                // Update main slot
                refreshedTimeSlot.isAvailable = false;
                refreshedTimeSlot.isBooked = true;
                refreshedTimeSlot.meetingId = meeting._id;
                refreshedTimeSlot.duration = duration;

                // Re-apply blocking logic
                for (const timeString of slotsToBlock) {
                  const slot = refreshedDateAvailability.slots.find(
                    (s) => s.time === timeString
                  );
                  if (slot && slot.isAvailable && !slot.isBooked) {
                    slot.isAvailable = false;
                    slot.isBooked = false;
                  }
                }

                // Re-apply possibleDurations changes
                for (const timeString of only50PossibleSlots) {
                  const slot = refreshedDateAvailability.slots.find(
                    (s) => s.time === timeString
                  );
                  if (slot && slot.isAvailable && !slot.isBooked) {
                    slot.possibleDurations = [50];
                  }
                }

                associateToUpdate = refreshedAssociate;
                continue; // Try saving again
              }
            }
          }
        }
        // If not a version error or no retries left, throw the error
        throw saveError;
      }
    }

    console.log(`Meeting created successfully: ${meeting._id}`);
    return meeting;
  } catch (error) {
    console.error("Error creating meeting:", error);

    // Provide more specific error messages for common issues
    if (error.name === "VersionError") {
      throw new Error(
        "The availability schedule was just updated by someone else. Please try again."
      );
    } else if (
      error.message.includes("not available") ||
      error.message.includes("already booked")
    ) {
      throw error; // Pass through slot availability errors as-is
    } else if (
      error.message.includes("Duration") &&
      error.message.includes("not allowed")
    ) {
      throw error; // Pass through duration validation errors as-is
    } else {
      throw new Error("Failed to book the session. Please try again.");
    }
  }
};

const cancelMeeting = async (meetingId) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Find the associate and free up the slot
    const associate = await BHAssociate.findOne({ userId: meeting.bhAssocId });
    if (associate) {
      const meetingDate = new Date(meeting.meetingDate);

      // Find the availability for the specific date
      const dateAvailability = associate.availability.find((avail) => {
        const availDate = new Date(avail.date);
        return availDate.toDateString() === meetingDate.toDateString();
      });

      if (dateAvailability) {
        // Find the specific time slot with this meetingId
        const timeSlot = dateAvailability.slots.find(
          (slot) =>
            slot.meetingId && slot.meetingId.toString() === meetingId.toString()
        );

        if (timeSlot) {
          // Free up the slot: mark as available and not booked, remove meetingId
          timeSlot.isAvailable = true;
          timeSlot.isBooked = false;
          timeSlot.meetingId = null;

          await associate.save();
          console.log(
            `Successfully freed up availability slot for meeting ${meetingId}`
          );
        }
      }
    }

    // Delete the meeting
    await Meeting.findByIdAndDelete(meetingId);
    console.log(`Meeting ${meetingId} cancelled successfully`);

    return { success: true, message: "Meeting cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    throw error;
  }
};

// Route handlers for meeting management
export const getMeetings = async (req, res) => {
  try {
    console.log("=== getMeetings API Called ===");
    const userId = req.id;
    console.log("User ID from request:", userId);

    const user = await User.findById(userId);
    console.log(
      "User found:",
      user ? `${user.name} (${user.role})` : "Not found"
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let meetings;
    if (user.role === "admin") {
      console.log("🔍 Admin user - fetching all meetings");
      // Admin can see all meetings
      meetings = await Meeting.find()
        .populate("userId", "name phoneNumber")
        .populate("bhAssocId", "name")
        .sort({ meetingDate: -1 });
    } else if (user.role === "doctor") {
      console.log("🔍 Doctor user - fetching doctor's meetings");
      // Doctor sees meetings where they are the bhAssocId
      meetings = await Meeting.find({ bhAssocId: userId })
        .populate("userId", "name phoneNumber")
        .sort({ meetingDate: -1 });
    } else {
      console.log("🔍 Regular user - fetching user's meetings");
      // Regular users see only their meetings
      meetings = await Meeting.find({ userId })
        .populate("bhAssocId", "name")
        .sort({ meetingDate: -1 });
    }

    console.log("📊 Meetings found:", meetings.length);
    console.log(
      "📋 Meeting details:",
      meetings.map((m) => ({
        id: m._id,
        clientName: m.clientName,
        bhAssocName: m.bhAssocName,
        date: m.meetingDate,
        time: m.meetingTime,
      }))
    );

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};

// export const deleteMeeting = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.id;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid meeting ID",
//       });
//     }

//     // Check if user is admin
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Only admins can delete meetings",
//       });
//     }

//     const result = await cancelMeeting(id);

//     res.status(200).json({
//       success: true,
//       message: result.message,
//     });
//   } catch (error) {
//     console.error("Error deleting meeting:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete meeting",
//     });
//   }
// };

export const meetingJoinedAt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meeting ID",
      });
    }

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Update join time based on user role
    const user = await User.findById(userId);
    const currentTime = new Date().toISOString();

    if (meeting.userId.toString() === userId) {
      // Client joining
      meeting.userJoinedAt = currentTime;
    } else if (meeting.bhAssocId.toString() === userId) {
      // Doctor/Associate joining
      meeting.docJoinedAt = currentTime;
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to join this meeting",
      });
    }

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Join time updated successfully",
      meeting,
    });
  } catch (error) {
    console.error("Error updating meeting join time:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update join time",
    });
  }
};

export const userAllMeetings = async (req, res) => {
  try {
    const userId = req.id;

    const meetings = await Meeting.find({ userId })
      .populate("bhAssocId", "name specialization")
      .sort({ meetingDate: -1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("Error fetching user meetings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};

// HTTP endpoint for creating meetings using credits
export const createMeetingFromCredits = async (req, res) => {
  try {
    const userId = req.id;
    const {
      bhAssociateId,
      meetingDate,
      meetingTime,
      duration,
      serviceType,
      questionnaireResponses,
    } = req.body;

    // Validate required fields
    if (!bhAssociateId || !meetingDate || !meetingTime || !duration) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: bhAssociateId, meetingDate, meetingTime, duration",
      });
    }

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the BH-Associate by ID
    const bhAssociate = await User.findById(bhAssociateId);
    if (!bhAssociate) {
      return res.status(404).json({
        success: false,
        message: "BH-Associate not found",
      });
    }

    // Check if user has sufficient credits
    const userCredits = user.credits.find(
      (credit) =>
        credit.serviceType === serviceType && credit.duration === duration
    );

    if (!userCredits || userCredits.count <= 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits for ${serviceType} session of ${duration} minutes`,
      });
    }

    // Create the meeting using the existing function
    const meeting = await createMeeting(
      userId,
      bhAssociate._id,
      meetingDate,
      meetingTime,
      duration,
      user.name,
      serviceType,
      questionnaireResponses || {}
    );

    // Deduct credit from user
    userCredits.count -= 1;
    await user.save();

    // Send WhatsApp notifications
    try {
      // Send confirmation to user
      await sendMessageViaWhatsApp(
        `+91${user.phoneNumber}`,
        `*BetterHealth – Session Scheduled*\n\nHello ${
          user.name
        },\n\nYour session with ${
          meeting.bhAssocName
        } has been scheduled on ${formatDateWithComma(
          meetingDate
        )} at ${convertTo12Hour(
          meetingTime
        )}.\n\nWe look forward to supporting you in your journey with BetterHealth.\n\nBest regards,\nTeam BetterHealth 🧡`
      );

      // Send notification to psychologist/BH Associate
      await sendMessageViaWhatsApp(
        `+91${bhAssociate.phoneNumber}`,
        `*BetterHealth – New Session Assigned*\n\nHello ${
          bhAssociate.name
        },\n\nYou have been assigned a new session:\n\n📅 Session Details:\n• Client: ${
          user.name
        }\n• Scheduled Date: ${formatDateWithComma(
          meetingDate
        )}\n• Scheduled Time: ${convertTo12Hour(
          meetingTime
        )}\n• Duration: ${duration} minutes\n\nBe prepared, and make sure you join the session on time.\n\nBest regards,\nTeam BetterHealth 🧡`
      );
      console.log(`✅ Psychologist notification sent to ${bhAssociate.name}`);

      // Send admin notifications
      const adminPhoneNumbers = await User.find({ role: "admin" }).select(
        "name phoneNumber"
      );

      for (const admin of adminPhoneNumbers) {
        await sendMessageViaWhatsApp(
          `+91${admin.phoneNumber}`,
          `*BetterHealth – Management Alert*\n\nHello ${
            admin.name
          },\n\n📅 New Session Scheduled:\n• Client: ${
            user.name
          }\n• BH Associate: ${
            meeting.bhAssocName
          }\n• Scheduled Date: ${formatDateWithComma(
            meetingDate
          )}\n• Scheduled Time: ${convertTo12Hour(
            meetingTime
          )}\n• Duration: ${duration} minutes\n• Service: ${serviceType}\n\nBest regards,\nBetterHealth Automated System 🧡`
        );
        console.log(`✅ Admin notification sent to ${admin.name}`);
      }
    } catch (notificationError) {
      console.error("Error sending WhatsApp notifications:", notificationError);
      // Don't fail the meeting creation if notifications fail
    }

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully using credits",
      meeting: meeting,
      remainingCredits: userCredits.count,
    });
  } catch (error) {}
};

// Function to get meeting details for the next half-hour slot
const getNextHalfHourSlotMeetings = async () => {
  try {
    console.log("=== getNextHalfHourSlotMeetings Function Called ===");

    // Get current date and time in IST (Indian Standard Time)
    const nowIST = moment().tz("Asia/Kolkata");
    const currentDate = nowIST.format("YYYY-MM-DD"); // YYYY-MM-DD format in IST
    const currentTime = nowIST.format("HH:mm"); // HH:MM format in IST

    // Calculate next half-hour slot
    const [hours, minutes] = currentTime.split(":").map(Number);
    let nextMinutes = minutes < 30 ? 30 : 0;
    let nextHours = minutes < 30 ? hours : (hours + 1) % 24;

    const nextSlotTime = `${String(nextHours).padStart(2, "0")}:${String(
      nextMinutes
    ).padStart(2, "0")}`;

    console.log(`Current IST time: ${currentTime}, Next slot: ${nextSlotTime}`);

    const startOfDayIST = moment.tz(
      `${currentDate} 00:00:00`,
      "YYYY-MM-DD HH:mm:ss",
      "Asia/Kolkata"
    );
    const endOfDayIST = moment.tz(
      `${currentDate} 23:59:59`,
      "YYYY-MM-DD HH:mm:ss",
      "Asia/Kolkata"
    );

    // Convert to UTC for database query (MongoDB stores dates in UTC)
    const startOfDayUTC = startOfDayIST.utc().toDate();
    const endOfDayUTC = endOfDayIST.utc().toDate();

    console.log(
      `Querying meetings from ${startOfDayUTC.toISOString()} to ${endOfDayUTC.toISOString()} (IST: ${currentDate})`
    );

    // Query meetings for today with the next slot time
    const meetings = await Meeting.find({
      meetingDate: {
        $gte: startOfDayUTC,
        $lt: endOfDayUTC,
      },
      meetingTime: nextSlotTime,
    })
      .populate("userId", "name phoneNumber")
      .populate("bhAssocId", "name phoneNumber")
      .sort({ meetingDate: 1 });

    console.log(
      `📊 Found ${meetings.length} meetings for next slot (${nextSlotTime}) in IST`
    );
    console.log(
      `🔍 Query details: IST Date: ${currentDate}, Time: ${currentTime}, Next Slot: ${nextSlotTime}`
    );
    console.log(
      `🔍 UTC Range: ${startOfDayUTC.toISOString()} to ${endOfDayUTC.toISOString()}`
    );

    if (meetings.length > 0) {
      console.log("📋 Meetings ready for processing:");
      meetings.forEach((meeting, index) => {
        const meetingDateIST = moment(meeting.meetingDate)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD");
        console.log(
          `${index + 1}. ${meeting.clientName} - ${
            meeting.bhAssocName
          } | Date: ${meetingDateIST} | Time: ${
            meeting.meetingTime
          } IST | Duration: ${meeting.duration}min`
        );
      });
    }

    return {
      success: true,
      nextSlotTime,
      currentIST: currentTime,
      meetings: meetings.map((meeting) => ({
        id: meeting._id,
        clientName: meeting.userId.name,
        bhAssocName: meeting.bhAssocId.name,
        clientPhoneNumber: meeting.userId.phoneNumber,
        bhAssocPhoneNumber: meeting.bhAssocId.phoneNumber,
        meetingDate: meeting.meetingDate,
        meetingTime: meeting.meetingTime,
        duration: meeting.duration,
      })),
    };
  } catch (error) {
    console.error("❌ Error fetching next half-hour slot meetings:", error);
    return {
      success: false,
      message: "Failed to fetch next half-hour slot meetings",
      error: error.message,
    };
  }
};

// Delete meeting function
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    console.log("=== Delete Meeting Request ===");
    console.log("Meeting ID:", id);
    console.log("User ID:", userId);

    // Find the meeting
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      console.log("❌ Meeting not found");
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Check if user has permission to delete
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only admin can delete meetings
    if (user.role !== "admin") {
      console.log("❌ Access denied - only admin can delete meetings");
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can delete meetings.",
      });
    }

    // Delete the meeting
    await Meeting.findByIdAndDelete(id);
    console.log("✅ Meeting deleted successfully");

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting meeting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
};

// Export the createMeeting function for use in payment controller
export { createMeeting, getNextHalfHourSlotMeetings, deleteMeeting };
