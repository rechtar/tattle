import { I18n } from "i18n-js";

const translations = {
  en: {
    general: {
      send: "Send",
      sending: " (sending...)",
      ask_here: "Enter your question here",
      press_up: "Press Up to bring back last question",
      try_asking: "Enter your question here",
      my_chat: "My chat ",
      new_chat: "New chat",
      welcome: "Welcome to Chat+",
      welcome2: "Select a chat to get started",
      app_title: "Chat+",
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
      ask_here: "在这里输入你的问题",
      press_up: "按向上键⬆可恢复上一次输入",
      try_asking: "试试问小以：腰酸背痛怎么办",
      my_chat: "我的聊天 ",
      new_chat: "新建聊天",
      welcome: "欢迎来到「以聊为生 Lived Chat」",
      welcome2: "新建或选择已有聊天开始吧！",
      app_title: "以聊为生 Lived Chat",
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
// i18n.locale = navigator.language || "en";
i18n.locale = "zh";
i18n.enableFallback = true;
