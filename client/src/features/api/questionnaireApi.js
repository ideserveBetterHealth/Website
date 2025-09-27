import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const QUESTIONNAIRE_API = `${
  import.meta.env.VITE_BACKEND_URL
}/api/v1/questionnaire/`;

export const questionnaireApi = createApi({
  reducerPath: "questionnaireApi",
  tagTypes: ["Questionnaire"],
  baseQuery: fetchBaseQuery({
    baseUrl: QUESTIONNAIRE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getQuestionnaire: builder.query({
      query: (serviceType) => serviceType,
      providesTags: ["Questionnaire"],
    }),
    createQuestionnaire: builder.mutation({
      query: (inputData) => ({
        url: "",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Questionnaire"],
    }),
    updateQuestionnaire: builder.mutation({
      query: ({ id, ...inputData }) => ({
        url: id,
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["Questionnaire"],
    }),
    deleteQuestionnaire: builder.mutation({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
      invalidatesTags: ["Questionnaire"],
    }),
  }),
});

export const {
  useGetQuestionnaireQuery,
  useCreateQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
} = questionnaireApi;
