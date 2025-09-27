import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PRICING_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/pricing/`;

export const pricingApi = createApi({
  reducerPath: "pricingApi",
  tagTypes: ["Pricing"],
  baseQuery: fetchBaseQuery({
    baseUrl: PRICING_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPricing: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();
        return `?${searchParams}`;
      },
      providesTags: ["Pricing"],
    }),
    createPricing: builder.mutation({
      query: (inputData) => ({
        url: "",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Pricing"],
    }),
    updatePricing: builder.mutation({
      query: ({ id, ...inputData }) => ({
        url: id,
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["Pricing"],
    }),
    deletePricing: builder.mutation({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
      invalidatesTags: ["Pricing"],
    }),
  }),
});

export const {
  useGetPricingQuery,
  useLazyGetPricingQuery,
  useCreatePricingMutation,
  useUpdatePricingMutation,
  useDeletePricingMutation,
} = pricingApi;
