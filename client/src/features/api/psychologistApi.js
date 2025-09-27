import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PSYCHOLOGIST_API = `${
  import.meta.env.VITE_BACKEND_URL
}/api/v1/psychologists/`;

export const psychologistApi = createApi({
  reducerPath: "psychologistApi",
  tagTypes: ["Psychologists", "Availability"],
  baseQuery: fetchBaseQuery({
    baseUrl: PSYCHOLOGIST_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPsychologists: builder.query({
      query: () => "",
      providesTags: ["Psychologists"],
    }),
    getPsychologistAvailability: builder.query({
      query: ({ id, date, duration }) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        if (duration) params.append("duration", duration);
        const queryString = params.toString();
        return `${id}/availability${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result, error, { id }) => [
        { type: "Availability", id },
        "Availability",
      ],
    }),
    updateAvailability: builder.mutation({
      query: ({ id, availability }) => ({
        url: `${id}/availability`,
        method: "PUT",
        body: { availability },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Availability", id },
        "Availability",
      ],
    }),
  }),
});

export const {
  useGetPsychologistsQuery,
  useGetPsychologistAvailabilityQuery,
  useUpdateAvailabilityMutation,
} = psychologistApi;
