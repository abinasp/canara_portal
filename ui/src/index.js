import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import "toastr/build/toastr.css";
import toastr from "toastr";

import Themes from "./themes";
import App from "./components/App";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";
import configureStore from './redux/configureStore';

toastr.options = {
  positionClass: "toast-top-right"
}
toastr.options.showMethod = "slideDown";
toastr.options.hideMethod = "slideUp";
toastr.options.progressBar = true;
toastr.options.closeButton = true;
toastr.options.preventDuplicates = true;
toastr.options.closeDuration = 900;

const store = configureStore();
const MOUNT_NODE = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <LayoutProvider>
      <UserProvider>
        <ThemeProvider theme={Themes.default}>
          <CssBaseline />
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </UserProvider>
    </LayoutProvider>
  </Provider>,
  MOUNT_NODE
);

