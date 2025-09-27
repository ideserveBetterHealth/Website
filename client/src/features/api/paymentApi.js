import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PAYMENT_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/`;

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  tagTypes: ["Payments"],
  baseQuery: fetchBaseQuery({
    baseUrl: PAYMENT_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (inputData) => ({
        url: "create-order",
        method: "POST",
        body: inputData,
      }),
    }),
    createCreditsOrder: builder.mutation({
      query: (inputData) => ({
        url: "create-credits-order",
        method: "POST",
        body: inputData,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (inputData) => ({
        url: "verify",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Payments"],
    }),
    getPayments: builder.query({
      query: () => "",
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateCreditsOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentsQuery,
} = paymentApi;
