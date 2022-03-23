import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "../slice/pokemon-slices";
import { flatApiSlice } from "../slice/biller-slices";
import userReducer from "../slice/user-slices";
import { testSlice } from "../slice/test-slices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [testSlice.reducerPath]: testSlice.reducer,
    [flatApiSlice.reducerPath]: flatApiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonApi.middleware)
      .concat(flatApiSlice.middleware)
      .concat(testSlice.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
