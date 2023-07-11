import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Classes,
  Button,
  ControlGroup,
  InputGroup,
  Icon,
} from "@blueprintjs/core";
import { Helmet } from "react-helmet";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useCreateMessageAndStreamMutation,
  useSubmitResponseMutation,
} from "src/features/api/apiSlice";
import {
  selectMe,
  loadCachedUser,
  selectSelectedChat,
  setSelectedChat,
  setPartialResponse,
  selectPartialResponses,
  selectPartialResponseStreaming,
} from "src/features/global/globalSlice";
import brainIcon from "src/assets/brain.svg";
import wonderingIcon from "src/assets/wondering.svg";
import chatIcon from "src/assets/chat.svg";
import plusIcon from "src/assets/plus.svg";
import deleteIcon from "src/assets/delete.svg";
import { i18n } from "src/app/translations";
import { useIsMobile } from "src/hooks";
import {
  AppContainer,
  SidePanel,
  MainPanel,
  PlaceholderTop,
  ChatMessageViewport,
  ChatMessageTop,
  ChatMessageAvatar,
  ChatMessageHead,
  ChatMessageBody,
  ChatMessageWrapper,
  marginLarge,
  marginSmall,
  TitleWrapper,
  ChatIcon,
  ChatTitle,
  convoItem,
  convoItemActive,
  ConvoList,
  CreateConvo,
} from "./styles";

function ChatContentPlaceholder() {
  return (
    <PlaceholderTop>
      <div>{i18n.t("general.welcome")}</div> <br />
      <div>{i18n.t("general.welcome2")}</div>
    </PlaceholderTop>
  );
}

function ChatContent({ chatId }) {
  const bottomRef = useRef();
  const dispatch = useDispatch();

  const [messageInput, setMessageInput] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [isScrollLocked, setScrollLocked] = useState(false);
  const clearLastMessage = () => setLastMessage("");
  const {
    data: messages = [],
    isLoading,
    isSuccess,
    isFetching,
    error,
  } = useGetMessagesQuery(chatId);
  // const [createMessage] = useCreateMessageMutation();
  const [submitResponse] = useSubmitResponseMutation();
  const [createMessageAndStream, responseStream] =
    useCreateMessageAndStreamMutation();

  const partialResponses = useSelector(selectPartialResponses);
  const partialResponseStreaming = useSelector(selectPartialResponseStreaming);

  const messagesWithLast = lastMessage
    ? [
        ...messages,
        {
          id: "LAST",
          created_at: Date.now(),
          content: {
            content: lastMessage,
            role: "user",
          },
        },
      ]
    : messages;

  const messagesWithPartial = [
    ...messagesWithLast,
    ...(partialResponses[chatId] &&
    partialResponses[chatId] !== messages[messages.length - 1]?.content.content
      ? [
          {
            id: "PARTIAL",
            created_at: Date.now(),
            content: {
              content: partialResponses[chatId],
              role: "assistant",
            },
          },
        ]
      : []),
  ];
  useEffect(() => {
    if (!isScrollLocked)
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
  }, [messages.length, partialResponses, isScrollLocked]);

  useEffect(() => {
    clearLastMessage();
  }, [messages.length]);

  useEffect(() => {
    if (!partialResponseStreaming[chatId] && partialResponses[chatId]) {
      console.log("Streaming stopped. Submit it!");
      setScrollLocked(true);
      submitResponse({ chatId, message: partialResponses[chatId] }).then(() => {
        setTimeout(() => {
          dispatch(
            setPartialResponse({
              chatId,
              content: null,
            })
          );
          setScrollLocked(false);
        }, 500);
      });
    }
  }, [
    partialResponses,
    partialResponseStreaming,
    chatId,
    submitResponse,
    dispatch,
  ]);

  async function handleSend(e) {
    e.preventDefault();
    const mess = messageInput.trim();
    setLastMessage(mess);
    setMessageInput("");
    await createMessageAndStream({ chatId, message: mess });
  }

  return isLoading ? (
    <div></div>
  ) : (
    <>
      <ChatMessageViewport>
        {messagesWithPartial.map((item) => (
          <ChatMessage key={item.id} message={item} />
        ))}
        <div ref={bottomRef} />
      </ChatMessageViewport>
      <form
        onSubmit={handleSend}
        style={{
          padding: 10,
          display: "flex",
          justifyContent: "center",
          background: "#343540",
        }}
      >
        <ControlGroup style={{ maxWidth: 740, width: "100%" }}>
          <InputGroup
            fill
            large
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            style={{ boxShadow: "0 0 25px 0px rgba(0,0,0,.15)" }}
            rightElement={
              <Button
                type="submit"
                disabled={!messageInput.trim()}
                minimal
                icon="send-message"
                intent={messageInput.trim() ? "primary" : "none"}
              />
            }
          />
        </ControlGroup>
      </form>
    </>
  );
}

