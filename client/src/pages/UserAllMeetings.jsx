import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUserAllMeetingsMutation } from "@/features/api/meetingsApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserAllMeetings = () => {
  const [userId, setUserId] = useState("");
  const [userAllMeetings, { isLoading }] = useUserAllMeetingsMutation();
  const [meetingsData, setMeetingsData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const role = useSelector((state) => state?.auth?.user?.role);
  const isDoctor = role === "doctor";
  const isAdmin = role === "admin";

  // Prevent non-admin and non-doctor users from accessing this page
  if (!isAdmin && !isDoctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const fetchUserMeetings = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    try {
      const result = await userAllMeetings(userId).unwrap();
      setMeetingsData(result);
      setHasSearched(true);
      if (result.length === 0) {
        toast.info(`No meetings found for user: ${userId}`);
      } else {
        toast.success(`Found ${result.length} meetings for user: ${userId}`);
      }
    } catch (error) {
      console.error("Error fetching user meetings:", error);
      toast.error(error.data?.message || "Failed to fetch user meetings");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      fetchUserMeetings();
    }
  };

  // Helper functions from Dashboard.jsx
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

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

  // Sort meetings by date
  const sortedMeetings = [...meetingsData].sort(
    (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
  );

  // Current date for meeting status determination
  const now = new Date();

  // Filter for past and upcoming meetings
  const upcomingMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneHourAfterMeeting = new Date(meetingDateTime);
    oneHourAfterMeeting.setHours(oneHourAfterMeeting.getHours() + 1);
    return oneHourAfterMeeting > now;
  });

  const pastMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const oneHourAfterMeeting = new Date(meetingDateTime);
    oneHourAfterMeeting.setHours(oneHourAfterMeeting.getHours() + 1);
    return oneHourAfterMeeting <= now;
  });

  return (
    <div className="space-y-6 container mx-auto px-4">
      <h1 className="text-2xl mt-24 font-bold mb-6">Meetings Lookup</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter user email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button onClick={fetchUserMeetings} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search Meetings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              User: {userId}
            </h2>
            <Badge variant="outline">
              {sortedMeetings.length} meetings found
            </Badge>
          </div>

          {/* Upcoming meetings */}
          <Card className="w-full shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Upcoming Meetings ({upcomingMeetings.length})
              </h3>

              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming meetings found for this user</p>
                </div>
              ) : (
                <ScrollArea className="w-full">
                  <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-3 border">Meeting Date</th>
                        <th className="px-6 py-3 border">Meeting Time</th>
                        <th className="px-6 py-3 border">Meeting Day</th>
                        <th className="px-6 py-3 border">Doctor Email</th>
                        {isAdmin && (
                          <>
                            <th className="px-6 py-3 border">User Joined</th>
                            <th className="px-6 py-3 border">Doctor Joined</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {upcomingMeetings.map((meeting) => {
                        const isMeetingInProgress = (() => {
                          const meetingDateTime = getMeetingDateTime(meeting);
                          const meetingEndTime = new Date(meetingDateTime);
                          meetingEndTime.setHours(
                            meetingEndTime.getHours() + 1
                          );
                          return (
                            now >= meetingDateTime && now <= meetingEndTime
                          );
                        })();

                        return (
                          <tr key={meeting._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              {formatDate(meeting.meetingDate)}
                            </td>
                            <td className="px-6 py-4">
                              {isMeetingInProgress ? (
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
                            <td className="px-6 py-4">{meeting.doctorId}</td>
                            {isAdmin && (
                              <>
                                <td className="px-6 py-4">
                                  {formatIndianTime(meeting.userJoinedAt)}
                                </td>
                                <td className="px-6 py-4">
                                  {formatIndianTime(meeting.docJoinedAt)}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Past meetings */}
          {pastMeetings.length > 0 && (
            <Card className="w-full shadow-md rounded-xl overflow-hidden mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Past Meetings ({pastMeetings.length})
                </h3>
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
                          <div className="text-sm text-muted-foreground">
                            Doctor: {meeting.doctorName} ({meeting.doctorId})
                          </div>
                          {isAdmin && (
                            <>
                              <div className="text-xs text-gray-500 mt-1">
                                User joined:{" "}
                                {formatIndianTime(meeting.userJoinedAt)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Doctor joined:{" "}
                                {formatIndianTime(meeting.docJoinedAt)}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-0 flex gap-4 items-center">
                          <Badge variant="secondary">Meeting Ended</Badge>
                          {meeting.reportLink && (
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default UserAllMeetings;
