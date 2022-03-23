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
    // The `getPosts` endpoint is a "query" operation that returns data
    getFlats: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "flat/",
    }),
    getResident: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "resident/",
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetFlatsQuery, useGetResidentQuery } = flatApiSlice;
