import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../constant";
import { Mutex } from "async-mutex";

// create a new mutex
const mutex = new Mutex();

const initialState = {
  access: "",
  refresh: localStorage.getItem("refreshToken") || "",
  loading: false,
};

export const userLogin = createAsyncThunk(
  "userSlice/login",
  async (fromData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE_URL + "token/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromData),
      });
      if (response.ok) {
        return response.json();
      } else {
        return rejectWithValue(await response.json());
      }
    } catch (error) {
      console.log("error :", error);
    }
  }
);

export const userLoginWithRefreshToken = createAsyncThunk(
  "userSlice/refreshToken",
  async () => {
    let data = null;
    await mutex.waitForUnlock();
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const token = localStorage.getItem("refreshToken");
      try {
        const response = await fetch(API_BASE_URL + "token/refresh/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: token }),
        });

        data = await response.json();

        if (data?.refresh) {
          localStorage.setItem("refreshToken", data.refresh);
        }
      } catch (error) {
        throw Error(error);
      } finally {
        release();
      }
    }
    return data;
  }
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    tokenReceived: (state, action) => {
      const { access, refresh } = action.payload;

      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
      }

      return {
        access,
        refresh,
        loading: false,
      };
    },

    loggedOut: (state) => {
      state.access = "";
      state.refresh = "";
    },
    refreshCurrentToken: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(userLogin.fulfilled, (state, action) => {
      // Add user to the state array

      const { refresh, access } = action.payload;
      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
        state.refresh = refresh;
        state.access = access;
      }
      state.loading = false;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      // Add user to the state array
      console.log(action.payload);
      state.loading = false;
    });

    builder.addCase(userLoginWithRefreshToken.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userLoginWithRefreshToken.fulfilled, (state, action) => {
      const { refresh, access } = action.payload;

      if (refresh) {
        state.refresh = refresh;
        state.access = access;
      }
      state.loading = false;
    });

    builder.addCase(userLoginWithRefreshToken.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { loggedOut, tokenReceived, refreshCurrentToken } =
  userSlice.actions;

export default userSlice.reducer;
