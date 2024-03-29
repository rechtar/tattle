import { styled, css } from "goober";

export const AppContainer = styled("div")`
  display: flex;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
`;
export const Panel = styled("div")(
  (props) => `
  display: ${props.$isHidden ? "none" : "flex"};
  flex-direction: column;
  box-sizing: border-box;
  background: #333;
`
);
export const SidePanel = styled(Panel)((props) => ({
  background: "#202123",
  width: props.$isMobile ? `calc(100% - 20px)` : "300px",
  flexShrink: 0,
  padding: "10px",
}));
export const MainPanel = styled(Panel)`
  flex-grow: 1;
  font-size: 16px;
  line-height: 1.5;
`;
export const PlaceholderTop = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
export const ChatMessageViewport = styled("div")`
  flex-grow: 1;
  overflow-y: scroll;
`;
export const ChatMessageTop = styled("div")`
  padding: 20px;
  justify-content: center;
  &:last-child {
    padding-bottom: 10px;
  }
  display: flex;
  &:nth-child(odd) {
    background: #343540;
  }
  &:nth-child(even) {
    background: #444653;
  }
`;
export const ChatMessageAvatar = styled("div")`
  width: 30px;
  height: 30px;
  background: #777777;
  border-radius: 15px;
  margin-right: 10px;
  flex-shrink: 0;
`;
export const ChatMessageWrapper = styled("div")`
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
export const ChatMessageHead = styled("div")`
  margin-bottom: 10px;
`;
export const ChatMessageBody = styled("div")`
  /* background: #555555;
  padding: 10px;
  border-radius: 8px; */
  padding-top: 2px;
`;

export const marginLarge = css`
  margin-bottom: 20px;
`;
export const marginSmall = css`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const TitleWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "10px",
});

export const ChatIcon = styled("img")`
  width: 18px;
  margin-right: 10px;
`;

export const ChatTitle = styled("span")`
  flex-grow: 1;
`;

export const convoItem = css`
  height: 40px;
  color: inherit !important;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const convoItemActive = css`
  background: rgba(255, 255, 255, 0.2);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const ConvoList = styled("div")`
  overflow-y: scroll;
  flex-grow: 1;
`;

export const CreateConvo = styled("button")`
  height: 40px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: left;
  background: transparent;
  transition: none;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  &:hover {
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.05);
  }
`;
