import moment from "moment"; // For easier date manipulation
import { Meeting } from "../models/meetings.model.js";
import { User } from "../models/user.model.js";

// You'll need to install moment: npm install moment

// Utility function to get date range
const getDateRange = (daysOffset) => {
  const today = moment().startOf("day"); // Start of current day
  const startDate = today.clone().subtract(daysOffset, "days").toDate();
  const endDate = today.clone().add(daysOffset, "days").endOf("day").toDate();
  return { startDate, endDate };
};

// Main controller function
export const getMeetings = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;
  const userEmail = user.email;

  let query = {};
  const now = new Date();

  // For user viewing, we need to consider both date and time
  // const isPastMeeting = (meeting) => {
  //   const meetingDateTime = new Date(meeting.meetingDate);
  //   const [timePart, ampm] = meeting.meetingTime.split(" ");
  //   const [hours, minutes] = timePart.split(":").map(Number);

  //   const adjustedHours =
  //     ampm.toLowerCase() === "pm" && hours !== 12
  //       ? hours + 12
  //       : ampm.toLowerCase() === "am" && hours === 12
  //       ? 0
  //       : hours;

  //   meetingDateTime.setHours(adjustedHours, minutes, 0, 0);

  //   // Add one hour buffer
  //   const oneHourAfterMeeting = new Date(meetingDateTime);
  //   oneHourAfterMeeting.setHours(oneHourAfterMeeting.getHours() + 1);

  //   return oneHourAfterMeeting < now;
  // };

  try {
    if (role === "admin") {
      // Admin: Past 30 days to next 30 days for everyone
      const { startDate, endDate } = getDateRange(30);
      query = {
        meetingDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    } else if (role === "doctor") {
      // Doctor: Past 7 days to next 7 days, but only for this doctor
      const { startDate, endDate } = getDateRange(7);
      query = {
        doctorId: userEmail, // Filter by the doctor's email
        meetingDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    } else if (role === "user") {
      // Normal User: Get all future meetings (including today)
      const today = moment().startOf("day").toDate();
      query = {
        clientId: userEmail, // Filter by the client's email
        meetingDate: {
          $gte: today,
        },
      };
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: Invalid user role." });
    }

    const meetings = await Meeting.find(query).sort({
      meetingDate: 1,
      meetingTime: 1,
    });

    if (meetings.length === 0) {
      return res
        .status(200) // Changed from 404 to 200 - empty results are normal
        .json([]); // Return empty array instead of error
    }

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({
      message: "Server error while fetching meetings.",
      error: error.message,
    });
  }
};

export const createMeeting = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can create meetings.",
    });
  }

  const {
    clientId,
    doctorId,
    meetingDate,
    meetingTime,
    meetingLink,
    formLink,
  } = req.body;

  if (
    !clientId ||
    !doctorId ||
    !meetingDate ||
    !meetingTime ||
    !meetingLink ||
    !formLink
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required meeting fields." });
  }

  // Parse meeting date without time component (just the date part)
  const parsedMeetingDate = new Date(meetingDate);
  if (isNaN(parsedMeetingDate.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid meetingDate format. Use YYYY-MM-DD format." });
  }

  // Get current date in IST (ignoring time part)
  const today = new Date();

  // Create date-only objects for comparison (removing time parts)
  const todayDateOnly = new Date(today.toISOString().split("T")[0]);
  const meetingDateOnly = new Date(
    parsedMeetingDate.toISOString().split("T")[0]
  );

  // Compare only the date portions
  if (meetingDateOnly < todayDateOnly) {
    return res
      .status(400)
      .json({ message: "Meeting date must be today or in the future." });
  }

  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?(AM|PM)$/i;
  if (!timeRegex.test(meetingTime)) {
    return res.status(400).json({
      message: "Invalid meetingTime format. Expected format: HH:MM AM/PM",
    });
  }

  // If meeting is today, check if the time is in the past
  if (meetingDateOnly.getTime() === todayDateOnly.getTime()) {
    // Parse meeting time
    const [timePart, ampm] = meetingTime.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format
    const adjustedHours =
      ampm.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : ampm.toLowerCase() === "am" && hours === 12
        ? 0
        : hours;

    // Current time components
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Compare time components for today's meeting
    if (
      adjustedHours < currentHour ||
      (adjustedHours === currentHour && minutes <= currentMinute)
    ) {
      return res
        .status(400)
        .json({ message: "Meeting time must be in the future." });
    }
  }

  const cN = await User.findOne({ email: clientId });
  const dN = await User.findOne({ email: doctorId });

  try {
    const newMeeting = new Meeting({
      clientId,
      clientName: cN.name,
      doctorId,
      doctorName: dN.name,
      meetingDate: parsedMeetingDate,
      meetingTime,
      meetingLink,
      formLink,
    });

    const createdMeeting = await newMeeting.save();
    return res.status(201).json(createdMeeting);
  } catch (error) {
    console.error("Error creating meeting:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    return res.status(500).json({
      message: "Server error while creating meeting.",
      error: error.message,
    });
  }
};

