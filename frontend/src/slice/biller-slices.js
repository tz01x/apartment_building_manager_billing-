import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";

// Define our single API slice object
export const flatApiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "flatApiSlice",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  tagTypes: ["residents"],
  endpoints: (builder) => ({
    getFlats: builder.query({
      query: () => "flat/",
    }),
    getResidentList: builder.query({
      query: () => "resident/",
      providesTags: ["residents"],
    }),
    getResident: builder.query({
      query: (slug) => `resident/${slug}/`,
      providesTags: ["residents"],
    }),
    getMonthlyRentLog: builder.mutation({
      query: (slug) => `monthly-paid-log/${slug}/`,
    }),
    addElectricMeterReading: builder.mutation({
      query: ({body}) => ({
        url: "electricity-meter-reading/",
        method: "POST",
        body,
      }),
    }),
    addMonthlyRentEntry: builder.mutation({
      query: ({body}) => ({
        url: "monthly-paid-meter-reading/",
        method: "POST",
        body,
      }),
    }),
    getSlipPreview: builder.mutation({
      query: (date) => ({
        url: "electricity-meter-reading/pdf/preview/?date=" + date,
      }),
    }),
    downloadPdf: builder.mutation({
      query: () => ({
        url: "electricity-meter-reading/pdf",
      }),
    }),
    addResident: builder.mutation({
      query: ({body}) => ({
        url: "resident/",
        body,
        method: "POST",
      }),
      invalidatesTags: ["residents"],
    }),
    updateResident: builder.mutation({
      query: ({slug, body}) => {
        console.log(slug,body)
        return{url: "resident/" + slug+"/",
        body,
        method: "PUT"}
      },
      invalidatesTags: (res, error, arg) => [
        "residents",
        { type: "residents", id: arg.slug },
      ],
    }),
    getExtraCharges: builder.query({
      query: () => "extra-charges/",
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetFlatsQuery,
  useAddMonthlyRentEntryMutation,
  useGetMonthlyRentLogMutation,
  useGetResidentQuery,
  useGetResidentListQuery,
  useAddElectricMeterReadingMutation,
  useGetSlipPreviewMutation,
  useDownloadPdfMutation,
  useAddResidentMutation,
  useGetExtraChargesQuery,
  useUpdateResidentMutation,
} = flatApiSlice;
