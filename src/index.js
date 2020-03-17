import React, { useReducer, useContext } from "react";
import ReactDOM from "react-dom";
import App from "./components/App"
import { StoreProvider } from "./store/store";
import { UserProvider } from "./context/UserContext";

import "assets/scss/material-kit-react.scss?v=1.8.0";

ReactDOM.render(
  <UserProvider>
    <StoreProvider>
      <App />
    </StoreProvider>
  </UserProvider>,
  document.getElementById("root")
);