export const meetingJoinedAt = async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;
  const userEmail = user.email;

  try {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Get current time in IST (UTC+5:30)
    const now = moment().utcOffset("+05:30");

    // Extract just the date part from meetingDate and convert to IST
    const meetingDateOnly = moment(meeting.meetingDate)
      .utcOffset("+05:30")
      .startOf("day");

    // Parse the meetingTime string
    const [timePart, ampm] = meeting.meetingTime.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format
    const adjustedHours =
      ampm.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : ampm.toLowerCase() === "am" && hours === 12
        ? 0
        : hours;

    // Combine date and time to create the full meeting datetime in IST
    const meetingDateTime = meetingDateOnly
      .clone()
      .hour(adjustedHours)
      .minute(minutes)
      .second(0)
      .millisecond(0);

    // Allow joining 5 minutes before the scheduled time
    const joinWindow = meetingDateTime.clone().subtract(5, "minutes");

    // Debug logging for timezone issues
    console.log("Meeting Join Debug:", {
      meetingId,
      userEmail,
      role,
      currentTimeIST: now.format("YYYY-MM-DD HH:mm:ss"),
      meetingDateFromDB: meeting.meetingDate,
      meetingTimeFromDB: meeting.meetingTime,
      calculatedMeetingDateTime: meetingDateTime.format("YYYY-MM-DD HH:mm:ss"),
      joinWindowIST: joinWindow.format("YYYY-MM-DD HH:mm:ss"),
      canJoinNow: now.isAfter(joinWindow),
      minutesUntilJoin: joinWindow.diff(now, "minutes"),
    });

    // Check if current time is before the join window
    if (now.isBefore(joinWindow)) {
      const minutesUntilMeeting = joinWindow.diff(now, "minutes");

      return res.status(403).json({
        message: `Meeting has not started yet. You can join ${minutesUntilMeeting} minutes before the scheduled time.`,
        scheduledTime: meetingDateTime.format("YYYY-MM-DD HH:mm:ss") + " IST",
        joinWindow: joinWindow.format("YYYY-MM-DD HH:mm:ss") + " IST",
        currentTime: now.format("YYYY-MM-DD HH:mm:ss") + " IST",
      });
    }

    // Check user authorization
    if (role === "user" && meeting.clientId !== userEmail) {
      return res.status(403).json({
        message: "Access denied: You can only join your own meetings.",
      });
    } else if (role === "doctor" && meeting.doctorId !== userEmail) {
      return res.status(403).json({
        message: "Access denied: You can only join your own meetings.",
      });
    }

    // Check if already joined
    if (role === "user" && meeting.userJoinedAt) {
      return res.status(200).json({
        message: "Meeting already joined.",
        joinedAt: meeting.userJoinedAt,
      });
    }

    if (role === "doctor" && meeting.docJoinedAt) {
      return res.status(200).json({
        message: "Meeting already joined.",
        joinedAt: meeting.docJoinedAt,
      });
    }

    // Record join time in IST but store as UTC
    const joinedAt = moment().utc().toISOString();

    if (role === "user") {
      meeting.userJoinedAt = joinedAt;
    } else if (role === "doctor") {
      meeting.docJoinedAt = joinedAt;
    }

    await meeting.save();

    return res.status(200).json({
      message: "Meeting joined successfully.",
      joinedAt: joinedAt,
    });
  } catch (error) {
    console.error("Error joining meeting:", error);
    return res.status(500).json({
      message: "Server error while joining meeting.",
      error: error.message,
    });
  }
};

export const deleteMeeting = async (req, res) => {
  const { meetingId } = req.params;
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can delete meetings.",
    });
  }
  try {
    const meeting = await Meeting.findByIdAndDelete(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }
    return res.status(200).json({ message: "Meeting deleted successfully." });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return res.status(500).json({
      message: "Server error while deleting meeting.",
      error: error.message,
    });
  }
};

export const userAllMeetings = async (req, res) => {
  const userId = req.body.userId;
  const otherId = req.id;
  const user = await User.findById(otherId);
  const role = user.role;

  if (role == "user") {
    return res.status(403).json({
      message: "Access denied: Only users can view their meetings.",
    });
  }

  try {
    let meetings;
    if (role == "doctor") {
      meetings = await Meeting.find({
        clientId: userId,
        doctorId: user.email,
      }).sort({
        meetingDate: -1,
        meetingTime: -1,
      });
    }

    if (role == "admin") {
      meetings = await Meeting.find({
        $or: [{ clientId: userId }, { doctorId: userId }],
      }).sort({
        meetingDate: -1,
        meetingTime: -1,
      });
    }

    if (meetings.length === 0) {
      return res.status(200).json([]); // Return empty array if no meetings found
    }

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching user's meetings:", error);
    res.status(500).json({
      message: "Server error while fetching user's meetings.",
      error: error.message,
    });
  }
};

export const verifyUserEmail = async (req, res) => {
  const { email, userType } = req.body; // userType can be 'client' or 'doctor'
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can verify user emails.",
    });
  }

  if (!email || !userType) {
    return res.status(400).json({
      message: "Email and userType are required.",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(404).json({
        message: `No user found with email: ${email}`,
      });
    }

    // Check if the user role matches the expected type
    if (userType === "client" && foundUser.role !== "user") {
      return res.status(400).json({
        message: `User with email ${email} is not a client. Found role: ${foundUser.role}`,
      });
    }

    if (userType === "doctor" && foundUser.role !== "doctor") {
      return res.status(400).json({
        message: `User with email ${email} is not a doctor. Found role: ${foundUser.role}`,
      });
    }

    // Return user information
    return res.status(200).json({
      success: true,
      user: {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error("Error verifying user email:", error);
    return res.status(500).json({
      message: "Server error while verifying user email.",
      error: error.message,
    });
  }
};
