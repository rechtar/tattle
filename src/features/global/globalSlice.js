import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { BASE_URL } from "src/app/constants";

export const loadCachedUser = createAsyncThunk(
  "global/loadCachedUser",
  async () => {
    const item = localStorage.getItem("me");
    if (item) {
      return JSON.parse(item);
    }
  }
);

export const login = createAsyncThunk("global/login", async (credentials) => {
  const response = await fetch(BASE_URL + "/user/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const user = (await response.json()).data;
  localStorage.setItem("me", JSON.stringify(user));
  return user;
});

export const register = createAsyncThunk(
  "global/register",
  async (credentials) => {
    const response = await fetch(BASE_URL + "/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const user = (await response.json()).data;
    localStorage.setItem("me", JSON.stringify(user));
    return user;
  }
);

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    me: {},
    selectedChat: {},
    partialResponses: {},
    partialResponseStreaming: {},
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat.name = action.payload.title;
      state.selectedChat.id = action.payload.id;
    },
    removeSelectedChat: (state) => {
      state.selectedChat = {};
    },
    setPartialResponse: (state, action) => {
      const { chatId, content } = action.payload;
      if (content === null) {
        state.partialResponses = omit(state.partialResponses, chatId);
      } else {
        state.partialResponses[chatId] = content;
      }
    },
    setPartialResponseStreaming: (state, action) => {
      const { chatId, isStreaming } = action.payload;
      if (isStreaming) {
        state.partialResponseStreaming[chatId] = true;
      } else {
        state.partialResponseStreaming = omit(
          state.partialResponseStreaming,
          chatId
        );
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.me = action.payload;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.me = action.payload;
    });

    builder.addCase(loadCachedUser.fulfilled, (state, action) => {
      state.me = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  setSelectedChat,
  setPartialResponse,
  setPartialResponseStreaming,
} = globalSlice.actions;

export default globalSlice.reducer;
export const selectGlobal = (state) => state.global;
export const selectMe = (state) => state.global.me;
export const selectSelectedChat = (state) => state.global.selectedChat;
export const selectPartialResponses = (state) => state.global.partialResponses;
export const selectPartialResponseStreaming = (state) =>
  state.global.partialResponseStreaming;
