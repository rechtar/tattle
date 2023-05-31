import { I18n } from "i18n-js";

const translations = {
  en: {
    general: {
      send: "Send",
      sending: " (sending...)",
      my_chat: "My chat ",
      new_chat: "New chat",
      welcome: "Welcome to Chat+",
      welcome2: "Select a chat to get started",
    },
    auth: {
      username: "Username",
      password: "Password",
      confirm_password: "Confirm password",
      login: "Log in",
      alphanumeric: "(alphanumeric)",
      eight_digits_mininum: "(8 digits minimum)",
      signup: "Sign up",
    },
  },
  zh: {
    general: {
      send: "发送",
      sending: "（发送中…）",
      my_chat: "我的聊天 ",
      new_chat: "新建聊天",
      welcome: "欢迎来到 Lived Chat",
      welcome2: "新建或选择已有聊天开始吧！",
    },
    auth: {
      username: "用户名",
      password: "密码",
      confirm_password: "确认密码",
      login: "登录",
      alphanumeric: "（英文或数字）",
      eight_digits_mininum: "（最少8位）",
      signup: "注册",
    },
  },
};

export const i18n = new I18n(translations);
i18n.locale = navigator.language || "en";
i18n.enableFallback = true;
