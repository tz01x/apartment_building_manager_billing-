import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "../constant";
import { loggedOut, userLoginWithRefreshToken } from "./user-slices";
import { Mutex } from "async-mutex";

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", "jwt " + getState().user.access);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  await mutex.waitForUnlock();

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await api
          .dispatch(userLoginWithRefreshToken())
          .unwrap();

        if (refreshResult.access) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export default baseQueryWithReauth;
