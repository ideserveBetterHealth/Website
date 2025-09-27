import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetMeetingsQuery,
  useDeleteMeetingMutation,
} from "../features/api/meetingsApi";

import { Calendar, Clock, User, Users, Trash2, FileText } from "lucide-react";
import PropTypes from "prop-types";

const ViewPastSessions = () => {
  const user = useSelector((state) => state?.auth?.user);
  const { data: meetingsDataFromApi, isLoading: isMeetingsDataLoading } =
    useGetMeetingsQuery(undefined, {
      skip: !user, // Only skip if user is not available
    });

  const [deleteMeeting] = useDeleteMeetingMutation();
  const [meetingData, setMeetingData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("date");

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  // Questionnaire modal state
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [selectedMeetingQuestionnaire, setSelectedMeetingQuestionnaire] =
    useState(null);
  const [questionnaireDataForViewing, setQuestionnaireDataForViewing] =
    useState(null);

  // User role and permission checks
  const role = user?.role;
  const userPermissions = useMemo(
    () => ({
      isAdmin: role === "admin",
      isDoctor: role === "doctor",
      isClient: role === "user",
      canSeeClientInfo: role === "admin" || role === "doctor",
      canSeeAllInfo: role === "admin",
      canDeleteMeeting: () => role === "admin",
    }),
    [role]
  );

  const {
    isAdmin,
    isDoctor,
    isClient,
    canSeeClientInfo,
    canSeeAllInfo,
    canDeleteMeeting,
  } = userPermissions;

  // Update meeting data when API data changes
  useEffect(() => {
    if (meetingsDataFromApi && !isMeetingsDataLoading) {
      console.log("API Data:", meetingsDataFromApi);
      console.log(
        "API Data length:",
        meetingsDataFromApi?.meetings?.length || 0
      );
      console.log("API Data type:", typeof meetingsDataFromApi);
      console.log(
        "First meeting structure:",
        meetingsDataFromApi?.meetings?.[0] || meetingsDataFromApi?.[0]
      );

      // Handle both response formats - direct array or object with meetings property
      const meetings =
        meetingsDataFromApi?.meetings || meetingsDataFromApi || [];
      setMeetingData(Array.isArray(meetings) ? meetings : []);
    }
  }, [meetingsDataFromApi, isMeetingsDataLoading]);

  // Filter to get only past meetings (sessions that have ended)
  const pastMeetings = useMemo(() => {
    // Helper function to combine meeting date and time
    const getMeetingDateTime = (meeting) => {
      try {
        // Parse the meeting date - handle different formats
        let meetingDate;
        if (typeof meeting.meetingDate === "string") {
          // If it's a string, try to parse it
          meetingDate = new Date(meeting.meetingDate);
        } else {
          // If it's already a Date object
          meetingDate = new Date(meeting.meetingDate);
        }

        // Check if date is valid
        if (isNaN(meetingDate.getTime())) {
          console.error("Invalid meeting date:", meeting.meetingDate);
          return new Date(); // Return current date as fallback
        }

        // Create a new date object to avoid modifying the original
        const meetingDateTime = new Date(meetingDate);

        // Handle time format - check if it already includes AM/PM
        let timeString = meeting.meetingTime;

        if (!timeString) {
          console.error("Missing meeting time for meeting:", meeting._id);
          return meetingDateTime; // Return date without time
        }

        if (timeString.includes(" ")) {
          // Time format: "19:30 PM" or "7:30 AM"
          const [timePart, ampm] = timeString.split(" ");
          const [hours, minutes] = timePart.split(":").map(Number);

          if (isNaN(hours) || isNaN(minutes)) {
            console.error("Invalid time format:", timeString);
            return meetingDateTime;
          }

          const adjustedHours =
            ampm.toLowerCase() === "pm" && hours !== 12
              ? hours + 12
              : ampm.toLowerCase() === "am" && hours === 12
              ? 0
              : hours;

          meetingDateTime.setHours(adjustedHours, minutes, 0, 0);
        } else {
          // Time format: "19:30" (24-hour format)
          const [hours, minutes] = timeString.split(":").map(Number);

          if (isNaN(hours) || isNaN(minutes)) {
            console.error("Invalid 24-hour time format:", timeString);
            return meetingDateTime;
          }

          meetingDateTime.setHours(hours, minutes, 0, 0);
        }

        return meetingDateTime;
      } catch (error) {
        console.error("Error parsing meeting date/time:", error, meeting);
        return new Date(); // Return current date as fallback
      }
    };

    const now = new Date();
    console.log("Current time:", now.toISOString());
    console.log("Total meeting data:", meetingData.length);

    const filtered = meetingData
      .filter((meeting) => {
        try {
          const meetingDateTime = getMeetingDateTime(meeting);
          const meetingEndTime = new Date(meetingDateTime);

          // Use actual meeting duration from database (default to 30 minutes if not specified)
          const durationInMinutes = meeting.duration || 30;

          // Add meeting duration only (no grace period)
          meetingEndTime.setMinutes(
            meetingEndTime.getMinutes() + durationInMinutes
          );

          const isPast = now.getTime() >= meetingEndTime.getTime();

          console.log(`Meeting ID: ${meeting._id}`);
          console.log(`Meeting: ${meeting.meetingDate} ${meeting.meetingTime}`);
          console.log(`Parsed DateTime:`, meetingDateTime.toISOString());
          console.log(`Meeting Duration:`, durationInMinutes, "minutes");
          console.log(`Meeting End Time:`, meetingEndTime.toISOString());
          console.log(`Current Time:`, now.toISOString());
          console.log(`Is Past:`, isPast);
          console.log("---");

          return isPast;
        } catch (error) {
          console.error("Error filtering meeting:", meeting._id, error);
          return false; // Exclude meetings with parsing errors
        }
      })
      .sort((a, b) => {
        try {
          return new Date(b.meetingDate) - new Date(a.meetingDate);
        } catch {
          console.error("Error sorting meetings");
          return 0;
        }
      }); // Sort by newest first

    console.log("Filtered past meetings:", filtered.length);
    return filtered;
  }, [meetingData]);

  // Format date helpers
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatMonth = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Invalid Time";

    // If timeStr is already in AM/PM format, return it as is
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }

    // If timeStr has a space but no AM/PM, it might be "HH:MM format"
    if (timeStr.includes(" ")) {
      return timeStr; // Return as is for now
    }

    // Convert 24-hour format to 12-hour format
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return timeStr;

      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return timeStr || "Invalid Time";
    }
  };

  // Convert UTC timestamps to Indian Standard Time for display
  const formatIndianTime = (utcTimestamp) => {
    if (!utcTimestamp) return "Not joined";

    // Create a date object from the UTC timestamp
    const date = new Date(utcTimestamp);

    // Format to Indian time (IST is UTC+5:30) - only show time
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  // Helper functions for getting names
  const getClientName = (meeting) => meeting.clientName || "Unknown Client";
  const getDoctorName = (meeting) => meeting.bhAssocName || "Unknown Doctor";

  // Group meetings based on selected filter
  const groupedMeetings = useMemo(() => {
    const grouped = {};

    if (selectedFilter === "date") {
      // Group by month
      pastMeetings.forEach((meeting) => {
        const monthKey = formatMonth(meeting.meetingDate);
        if (!grouped[monthKey]) grouped[monthKey] = [];
        grouped[monthKey].push(meeting);
      });
    } else if (selectedFilter === "client") {
      // Group by client name
      pastMeetings.forEach((meeting) => {
        const clientName = getClientName(meeting);
        if (!grouped[clientName]) grouped[clientName] = [];
        grouped[clientName].push(meeting);
      });
    } else if (selectedFilter === "doctor" && isAdmin) {
      // Group by doctor/psychologist name (admin only)
      pastMeetings.forEach((meeting) => {
        const doctorName = getDoctorName(meeting);
        if (!grouped[doctorName]) grouped[doctorName] = [];
        grouped[doctorName].push(meeting);
      });
    }

    return grouped;
  }, [pastMeetings, selectedFilter, isAdmin]);

  // Handle meeting deletion
  const handleDeleteMeeting = async (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowDeleteDialog(true);
  };

  // Confirm and execute meeting deletion
  const confirmDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    try {
      await deleteMeeting(meetingToDelete).unwrap();
      setMeetingData((prev) =>
        prev.filter((meeting) => meeting._id !== meetingToDelete)
      );
      setShowDeleteDialog(false);
      setMeetingToDelete(null);
    } catch (err) {
      console.error("Failed to delete meeting:", err);
      setShowDeleteDialog(false);
      setMeetingToDelete(null);
    }
  };

  // Cancel delete operation
  const cancelDeleteMeeting = () => {
    setShowDeleteDialog(false);
    setMeetingToDelete(null);
  };

  // Handle viewing questionnaire responses
  const handleViewQuestionnaire = async (meetingId) => {
    const meeting = meetingData.find((m) => m._id === meetingId);
    console.log("Selected meeting for questionnaire:", meeting);
    console.log("Questionnaire responses:", meeting?.questionnaireResponses);
    console.log(
      "Type of questionnaire responses:",
      typeof meeting?.questionnaireResponses
    );

    if (meeting && meeting.questionnaireResponses) {
      setSelectedMeetingQuestionnaire(meeting);

      // Fetch questionnaire data for this service type
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/questionnaire/${
            meeting.serviceType
          }`,
          {
            credentials: "include",
          }
        );
        const questionnaireData = await response.json();
        console.log("Fetched questionnaire data:", questionnaireData);
        setQuestionnaireDataForViewing(questionnaireData);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
        setQuestionnaireDataForViewing(null);
      }

      setShowQuestionnaireModal(true);
    }
  };

  // Filter options based on user role
  const filterOptions = useMemo(() => {
    const baseOptions = [{ key: "date", label: "Date", icon: Calendar }];

    if (isAdmin) {
      return [
        ...baseOptions,
        { key: "client", label: "Client", icon: User },
        { key: "doctor", label: "BH Associate", icon: Users },
      ];
    } else if (isDoctor) {
      return [...baseOptions, { key: "client", label: "Client", icon: User }];
    }

    return baseOptions;
  }, [isAdmin, isDoctor]);

  // Helper function to get question text from question ID using real questionnaire data
  const getQuestionText = (questionId, serviceType, questionnaireData) => {
    if (
      questionnaireData &&
      questionnaireData.questionnaire &&
      questionnaireData.questionnaire.questions
    ) {
      const question = questionnaireData.questionnaire.questions.find(
        (q) => q.id === questionId
      );
      if (question) {
        return question.question;
      }
    }

    // Fallback to question ID if not found
    return `Question ${questionId}`;
  };

  // Helper function to format service type for display
  const formatServiceType = (serviceType) => {
    if (!serviceType) return "Counseling Session";

    switch (serviceType) {
      case "mental_health":
        return "Mental Health Session";
      case "cosmetology":
        return "Cosmetology Session";
      case "psychologist":
        return "Psychology Session";
      case "cosmetologist":
        return "Cosmetology Session";
      default:
        return `${
          serviceType.charAt(0).toUpperCase() +
          serviceType.slice(1).replace("_", " ")
        } Session`;
    }
  };

  // Meeting card component
  const MeetingCard = ({ meeting }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#000080] mb-2">
              {formatServiceType(meeting.serviceType)}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(meeting.meetingDate)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{formatTime(meeting.meetingTime)}</span>
              </div>
              {canSeeClientInfo && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{getClientName(meeting)}</span>
                </div>
              )}
              {canSeeAllInfo && (
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{getDoctorName(meeting)}</span>
                </div>
              )}
              {meeting.duration && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{meeting.duration} minutes</span>
                </div>
              )}
              {/* Show joining times for admins only */}
              {isAdmin && (
                <>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>User: {formatIndianTime(meeting.userJoinedAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      BH Associate: {formatIndianTime(meeting.docJoinedAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Show questionnaire button for doctors and admins */}
            {(isAdmin || isDoctor) && (
              <button
                onClick={() => handleViewQuestionnaire(meeting._id)}
                className="p-2 text-[#000080] hover:text-[#000080]/80 transition-colors"
                title="View Questionnaire Responses"
              >
                <FileText className="w-5 h-5" />
              </button>
            )}
            {canDeleteMeeting() && (
              <button
                onClick={() => handleDeleteMeeting(meeting._id)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                title="Delete Meeting"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  MeetingCard.propTypes = {
    meeting: PropTypes.object.isRequired,
  };

  if (isMeetingsDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffae3] to-white flex items-center justify-center pt-15">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec5228] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading past sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] to-white pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#000080] mb-2">
            Past Sessions
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "View and manage all past counseling sessions"
              : isDoctor
              ? "Review your completed sessions"
              : "Your session history"}
          </p>
        </div>

        {/* Filter Options */}
        {!isClient && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {filterOptions.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedFilter === key
                      ? "bg-[#ec5228] text-white shadow-lg"
                      : "bg-white text-[#000080] hover:bg-[#fffae3] border border-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {pastMeetings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#fffae3] to-[#f0f9ff] rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-[#ec5228]" />
            </div>
            <h3 className="text-xl font-semibold text-[#000080] mb-2">
              No Past Sessions
            </h3>
            <p className="text-gray-600">
              {isAdmin
                ? "No past sessions found in the system."
                : isDoctor
                ? "You haven't completed any sessions yet."
                : "You don't have any completed sessions yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMeetings).map(([groupKey, meetings]) => (
              <div key={groupKey} className="space-y-4">
                {/* Group Header */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ec5228]/40 to-[#ec5228]/40"></div>
                  <h2 className="text-xl font-bold text-[#000080] px-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    {groupKey}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ec5228]/40 to-[#ec5228]/40"></div>
                </div>

                {/* Meetings Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {meetings.map((meeting) => (
                    <MeetingCard key={meeting._id} meeting={meeting} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questionnaire Modal */}
      {showQuestionnaireModal && selectedMeetingQuestionnaire && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#000080] flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Questionnaire Response
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Session on{" "}
                    {formatDate(selectedMeetingQuestionnaire.meetingDate)} at{" "}
                    {selectedMeetingQuestionnaire.meetingTime}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowQuestionnaireModal(false);
                    setSelectedMeetingQuestionnaire(null);
                    setQuestionnaireDataForViewing(null);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {(() => {
                const responses =
                  selectedMeetingQuestionnaire.questionnaireResponses;
                console.log("Rendering questionnaire responses:", responses);

                // Handle both Map and Object structures, excluding personalDetails
                let responseEntries = [];
                if (responses) {
                  if (responses instanceof Map) {
                    responseEntries = Array.from(responses.entries()).filter(
                      ([key]) => key !== "personalDetails"
                    );
                  } else if (typeof responses === "object") {
                    responseEntries = Object.entries(responses).filter(
                      ([key]) => key !== "personalDetails"
                    );
                  }
                }

                console.log("Filtered response entries:", responseEntries);

                return responseEntries.length > 0 ? (
                  <div className="space-y-4">
                    {responseEntries.map(([questionId, answer], index) => {
                      // Skip if answer is an object (like personalDetails)
                      if (typeof answer === "object" && answer !== null) {
                        return null;
                      }

                      const questionText = getQuestionText(
                        questionId,
                        selectedMeetingQuestionnaire.serviceType,
                        questionnaireDataForViewing
                      );

                      return (
                        <div
                          key={questionId || index}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="text-sm font-medium text-[#000080] mb-2">
                            {questionText}
                          </div>
                          <div className="text-gray-700 pl-2 border-l-3 border-[#ec5228]">
                            {Array.isArray(answer)
                              ? answer.join(", ")
                              : String(answer)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No questionnaire responses available for this session.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Meeting
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this meeting? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteMeeting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMeeting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPastSessions;
