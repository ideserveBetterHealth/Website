import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COUPON_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons/`;

export const couponApi = createApi({
  reducerPath: "couponApi",
  tagTypes: ["Coupons"],
  baseQuery: fetchBaseQuery({
    baseUrl: COUPON_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: (inputData) => ({
        url: "validate",
        method: "POST",
        body: inputData,
      }),
    }),
    getAllCoupons: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();
        return `?${searchParams}`;
      },
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation({
      query: (inputData) => ({
        url: "",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...inputData }) => ({
        url: id,
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
