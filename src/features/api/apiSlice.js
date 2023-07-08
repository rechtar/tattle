import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SSE } from "sse.js";
import { BASE_URL } from "src/app/constants";
import { i18n } from "src/app/translations";
import {
  setPartialResponse,
  setPartialResponseStreaming,
} from "src/features/global/globalSlice";

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

    deleteChat: builder.mutation({
      query: ({ chatId }) => ({
        method: "DELETE",
        url: `/chat/${chatId}`,
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

    submitResponse: builder.mutation({
      query: ({ chatId, message }) => ({
        method: "POST",
        url: `/chat/${chatId}/submit`,
        body: { content: { content: message } },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: "Message@" + arg.chatId, id: "LIST" },
      ],
    }),

    createMessageAndStream: builder.mutation({
      queryFn: () => ({ data: "" }),
      async onCacheEntryAdded(
        { chatId, message },
        {
          getState,
          dispatch,
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {
        try {
          await cacheDataLoaded;

          const source = new SSE(`${BASE_URL}/chat/${chatId}/stream`, {
            method: "POST",
            // cache: "no-cache",
            // keepalive: true,
            headers: {
              Authorization: `Bearer ${getState().global.me.token}`,
              Accept: "text/event-stream",
              "Content-Type": "application/json",
            },
            payload: JSON.stringify({ content: { content: message } }),
          });

          dispatch(
            setPartialResponse({
              chatId,
              content: null,
            })
          );

          dispatch(
            setPartialResponseStreaming({
              chatId,
              isStreaming: true,
            })
          );

          const SSE_TERMINATOR = "[DONE]";
          source.onmessage = (event) => {
            if (event.data !== SSE_TERMINATOR) {
              try {
                const parsed = JSON.parse(event.data);
                const line = parsed.choices[0].delta.content;
                if (!line) return;
                dispatch(
                  setPartialResponse({
                    chatId,
                    content:
                      (getState().global.partialResponses[chatId] || "") + line,
                  })
                );
              } catch (e) {
                console.warn("Cannot parse", e);
              }
            } else {
              dispatch(
                setPartialResponseStreaming({
                  chatId,
                  isStreaming: false,
                })
              );
            }
          };
          source.stream();
        } catch (e) {
          console.warn(e);
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        await cacheEntryRemoved;
      },
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
  useDeleteChatMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useSubmitResponseMutation,
  useCreateMessageAndStreamMutation,
} = apiSlice;
