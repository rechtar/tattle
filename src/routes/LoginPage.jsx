import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tab,
  Tabs,
  Classes,
  FormGroup,
  InputGroup,
  Button,
} from "@blueprintjs/core";
import { styled } from "goober";
import { login, register } from "src/features/global/globalSlice";
import { i18n } from "src/app/translations";

const Panel = styled("form")`
  min-width: 300px;
  min-height: 300px;
`;

export function LoginPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (result.payload.id) {
      navigate("/");
    }
  }

  return (
    <Panel onSubmit={handleSubmit}>
      <FormGroup label={i18n.t("auth.username")} labelFor="text-input">
        <InputGroup
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </FormGroup>
      <FormGroup label={i18n.t("auth.password")} labelFor="text-input">
        <InputGroup
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </FormGroup>
      <FormGroup>
        <Button type="submit" text={i18n.t("auth.login")} intent="primary" />
      </FormGroup>
    </Panel>
  );
}

export function SignupPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(register({ username, password }));
    if (result.payload.id) {
      navigate("/");
    }
  }
  return (
    <Panel onSubmit={handleSubmit}>
      <FormGroup
        label={i18n.t("auth.username")}
        labelFor="text-input"
        labelInfo={i18n.t("auth.alphanumeric")}
      >
        <InputGroup
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </FormGroup>
      <FormGroup
        label={i18n.t("auth.password")}
        labelFor="text-input"
        labelInfo={i18n.t("auth.eight_digits_mininum")}
      >
        <InputGroup
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </FormGroup>
      <FormGroup label={i18n.t("auth.confirm_password")} labelFor="text-input">
        <InputGroup
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
        />
      </FormGroup>
      <FormGroup>
        <Button text={i18n.t("auth.signup")} intent="success" type="submit" />
      </FormGroup>
    </Panel>
  );
}

export default function LoginPage() {
  const [selectedTab, setSelectedTab] = useState("login");

  function handleTabChange(tab) {
    setSelectedTab(tab);
  }

  return (
    <div className={Classes.DARK}>
      <Tabs onChange={handleTabChange} selectedTabId={selectedTab}>
        <Tab id="login" title={i18n.t("auth.login")} panel={<LoginPanel />} />
        <Tab
          id="signup"
          title={i18n.t("auth.signup")}
          panel={<SignupPanel />}
        />
      </Tabs>
    </div>
  );
}
