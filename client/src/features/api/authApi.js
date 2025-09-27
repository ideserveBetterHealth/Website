import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { meetingApi } from "./meetingsApi";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`;

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["logout"],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    sendOTP: builder.mutation({
      query: (inputData) => ({
        url: "send-otp",
        method: "POST",
        body: inputData,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (inputData) => ({
        url: "verify-otp",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
          dispatch(meetingApi.util.invalidateTags(["Meetings"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    completeProfile: builder.mutation({
      query: (inputData) => ({
        url: "complete-profile",
        method: "PUT",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["logout"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedOut());
          dispatch(meetingApi.util.invalidateTags(["Meetings"]));
          console.log("Logout successful:", result);
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      invalidatesTags: ["logout"],
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user, isLoading: false }));
        } catch (error) {
          console.log(error);
          dispatch(userLoggedIn({ isLoading: false }));
        }
      },
      providesTags: ["logout"],
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["logout"],
    }),
  }),
});

export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useCompleteProfileMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
} = authApi;
