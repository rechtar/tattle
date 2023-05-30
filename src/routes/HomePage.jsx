import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Classes, Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
} from "src/features/api/apiSlice";
import {
  selectMe,
  loadCachedUser,
  getSelectedChat,
  setSelectecChat,
} from "src/features/global/globalSlice";
import brainIcon from "src/assets/brain.svg";
import wonderingIcon from "src/assets/wondering.svg";
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
  marginLarge,
  marginSmall,
  TitleWrapper,
} from "./styles";

function ChatContentPlaceholder() {
  return (
    <PlaceholderTop>
      <div>Welcome to Chat+</div> <br />
      <div>Select a chat to get started</div>
    </PlaceholderTop>
  );
}

function ChatContent({ chatId }) {
  const bottomRef = useRef();
  const [messageInput, setMessageInput] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const clearLastMessage = () => setLastMessage("");
  const {
    data: messages = [],
    isLoading,
    isSuccess,
    isFetching,
    error,
  } = useGetMessagesQuery(chatId);
  const [createMessage] = useCreateMessageMutation();

  const messagesWithLast = lastMessage
    ? messages.concat({
        id: "LAST",
        created_at: Date.now(),
        content: {
          content: lastMessage + i18n.t("general.sending"),
          role: "user",
        },
      })
    : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages.length, lastMessage]);

  useEffect(() => {
    clearLastMessage();
  }, [messages.length]);

  async function handleSend(e) {
    e.preventDefault();
    const mess = messageInput.trim();
    setLastMessage(mess);
    setMessageInput("");
    await createMessage({ chatId, message: mess });
  }

  return isLoading ? (
    <div></div>
  ) : (
    <>
      <ChatMessageViewport>
        {messagesWithLast.map((item) => (
          <ChatMessage key={item.id} message={item} />
        ))}
        <div ref={bottomRef} />
      </ChatMessageViewport>
      <form onSubmit={handleSend}>
        <ControlGroup>
          <InputGroup
            fill
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            rightElement={
              <Button
                text={i18n.t("general.send")}
                type="submit"
                disabled={!messageInput.trim()}
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
      <ChatMessageAvatar>
        {message.content.role === "user" ? (
          <img src={wonderingIcon} alt="user icon" />
        ) : (
          <img src={brainIcon} alt="ai icon" />
        )}
      </ChatMessageAvatar>
      <div>
        <ChatMessageHead>
          {new Date(message.created_at).toLocaleString()}
        </ChatMessageHead>
        <ChatMessageBody>
          {message.content.content || "(No response.)"}
        </ChatMessageBody>
      </div>
    </ChatMessageTop>
  );
}

function App() {
  const { isMobile } = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const me = useSelector(selectMe);
  const selectedChat = useSelector(getSelectedChat);
  const {
    data: chats = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetChatsQuery(chatId, { skip: !me?.id });
  const [createChat] = useCreateChatMutation();

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
    console.log(isMobile);
  }, [isMobile]);

  function handleNewChat() {
    createChat();
  }

  return (
    <AppContainer className={Classes.DARK}>
      <SidePanel isMobile={isMobile} hide={isMobile && chatId}>
        <Button
          intent="success"
          className={marginLarge}
          onClick={handleNewChat}
        >
          New chat
        </Button>
        {(chats || []).map((convo) => (
          <NavLink
            key={convo.id}
            className={({ isActive }) =>
              [
                Classes.BUTTON,
                Classes.OUTLINED,
                isActive ? Classes.ACTIVE : "",
                marginSmall,
              ].join(" ")
            }
            to={"/chat/" + convo.id}
            onClick={() => {
              dispatch(
                setSelectecChat({ title: convo.content.title, id: convo.id })
              );
            }}
          >
            {convo.content.title}
          </NavLink>
        ))}
      </SidePanel>

      <MainPanel hide={isMobile && !chatId}>
        {isMobile && (
          <TitleWrapper>
            <Button
              icon="chevron-left"
              onClick={() => navigate("/")}
              style={{ marginRight: "10px" }}
            />
            {selectedChat.name}
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
