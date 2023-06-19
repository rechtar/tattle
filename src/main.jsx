import React from "react";
import ReactDOM from "react-dom/client";
import "src/index.css";
import store from "src/app/store";
import { Provider } from "react-redux";
import { setup } from "goober";
import { shouldForwardProp } from "goober/should-forward-prop";
import { FocusStyleManager } from "@blueprintjs/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "src/routes/HomePage";
import LoginPage from "src/routes/LoginPage";
import ErrorPage from "src/routes/ErrorPage";

FocusStyleManager.onlyShowFocusOnTabs();
setup(
  React.createElement,
  undefined,
  undefined,
  shouldForwardProp((prop) => {
    // Do NOT forward props that start with `$` symbol
    return prop["0"] !== "$";
  })
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat/:chatId",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
