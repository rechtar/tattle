import { styled, css } from "goober";

export const AppContainer = styled("div")`
  display: flex;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
`;
export const Panel = styled("div")`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #333;
  border-radius: 2px;
  margin: 10px;
  padding: 10px;
`;
export const SidePanel = styled(Panel)((props) => ({
  width: props.isMobile ? `calc(100% - 20px)` : "300px",
  flexShrink: 0,
  display: props.hide ? "none" : "?",
}));
export const MainPanel = styled(Panel)((props) => ({
  flexGrow: 1,
  display: props.hide ? "none" : "?",
}));
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
  margin-bottom: 10px;
`;
export const ChatMessageTop = styled("div")`
  &:not(:first-child) {
    margin-top: 10px;
  }
  margin-bottom: 10px;
  display: flex;
`;
export const ChatMessageAvatar = styled("div")`
  width: 30px;
  height: 30px;
  background: #777777;
  border-radius: 15px;
  margin-right: 10px;
  flex-shrink: 0;
`;
export const ChatMessageHead = styled("div")`
  margin-bottom: 10px;
`;
export const ChatMessageBody = styled("div")`
  background: #555555;
  padding: 10px;
  border-radius: 8px;
`;

export const marginLarge = css`
  margin-bottom: 20px;
`;
export const marginSmall = css`
  margin-bottom: 10px;
`;

export const TitleWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "10px",
});
