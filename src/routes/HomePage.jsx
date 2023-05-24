import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { styled, css } from "goober";
import { Classes, Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
} from "src/features/api/apiSlice";
import { selectMe, loadCachedUser } from "src/features/global/globalSlice";
import brainIcon from "src/assets/brain.svg";
import wonderingIcon from "src/assets/wondering.svg";

const AppContainer = styled("div")`
  display: flex;
  height: 100vh;
  width: 100vw;
`;
const Panel = styled("div")`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #333;
  border-radius: 2px;
  margin: 10px;
  padding: 10px;
`;
const SidePanel = styled(Panel)`
  width: 300px;
  flex-shrink: 0;
  margin-right: 0;
`;
const MainPanel = styled(Panel)`
  flex-grow: 1;
`;
const PlaceholderTop = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const ChatMessageViewport = styled("div")`
  flex-grow: 1;
  overflow-y: scroll;
  margin-bottom: 10px;
`;
const ChatMessageTop = styled("div")`
  &:not(:first-child) {
    margin-top: 10px;
  }
  margin-bottom: 10px;
  display: flex;
`;
const ChatMessageAvatar = styled("div")`
  width: 30px;
  height: 30px;
  background: #777777;
  border-radius: 15px;
  margin-right: 10px;
  flex-shrink: 0;
`;
const ChatMessageHead = styled("div")`
  margin-bottom: 10px;
`;
const ChatMessageBody = styled("div")`
  background: #555555;
  padding: 10px;
  border-radius: 8px;
`;

const marginLarge = css`
  margin-bottom: 20px;
`;
const marginSmall = css`
  margin-bottom: 10px;
`;

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
        content: { content: lastMessage + " (sending...)", role: "user" },
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
                text="Send"
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const me = useSelector(selectMe);
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

  function handleNewChat() {
    createChat();
  }

  return (
    <AppContainer className={Classes.DARK}>
      <SidePanel>
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
          >
            {convo.content.title}
          </NavLink>
        ))}
      </SidePanel>
      <MainPanel>
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
