import React from "react";
import ReactDOM from "react-dom/client";
import "font-awesome/css/font-awesome.min.css";

import "antd/dist/reset.css";
import "antd-button-color/dist/css/style.css";
import "./index.css";

import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// or 'antd-button-color/dist/css/style.less'
import store from "./store";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
