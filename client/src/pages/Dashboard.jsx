import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Clock, Lock, User, Video } from "lucide-react";
import {
  useGetMeetingsQuery,
  useDeleteMeetingMutation,
  useJoinMeetingMutation,
} from "@/features/api/meetingsApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { use } from "react";

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user);
  // Inspirational quotes for users
  const inspirationalQuotes = [
    "Your mental health is just as important as your physical health. Take care of yourself.",
    "Every step towards better mental health is a step towards a brighter future.",
    "Self-care isn't selfish; it's essential. You matter, and your well-being matters.",
    "Progress, not perfection. Every small step counts on your journey to wellness.",
    "You are stronger than you think, braver than you feel, and more loved than you know.",
    "Mental health recovery is not a destination, but a journey of self-discovery.",
    "Be patient with yourself. Healing takes time, and you're worth the effort.",
    "Your story isn't over yet. There are beautiful chapters still to be written.",
    "Taking care of your mental health is an act of courage and self-compassion.",
    "You don't have to be perfect. You just have to be yourself, and that's enough.",
  ];
  const navigate = useNavigate();
  const { data: meetingsDataFromApi, isLoading: isMeetingsDataLoading } =
    useGetMeetingsQuery(undefined, {
      skip:
        (user?.role === "admin" || user?.role === "doctor") &&
        user?.isVerified !== "verified",
    });
  const [deleteMeeting] = useDeleteMeetingMutation();
  const [joinMeeting] = useJoinMeetingMutation();
  const role = useSelector((state) => state?.auth?.user?.role);
  // State variables for managing meeting data, services, and UI updates
  const [meetingData, setMeetingData] = useState([]);
  const [services, setServices] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [tick, setTick] = useState(0);

  // Store random quote once when component mounts (only changes on page reload)
  const [randomQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[randomIndex];
  });

  // Timer for real-time updates (every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000); // 1-second interval

    return () => clearInterval(interval);
  }, []);

  // User role checks for conditional rendering
  const isDoctor = role === "doctor";
  const isAdmin = role === "admin";
  const now = new Date();

  // Sort meetings by date for proper chronological display
  const sortedMeetings = [...meetingData].sort(
    (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
  );

  // Get the stored random inspirational quote (only changes on page reload)
  const getUserQuote = () => {
    return randomQuote;
  };

  // Extract user's first name for personalized greeting
  const getUserFirstName = () => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  };

  // API endpoint for payment services
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments`;

  // Fetch available services when component mounts (only for regular users)
  useEffect(() => {
    if (role === "user") {
      fetchAvailableServices();
    }
  }, [role]);

  // Fetch services from backend for the booking dropdown
  const fetchAvailableServices = async () => {
    try {
      setLoadingServices(true);
      const response = await axios.get(`${API_BASE}/services`);
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  // Handle service booking by opening payment link in new tab
  const handleServiceClick = async (serviceKey, planType) => {
    try {
      // Convert service key to URL format
      const serviceUrl =
        serviceKey === "mentalHealthCounselling"
          ? "mental-Health-Counselling"
          : "cosmetologist-Consultancy";

      const response = await axios.get(
        `${API_BASE}/default/${serviceUrl}/${planType}`
      );

      if (response.data.success) {
        // Open payment link in new tab
        window.open(
          response.data.data.paymentLink,
          "_blank",
          "noopener noreferrer"
        );
      }
    } catch (error) {
      console.error("Error getting payment link:", error);
      toast.error("Failed to get payment link");
    }
  };

  // Helper function to combine meeting date and time into a single DateTime object
  const getMeetingDateTime = (meeting) => {
    const meetingDateTime = new Date(meeting.meetingDate);
    const [timePart, ampm] = meeting.meetingTime.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    const adjustedHours =
      ampm.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : ampm.toLowerCase() === "am" && hours === 12
        ? 0
        : hours;

    meetingDateTime.setHours(adjustedHours, minutes, 0, 0);
    return meetingDateTime;
  };

  // Filter meetings to show as "upcoming" (includes 1.5 hours grace period after start time)
  const upcomingMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneAndHalfHourAfter = new Date(meetingDateTime);
    oneAndHalfHourAfter.setMinutes(oneAndHalfHourAfter.getMinutes() + 90); // 1.5 hours

    return oneAndHalfHourAfter > now;
  });

  // Filter meetings to show as "past" (only after 1.5 hours from start time)
  const pastMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneAndHalfHourAfter = new Date(meetingDateTime);
    oneAndHalfHourAfter.setMinutes(oneAndHalfHourAfter.getMinutes() + 90); // 1.5 hours

    return oneAndHalfHourAfter <= now;
  });

  // Get the next upcoming meeting for the highlight card
  const nextMeeting = upcomingMeetings[0];

  // Date formatting helper functions
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Real-time countdown calculation for next meeting
  function getCountdown(meeting) {
    const now = new Date();
    // Use getMeetingDateTime helper to get the proper date+time object
    const meetingDateTime = getMeetingDateTime(meeting);
    const diff = meetingDateTime - now;

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // State for countdown display with real-time updates
  const [countdown, setCountdown] = useState(
    nextMeeting ? getCountdown(nextMeeting) : ""
  );

  // Update countdown every second for the next meeting
  useEffect(() => {
    if (!nextMeeting) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(nextMeeting));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMeeting?.meetingDate]);

  // Update meeting data when API data changes
  useEffect(() => {
    if (!isMeetingsDataLoading) {
      meetingsDataFromApi && setMeetingData(meetingsDataFromApi);
    }
  }, [meetingsDataFromApi, isMeetingsDataLoading]);

  // Check if user can join meeting (5 minutes before start, up to 1.5 hours after start)
  const canJoinMeeting = (meetingDate, meetingTime) => {
    const now = new Date();

    const meetingDateTime = new Date(meetingDate);
    const [timePart, ampm] = meetingTime.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    const adjustedHours =
      ampm.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : ampm.toLowerCase() === "am" && hours === 12
        ? 0
        : hours;

    meetingDateTime.setHours(adjustedHours, minutes, 0, 0);

    const fiveMinutesBefore = new Date(meetingDateTime);
    fiveMinutesBefore.setMinutes(fiveMinutesBefore.getMinutes() - 5);

    const oneAndHalfHourAfter = new Date(meetingDateTime);
    oneAndHalfHourAfter.setMinutes(oneAndHalfHourAfter.getMinutes() + 90); // 1.5 hours

    return now >= fiveMinutesBefore && now <= oneAndHalfHourAfter;
  };

  // Handle meeting deletion with confirmation
  const handleDeleteMeeting = async (meetingId) => {
    try {
      await deleteMeeting(meetingId).unwrap();
      toast.success("Meeting deleted successfully!");
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      toast.error("Failed to delete meeting.");
    }
  };

  // Handle joining meeting and record join time
  const handleJoinMeeting = async (meetingId, meetingLink) => {
    try {
      // Call the joinMeeting API to record the join time
      await joinMeeting(meetingId).unwrap();

      // Open the meeting link in a new tab
      window.open(meetingLink, "_blank", "noopener noreferrer");
    } catch (error) {
      console.error("Failed to record meeting join:", error);
      // Still open the meeting link even if the API call fails
      window.open(meetingLink, "_blank", "noopener noreferrer");
    }
  };

  // Check if meeting is currently in progress (started but not over)
  const isMeetingInProgress = (meeting) => {
    const now = new Date();
    const meetingDateTime = getMeetingDateTime(meeting);

    // Meeting has started but not been over for more than 1 hour
    const meetingEndTime = new Date(meetingDateTime);
    meetingEndTime.setHours(meetingEndTime.getHours() + 1);

    return now >= meetingDateTime && now <= meetingEndTime;
  };

  // Format meeting time display with special handling for active meetings
  const formatMeetingTime = (meeting) => {
    if (isMeetingInProgress(meeting)) {
      return <span className="text-emerald-600 font-semibold">Join now!</span>;
    }
    return meeting.meetingTime;
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

  // Main dashboard render with responsive design and gradient background
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20 pb-12 space-y-8">
        {/* User Details Header Section - Moved from card to top */}
        {user && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 mt-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-3 rounded-full shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000080] mb-1">
                    Hello, {getUserFirstName()}! 👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ec5228] rounded-full"></span>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-4 border-l-4 border-[#ec5228] shadow-sm">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic font-medium">
                  "{getUserQuote()}"
                </p>
              </div>
            </div>

            {/* Date Calendar Widget - Responsive design for mobile and desktop */}
            <div className="lg:min-w-[200px] flex justify-center lg:justify-end">
              {/* Mobile: Horizontal rectangular calendar box, Desktop: Square calendar box */}
              <div
                className="bg-gradient-to-br from-[#ec5228]/10 to-[#d14a22]/10 rounded-2xl border border-[#ec5228]/20 
                               p-4 sm:p-6 text-center
                               w-full max-w-xs sm:max-w-none sm:w-auto
                               flex sm:block items-center justify-between sm:justify-center
                               min-h-[80px] sm:min-h-auto"
              >
                {/* Date and Month display */}
                <div className="flex items-center sm:block gap-3 sm:gap-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000080] mb-0 sm:mb-1">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>
                </div>
                {/* Year display - positioned at right on mobile, below on desktop */}
                <div className="text-xs text-gray-500 sm:mt-1">
                  {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-8">
          {role && role !== "user" ? (
            <Button
              variant="outline"
              disabled={user?.isVerified !== "verified"}
              onClick={() => navigate("/meetinghistory")}
              className="bg-white hover:bg-[#ec5228] hover:text-white border-[#ec5228] text-[#ec5228] font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Meeting History
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#ec5228] hover:bg-[#d14a22] text-white border-none font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={loadingServices}
                >
                  {loadingServices ? "Loading..." : "Book More Sessions"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-xl rounded-xl border-0 p-2">
                <DropdownMenuLabel className="text-[#000080] font-semibold text-base px-3 py-2">
                  Available Services
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                {services &&
                  Object.entries(services).map(([serviceKey, serviceData]) => (
                    <DropdownMenuGroup key={serviceKey}>
                      <DropdownMenuLabel className="text-xs font-semibold text-[#ec5228] uppercase tracking-wide px-3 py-2">
                        {serviceData.displayName}
                      </DropdownMenuLabel>
                      {serviceData.plans.map((plan) => (
                        <DropdownMenuItem
                          key={`${serviceKey}-${plan}`}
                          onClick={() => handleServiceClick(serviceKey, plan)}
                          className="cursor-pointer hover:bg-[#fffae3] transition-colors mx-1 my-1 rounded-lg px-3 py-3"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium capitalize text-[#000080]">
                              {plan} Session
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {plan === "single"
                                ? "One-time session"
                                : "Multiple sessions package"}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-gray-100 my-2" />
                    </DropdownMenuGroup>
                  ))}
                {!services && !loadingServices && (
                  <DropdownMenuItem disabled className="px-3 py-4">
                    <span className="text-gray-500">No services available</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Next Meeting Highlight Card */}
        {nextMeeting && (
          <div className="bg-gradient-to-r from-[#000080] via-[#0000a0] to-[#000080] rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm uppercase tracking-wider font-semibold text-white/90">
                    Next Meeting
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  {formatDay(nextMeeting.meetingDate)},{" "}
                  {formatDate(nextMeeting.meetingDate)}
                </h2>

                <div className="flex items-center gap-3 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-white/80" />
                  <span>{nextMeeting.meetingTime}</span>
                </div>

                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  {/* Meeting participant information display */}
                  {!isDoctor && !isAdmin && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-sm">
                        <span className="font-semibold">BH Associate:</span>{" "}
                        {nextMeeting.doctorName}
                      </span>
                    </div>
                  )}
                  {isDoctor && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-sm">
                        <span className="font-semibold">Client:</span>{" "}
                        {nextMeeting.clientName}
                      </span>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-white/80" />
                        <span className="text-sm">
                          <span className="font-semibold">Client:</span>{" "}
                          {nextMeeting.clientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-white/80" />
                        <span className="text-sm">
                          <span className="font-semibold">BH Associate:</span>{" "}
                          {nextMeeting.doctorName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-4 lg:min-w-[280px]">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                  <div className="text-xs uppercase tracking-wider font-semibold text-white/80 mb-1">
                    Starts in
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {countdown}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  {canJoinMeeting(
                    nextMeeting.meetingDate,
                    nextMeeting.meetingTime
                  ) ? (
                    <Button
                      className="bg-[#ec5228] hover:bg-[#d14a22] text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                      onClick={() =>
                        handleJoinMeeting(
                          nextMeeting._id,
                          nextMeeting.meetingLink
                        )
                      }
                    >
                      <Video className="w-5 h-5" />
                      Join Meeting
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-white/10 text-white/60 font-semibold px-6 py-3 rounded-xl shadow-inner transition-all duration-300 flex items-center justify-center gap-2 cursor-not-allowed"
                      title="You can join 5 minutes before the meeting starts"
                    >
                      <Video className="w-5 h-5" />
                      Join Meeting
                    </Button>
                  )}
                  {isDoctor && nextMeeting.reportLink && (
                    <a
                      href={nextMeeting.reportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full lg:w-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#000080] rounded-xl py-3"
                      >
                        View Report
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Meetings State */}
        {upcomingMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-[#fffae3] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                {role !== "user" && user?.isVerified !== "verified" ? (
                  <Lock className="w-10 h-10 text-[#ec5228]" />
                ) : (
                  <Calendar className="w-10 h-10 text-[#ec5228]" />
                )}
              </div>
              {role !== "user" && user?.isVerified !== "verified" ? (
                <h1 className="text-xl sm:text-2xl font-bold text-[#000080] mb-4">
                  {user?.isVerified === "pending" ? (
                    "Your documents are under review. Please give us some time for verification."
                  ) : (
                    <>
                      Your dashboard is{" "}
                      <span className="font-bold text-[#ec5228]">LOCKED</span>
                      <br></br>
                      <Button
                        variant="outline"
                        className="text-[#000080] mt-4"
                        onClick={() => navigate("/details")}
                      >
                        Submit Documents
                      </Button>
                    </>
                  )}
                </h1>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000080] mb-4">
                    All Caught Up!
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You're all set! No upcoming meetings scheduled at the
                    moment.
                    {role === "user" && " Book a new session to get started."}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Upcoming Meetings Table */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#000080] to-[#0000a0] px-6 py-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <Clock className="w-5 h-5" />
                Upcoming Sessions
              </h3>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Day
                      </th>
                      {isAdmin ? (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            Client
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            BH Associate
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            User Joined
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            Associate Joined
                          </th>
                        </>
                      ) : (
                        <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                          {isDoctor ? "Client" : "BH Associate"}
                        </th>
                      )}
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Action
                      </th>
                      {isAdmin && (
                        <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                          Manage
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingMeetings.map((meeting, index) => (
                      <tr
                        key={meeting._id}
                        className={`hover:bg-[#fffae3] transition-colors duration-200 ${
                          index !== upcomingMeetings.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                          {formatDate(meeting.meetingDate)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {isMeetingInProgress(meeting) ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Join Now!
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              {meeting.meetingTime}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDay(meeting.meetingDate)}
                        </td>
                        {isAdmin ? (
                          <>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {meeting.clientId}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {meeting.doctorId}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formatIndianTime(meeting.userJoinedAt)}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formatIndianTime(meeting.docJoinedAt)}
                            </td>
                          </>
                        ) : (
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {isDoctor ? meeting.clientId : meeting.doctorId}
                          </td>
                        )}
                        <td className="py-4 px-4">
                          {canJoinMeeting(
                            meeting.meetingDate,
                            meeting.meetingTime
                          ) ? (
                            <Button
                              className="bg-[#ec5228] hover:bg-[#d14a22] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                              onClick={() =>
                                handleJoinMeeting(
                                  meeting._id,
                                  meeting.meetingLink
                                )
                              }
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                              title="Available 5 minutes before start time"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="py-4 px-4">
                            <Button
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Past Meetings Section */}
        {(isDoctor || isAdmin) &&
          user?.isVerified === "verified" &&
          pastMeetings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  Past Sessions
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {pastMeetings.map((meeting, index) => (
                    <div
                      key={meeting._id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Completed
                            </div>
                            <span className="text-sm text-gray-500">
                              Session #{pastMeetings.length - index}
                            </span>
                          </div>

                          <div className="font-semibold text-[#000080] text-lg">
                            {formatDay(meeting.meetingDate)},{" "}
                            {formatDate(meeting.meetingDate)} at{" "}
                            {meeting.meetingTime}
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            {isAdmin ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span>
                                    <span className="font-medium">Client:</span>{" "}
                                    {meeting.clientName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span>
                                    <span className="font-medium">
                                      BH Associate:
                                    </span>{" "}
                                    {meeting.doctorName}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  User joined:{" "}
                                  {formatIndianTime(meeting.userJoinedAt)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Associate joined:{" "}
                                  {formatIndianTime(meeting.docJoinedAt)}
                                </div>
                              </div>
                            ) : isDoctor ? (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>
                                  <span className="font-medium">Client:</span>{" "}
                                  {meeting.clientName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>
                                  <span className="font-medium">
                                    BH Associate:
                                  </span>{" "}
                                  {meeting.doctorName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                          {isDoctor && !meeting.reportLink?.trim() && (
                            <a
                              href={meeting.formLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="bg-[#ec5228] hover:bg-[#d14a22] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                                Submit Report
                              </Button>
                            </a>
                          )}
                          {(isDoctor || isAdmin) && meeting.reportLink && (
                            <a
                              href={meeting.reportLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="outline"
                                className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                              >
                                View Report
                              </Button>
                            </a>
                          )}
                          {isAdmin && (
                            <Button
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
