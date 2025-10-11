import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "./style/index.css";
import MobileOnlyLayout from "./hooks/MobileOnlyLayout.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <MobileOnlyLayout>
        <App />
      </MobileOnlyLayout>
    </HashRouter>
  </React.StrictMode>
);