function ChatMessage({ message }) {
  return (
    <ChatMessageTop>
      <ChatMessageWrapper>
        <ChatMessageAvatar>
          {message.content.role === "user" ? (
            <img src={wonderingIcon} alt="user icon" />
          ) : (
            <img src={brainIcon} alt="ai icon" />
          )}
        </ChatMessageAvatar>
        <div>
          {/* <ChatMessageHead>
          {new Date(message.created_at).toLocaleString()}
        </ChatMessageHead> */}
          <ChatMessageBody
            dangerouslySetInnerHTML={{
              __html:
                message.content.content?.replace(/\n/g, "<br />") ||
                "(No response.)",
            }}
          ></ChatMessageBody>
        </div>
      </ChatMessageWrapper>
    </ChatMessageTop>
  );
}

function App() {
  const { isMobile } = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const me = useSelector(selectMe);
  const selectedChat = useSelector(selectSelectedChat);
  const {
    data: chats = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetChatsQuery(chatId, { skip: !me?.id });
  const [createChat] = useCreateChatMutation();
  const [deleteChat] = useDeleteChatMutation();

  useEffect(() => {
    if (!me?.id) {
      dispatch(loadCachedUser()).then((result) => {
        if (!result.payload?.id) {
          navigate("/login");
        }
      });
    }
  }, [me, navigate, dispatch]);

  useEffect(() => {
    if (isError && error.status === 401) {
      navigate("/login");
    }
  }, [isError, error, navigate]);

  async function handleNewChat() {
    try {
      const result = await createChat().unwrap();
      const newChatId = result[0].id;
      navigate(`/chat/${newChatId}`);
    } catch (e) {
      console.error("Error creating a chat", e);
    }
  }

  async function handleDeleteChat(e, chatId) {
    e.stopPropagation();
    e.preventDefault();
    await deleteChat({ chatId });
    navigate("/");
  }

  return (
    <AppContainer className={Classes.DARK}>
      <Helmet>
        <title>{i18n.t("general.app_title")}</title>
      </Helmet>
      <SidePanel $isMobile={isMobile} $isHidden={isMobile && chatId}>
        <CreateConvo className={marginSmall} onClick={handleNewChat}>
          <ChatIcon src={plusIcon} alt="plus icon" />
          {i18n.t("general.new_chat")}
        </CreateConvo>
        <ConvoList>
          {(chats || []).map((convo) => (
            <NavLink
              key={convo.id}
              className={({ isActive }) =>
                [convoItem, isActive ? convoItemActive : "", marginSmall].join(
                  " "
                )
              }
              to={"/chat/" + convo.id}
              onClick={() => {
                dispatch(
                  setSelectedChat({ title: convo.content.title, id: convo.id })
                );
              }}
            >
              <ChatIcon src={chatIcon} alt="chat icon" />
              <ChatTitle>{convo.content.title}</ChatTitle>
              {chatId === convo.id ? (
                <ChatIcon
                  src={deleteIcon}
                  alt="delete button"
                  width="14"
                  height="14"
                  style={{ marginRight: 0 }}
                  onClick={(e) => handleDeleteChat(e, convo.id)}
                />
              ) : null}
            </NavLink>
          ))}
        </ConvoList>
      </SidePanel>

      <MainPanel $isHidden={isMobile && !chatId}>
        {isMobile && (
          <TitleWrapper>
            <NavLink to={"/"} className={Classes.BREADCRUMB}>
              <Icon icon="chevron-left" />
              {selectedChat.name}
            </NavLink>
          </TitleWrapper>
        )}
        {me?.id && chatId ? (
          <ChatContent chatId={chatId} />
        ) : (
          <ChatContentPlaceholder />
        )}
      </MainPanel>
    </AppContainer>
  );
}

export default App;
