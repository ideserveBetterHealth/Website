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
import { Calendar, ChevronDown, Clock, User, Video } from "lucide-react";
import {
  useGetMeetingsQuery,
  useDeleteMeetingMutation,
  useJoinMeetingMutation,
} from "@/features/api/meetingsApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { data: meetingsDataFromApi, isLoading: isMeetingsDataLoading } =
    useGetMeetingsQuery();
  const [deleteMeeting] = useDeleteMeetingMutation();
  const [joinMeeting] = useJoinMeetingMutation();
  const role = useSelector((state) => state?.auth?.user?.role);
  const [meetingData, setMeetingData] = useState([]);
  const [services, setServices] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000); // 1-second interval

    return () => clearInterval(interval);
  }, []);

  const isDoctor = role === "doctor";
  const isAdmin = role === "admin";
  const now = new Date();
  const sortedMeetings = [...meetingData].sort(
    (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
  );

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments`;

  // Fetch available services on component mount
  useEffect(() => {
    if (role === "user") {
      fetchAvailableServices();
    }
  }, [role]);

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

  // Helper function to get meeting datetime
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

  // Show meetings in "upcoming" for 1.5 hours after they start
  const upcomingMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneAndHalfHourAfter = new Date(meetingDateTime);
    oneAndHalfHourAfter.setMinutes(oneAndHalfHourAfter.getMinutes() + 90); // 1.5 hours

    return oneAndHalfHourAfter > now;
  });

  // Move to "past" only after 1.5 hours from start time
  const pastMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneAndHalfHourAfter = new Date(meetingDateTime);
    oneAndHalfHourAfter.setMinutes(oneAndHalfHourAfter.getMinutes() + 90); // 1.5 hours

    return oneAndHalfHourAfter <= now;
  });
  const nextMeeting = upcomingMeetings[0];

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Update this function to properly calculate countdown using both date and time
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

  const [countdown, setCountdown] = useState(
    nextMeeting ? getCountdown(nextMeeting) : ""
  );

  useEffect(() => {
    if (!nextMeeting) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(nextMeeting));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMeeting?.meetingDate]);

  useEffect(() => {
    if (!isMeetingsDataLoading) {
      meetingsDataFromApi && setMeetingData(meetingsDataFromApi);
    }
  }, [meetingsDataFromApi, isMeetingsDataLoading]);

  // Update this function to properly check the meeting time
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

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await deleteMeeting(meetingId).unwrap();
      toast.success("Meeting deleted successfully!");
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      toast.error("Failed to delete meeting.");
    }
  };

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

  // Add this helper function to determine if a meeting is currently in progress
  const isMeetingInProgress = (meeting) => {
    const now = new Date();
    const meetingDateTime = getMeetingDateTime(meeting);

    // Meeting has started but not been over for more than 1 hour
    const meetingEndTime = new Date(meetingDateTime);
    meetingEndTime.setHours(meetingEndTime.getHours() + 1);

    return now >= meetingDateTime && now <= meetingEndTime;
  };

  // Add this function to format the meeting time display
  const formatMeetingTime = (meeting) => {
    if (isMeetingInProgress(meeting)) {
      return <span className="text-emerald-600 font-semibold">Join now!</span>;
    }
    return meeting.meetingTime;
  };

  // Add this helper function to format timestamps to Indian time
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

  return (
    <div className="space-y-6 mt-24">
      <div className="flex items-center justify-between mb-4 pr-4 pl-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Upcoming Commitments
        </h2>
        {role && role !== "user" ? (
          <Link to={"/meetinghistory"}>
            <Button variant="outline" className="text-sm font-medium">
              Meeting History
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm font-medium"
                disabled={loadingServices}
              >
                {loadingServices ? "Loading..." : "Book More Sessions"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Available Services</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {services &&
                Object.entries(services).map(([serviceKey, serviceData]) => (
                  <DropdownMenuGroup key={serviceKey}>
                    <DropdownMenuLabel className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                      {serviceData.displayName}
                    </DropdownMenuLabel>
                    {serviceData.plans.map((plan) => (
                      <DropdownMenuItem
                        key={`${serviceKey}-${plan}`}
                        onClick={() => handleServiceClick(serviceKey, plan)}
                        className="cursor-pointer hover:bg-blue-50 transition-colors pl-6"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium capitalize">
                            {plan} Session
                          </span>
                          <span className="text-xs text-gray-500">
                            {plan === "single"
                              ? "One-time session"
                              : "Multiple sessions package"}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>
                ))}
              {!services && !loadingServices && (
                <DropdownMenuItem disabled>
                  <span className="text-gray-500">No services available</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {nextMeeting && (
        <div className="w-full bg-[#f9fbff] border border-blue-200 rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] p-6 md:p-10 animate-fade-in transition-all duration-300">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold">
                Upcoming Meeting
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                {formatDay(nextMeeting.meetingDate)},{" "}
                {formatDate(nextMeeting.meetingDate)} at{" "}
                {nextMeeting.meetingTime}
              </h2>
              <div className="space-y-2 text-gray-700">
                {!isDoctor && !isAdmin && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>
                      <span className="font-semibold">Psychologist:</span>{" "}
                      {nextMeeting.doctorName} ({nextMeeting.doctorId})
                    </span>
                  </div>
                )}
                {isDoctor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>
                      <span className="font-semibold">Client:</span>{" "}
                      {nextMeeting.clientName} ({nextMeeting.clientId})
                    </span>
                  </div>
                )}
                {isAdmin && (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>
                        <span className="font-semibold">Client:</span>{" "}
                        {nextMeeting.clientName} ({nextMeeting.clientId})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>
                        <span className="font-semibold">Psychologist:</span>{" "}
                        {nextMeeting.doctorName} ({nextMeeting.doctorId})
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300 text-blue-700 font-medium px-4 py-2 rounded-full text-sm shadow-inner flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Starts in: {countdown}
              </span>

              {canJoinMeeting(
                nextMeeting.meetingDate,
                nextMeeting.meetingTime
              ) ? (
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
                  onClick={() =>
                    handleJoinMeeting(nextMeeting._id, nextMeeting.meetingLink)
                  }
                >
                  <Video className="w-5 h-5" />
                  Join Meeting
                </Button>
              ) : (
                <Button
                  disabled
                  className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-500 font-semibold px-6 py-3 rounded-xl shadow-inner transition-all duration-300"
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
                >
                  <Button variant="outline" className="rounded-xl">
                    View Report
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {upcomingMeetings.length === 0 ? (
        <div className="text-center mt-6 text-muted-foreground">
          <p className="italic">
            You're all caught up! No upcoming meetings scheduled.
          </p>
        </div>
      ) : (
        <Card className="w-full shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <ScrollArea className="w-full">
              <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border">Meeting Date</th>
                    <th className="px-6 py-3 border">Meeting Time</th>
                    <th className="px-6 py-3 border">Meeting Day</th>
                    {isAdmin ? (
                      <>
                        <th className="px-6 py-3 border">Client Email</th>
                        <th className="px-6 py-3 border">Psychologist Email</th>
                        <th className="px-6 py-3 border">User Joined</th>
                        <th className="px-6 py-3 border">Psychologist Joined</th>
                      </>
                    ) : (
                      <th className="px-6 py-3 border">
                        {isDoctor ? "Client Email" : "Doctor Email"}
                      </th>
                    )}
                    <th className="px-6 py-3 border">Meeting Link</th>
                    {isAdmin && <th className="px-6 py-3 border">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {upcomingMeetings.map((meeting) => (
                    <tr key={meeting._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {formatDate(meeting.meetingDate)}
                      </td>
                      <td className="px-6 py-4">
                        {isMeetingInProgress(meeting) ? (
                          <span className="text-emerald-600 font-semibold">
                            Join now!
                          </span>
                        ) : (
                          meeting.meetingTime
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {formatDay(meeting.meetingDate)}
                      </td>
                      {isAdmin ? (
                        <>
                          <td className="px-6 py-4">{meeting.clientId}</td>
                          <td className="px-6 py-4">{meeting.doctorId}</td>
                          <td className="px-6 py-4">
                            {formatIndianTime(meeting.userJoinedAt)}
                          </td>
                          <td className="px-6 py-4">
                            {formatIndianTime(meeting.docJoinedAt)}
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-4">
                          {isDoctor ? meeting.clientId : meeting.doctorId}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        {canJoinMeeting(
                          meeting.meetingDate,
                          meeting.meetingTime
                        ) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleJoinMeeting(
                                meeting._id,
                                meeting.meetingLink
                              )
                            }
                          >
                            Join Meeting
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            title="You can join 5 minutes before the meeting starts"
                          >
                            Join Meeting
                          </Button>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <Button
                            variant="destructive"
                            size="sm"
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
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {(isDoctor || isAdmin) && pastMeetings.length > 0 && (
        <Card className="w-full shadow-md rounded-xl overflow-hidden mt-8">
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4 text-gray-700">
              Past Meetings
            </div>
            <ul className="space-y-2">
              {pastMeetings.map((meeting) => (
                <li
                  key={meeting._id}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <div className="font-medium">
                        {formatDay(meeting.meetingDate)},{" "}
                        {formatDate(meeting.meetingDate)} at{" "}
                        {meeting.meetingTime}
                      </div>
                      {isAdmin ? (
                        <>
                          <div className="text-sm text-muted-foreground">
                            Client: {meeting.clientName} ({meeting.clientId})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Psychologist: {meeting.doctorName} ({meeting.doctorId})
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            User joined:{" "}
                            {formatIndianTime(meeting.userJoinedAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Psychologist joined:{" "}
                            {formatIndianTime(meeting.docJoinedAt)}
                          </div>
                        </>
                      ) : isDoctor ? (
                        <div className="text-sm text-muted-foreground">
                          Client: {meeting.clientName} ({meeting.clientId})
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Psychologist: {meeting.doctorName} ({meeting.doctorId})
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0 flex gap-4 items-center">
                      <Badge variant="secondary">Meeting Ended</Badge>
                      {isDoctor && !meeting.reportLink?.trim() && (
                        <a
                          href={meeting.formLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm">Submit Report</Button>
                        </a>
                      )}
                      {(isDoctor || isAdmin) && meeting.reportLink && (
                        <a
                          href={meeting.reportLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline">
                            View Report
                          </Button>
                        </a>
                      )}
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMeeting(meeting._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
