import { I18n } from "i18n-js";

const translations = {
  en: {
    general: {
      send: "Send",
      sending: " (sending...)",
      my_chat: "My chat ",
    },
  },
  zh: {
    general: {
      send: "发送",
      sending: "（发送中…）",
      my_chat: "我的聊天 ",
    },
  },
};

export const i18n = new I18n(translations);
i18n.locale = navigator.language || "en";
i18n.enableFallback = true;
