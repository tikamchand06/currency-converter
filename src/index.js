import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      hashed: false,
      components: { Button: { fontWeight: 500 } },
      token: { controlHeight: 36, colorPrimary: "#2196f3", fontFamily: "Inter" },
    }}
  >
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
);
