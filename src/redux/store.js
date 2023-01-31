import { configureStore } from "@reduxjs/toolkit";
import config from "./slices/config";
import data from "./slices/pagesData";

export const store = configureStore({
  reducer: {
    config,
    data,
  },
  devTools: process.env.NODE_ENV !== "production",
});
