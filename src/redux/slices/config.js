import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const configSlice = createSlice({
  name: "config",
  initialState: {
    url: "https://testapi.mebel-rassrochka.uz/api/v1",
    token: Cookies.get("token"),
    username: Cookies.get("username"),
    data: null,
    page: "/",
    short: true,
  },
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
    setUsername: (state, { payload }) => {
      state.username = payload;
    },
    changeData: (state, { payload }) => {
      state.data.name = payload[0];
      state.data.price = +payload[1];
      state.data.desription = payload[2];
    },
    setData: (state, { payload }) => {
      state.data = payload;
    },
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    setShort: (state, { payload }) => {
      state.short = payload;
    },
  },
});

export const { setToken, setUsername, setData, changeData, setPage, setShort } =
  configSlice.actions;
export default configSlice.reducer;
