import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BH_ASSOCIATE_API = `${
  import.meta.env.VITE_BACKEND_URL
}/api/v1/bh-associate/`;

export const bhAssociateApi = createApi({
  reducerPath: "bhAssociateApi",
  tagTypes: ["BHAssociate", "Availability"],
  baseQuery: fetchBaseQuery({
    baseUrl: BH_ASSOCIATE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getBHAssociateProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["BHAssociate"],
    }),
    getAllBHAssociates: builder.query({
      query: () => ({
        url: "all",
        method: "GET",
      }),
      providesTags: ["BHAssociate"],
    }),
    getCosmetologists: builder.query({
      query: () => ({
        url: "cosmetologists",
        method: "GET",
      }),
      providesTags: ["BHAssociate"],
    }),
    getAvailability: builder.query({
      query: ({ startDate, endDate } = {}) => ({
        url: "availability",
        method: "GET",
        params: { startDate, endDate },
      }),
      providesTags: ["Availability"],
    }),
    getAssociateAvailability: builder.query({
      query: ({ associateId, startDate, endDate } = {}) => ({
        url: `availability/${associateId}`,
        method: "GET",
        params: { startDate, endDate },
      }),
      providesTags: ["Availability"],
    }),
    updateAvailability: builder.mutation({
      query: (availabilityData) => ({
        url: "availability/update",
        method: "PUT",
        body: { availabilityData },
      }),
      invalidatesTags: ["Availability"],
    }),
    updateAssociateAvailability: builder.mutation({
      query: ({ associateId, availabilityData }) => ({
        url: `availability/update/${associateId}`,
        method: "PUT",
        body: { availabilityData },
      }),
      invalidatesTags: ["Availability"],
    }),
    clearAvailability: builder.mutation({
      query: (dates) => ({
        url: "availability/clear",
        method: "DELETE",
        body: { dates },
      }),
      invalidatesTags: ["Availability"],
    }),
    clearAssociateAvailability: builder.mutation({
      query: ({ associateId, dates }) => ({
        url: `availability/clear/${associateId}`,
        method: "DELETE",
        body: { dates },
      }),
      invalidatesTags: ["Availability"],
    }),
    bulkUpdateAvailability: builder.mutation({
      query: ({ pattern, startDate, endDate, dayOfWeek, slots }) => ({
        url: "availability/bulk-update",
        method: "PUT",
        body: { pattern, startDate, endDate, dayOfWeek, slots },
      }),
      invalidatesTags: ["Availability"],
    }),
    bulkUpdateAssociateAvailability: builder.mutation({
      query: ({
        associateId,
        pattern,
        startDate,
        endDate,
        dayOfWeek,
        slots,
      }) => ({
        url: `availability/bulk-update/${associateId}`,
        method: "PUT",
        body: { pattern, startDate, endDate, dayOfWeek, slots },
      }),
      invalidatesTags: ["Availability"],
    }),
  }),
});

export const {
  useGetBHAssociateProfileQuery,
  useGetAllBHAssociatesQuery,
  useGetCosmetologistsQuery,
  useGetAvailabilityQuery,
  useGetAssociateAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useUpdateAssociateAvailabilityMutation,
  useClearAvailabilityMutation,
  useClearAssociateAvailabilityMutation,
  useBulkUpdateAvailabilityMutation,
  useBulkUpdateAssociateAvailabilityMutation,
} = bhAssociateApi;
