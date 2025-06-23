import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DETAILS_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`;

export const detailsApi = createApi({
  reducerPath: "detailsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: DETAILS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    submitEmployeeForm: builder.mutation({
      query: (formData) => ({
        url: "/employees",
        method: "POST",
        body: formData,
      }),
    }),
    isVerified: builder.query({
      query: () => ({
        url: "/check-verified",
        method: "GET",
      }),
    }),
  }),
});

export const { useSubmitEmployeeFormMutation, useIsVerifiedQuery } = detailsApi;
