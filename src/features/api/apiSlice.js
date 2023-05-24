import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "src/app/constants";
import { i18n } from "src/app/translations";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().global.me.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => "/chat",
      transformResponse: (response) => response.data,
      providesTags: (result = [], error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Post", id })),
      ],
    }),

    createChat: builder.mutation({
      query: (
        title = i18n.t("general.my_chat") + new Date().toLocaleDateString()
      ) => ({
        method: "POST",
        url: "/chat",
        body: { content: { title } },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    getMessages: builder.query({
      query: (chatId) => `/chat/${chatId}`,
      transformResponse: (response) => response.data,
      providesTags: (result = [], error, arg) => [
        { type: "Message@" + arg, id: "LIST" },
        ...result.map(({ id }) => ({ type: "Message@" + arg, id })),
      ],
    }),

    createMessage: builder.mutation({
      query: ({ chatId, message }) => ({
        method: "POST",
        url: `/chat/${chatId}`,
        body: { content: { content: message } },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: "Message@" + arg.chatId, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
} = apiSlice;
