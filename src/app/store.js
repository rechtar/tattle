import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "../features/global/globalSlice";
import { apiSlice } from "../features/api/apiSlice";

export default configureStore({
  reducer: {
    global: globalReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
