import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DETAILS_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`;

export const detailsApi = createApi({
  reducerPath: "detailsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: DETAILS_API,
    credentials: "include",
  }),
  tagTypes: ["EmployeeDetails"],
  endpoints: (builder) => ({
    submitEmployeeForm: builder.mutation({
      query: (formData) => ({
        url: "/employees",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeDetails"],
    }),
    isVerified: builder.query({
      query: () => ({
        url: "/check-verified",
        method: "GET",
      }),
    }),
    getMyEmployeeDetails: builder.query({
      query: () => ({
        url: "/my-details",
        method: "GET",
      }),
      providesTags: ["EmployeeDetails"],
    }),
    updateMyEmployeeDetails: builder.mutation({
      query: (formData) => ({
        url: "/my-details",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["EmployeeDetails"],
    }),
  }),
});

export const {
  useSubmitEmployeeFormMutation,
  useIsVerifiedQuery,
  useGetMyEmployeeDetailsQuery,
  useUpdateMyEmployeeDetailsMutation,
} = detailsApi;
