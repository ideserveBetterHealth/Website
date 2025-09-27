import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  tagTypes: ["User", "Credits", "AllUsers"],
  endpoints: (builder) => ({
    getUserCredits: builder.query({
      query: () => "credits",
      providesTags: ["Credits"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "all",
        method: "GET",
      }),
      providesTags: ["AllUsers"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "profile/update",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserCreditsQuery,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useGetUserProfileQuery,
} = userApi;
