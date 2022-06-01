import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";

// Define our single API slice object
export const flatApiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "flatApiSlice",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getFlats: builder.query({
      query: () => "flat/",
    }),
    getResidentList: builder.query({
      query: () => "resident/",
    }),
    getResident: builder.query({
      query: (slug) => `resident/${slug}/`,
    }),
    getMonthlyRentLog: builder.mutation({
      query: (slug) => `monthly-paid-log/${slug}/`,
    }),
    addElectricMeterReading: builder.mutation({
      query: (body) => ({
        url: "electricity-meter-reading/",
        method: "POST",
        body,
      }),
    }),
    addMonthlyRentEntry: builder.mutation({
      query: (body) => ({
        url: "monthly-paid-meter-reading/",
        method: "POST",
        body,
      }),
    }),
    getSlipPreview: builder.mutation({
      query: (date) => ({
        url: "electricity-meter-reading/pdf/preview/?date="+date,
      }),
    }),
    downloadPdf:builder.mutation({
      query:()=>({
        url:"electricity-meter-reading/pdf"
      })
    })
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
} = flatApiSlice;
