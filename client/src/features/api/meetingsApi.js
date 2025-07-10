import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MEETING_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/meeting`;

export const meetingApi = createApi({
  reducerPath: "meetingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MEETING_API,
    credentials: "include",
  }),
  tagTypes: ["Meetings"],
  endpoints: (builder) => ({
    getMeetings: builder.query({
      query: () => ({
        url: "/get-meetings",
        method: "GET",
      }),
      providesTags: ["Meetings"],
    }),

    createMeeting: builder.mutation({
      query: (meetingData) => ({
        url: "/create-meeting",
        method: "POST",
        body: meetingData,
      }),
      invalidatesTags: ["Meetings"],
    }),

    joinMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `/meetingJoinedAt/${meetingId}`,
        method: "POST",
      }),
      invalidatesTags: ["Meetings"],
    }),

    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `/deleteMeeting/${meetingId}`,
        method: "GET",
      }),
      invalidatesTags: ["Meetings"],
    }),
    userAllMeetings: builder.mutation({
      query: (userId) => ({
        url: "/userMeetings",
        method: "POST",
        body: { userId },
      }),
      providesTags: ["Meetings"],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
  useJoinMeetingMutation,
  useDeleteMeetingMutation,
  useUserAllMeetingsMutation,
} = meetingApi;
