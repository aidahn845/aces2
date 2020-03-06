import React, { useReducer, useContext } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { StoreProvider } from "./store/store";

import "assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import LandingPage from "views/LandingPage/LandingPage.js";
import VisionPage from "views/VisionPage";
import PeoplePage from "views/PeoplePage";
import LoginPage from "views/LoginPage/LoginPage.js";
import ProjectsPage from "views/ProjectsPage/ProjectsPage.js";
import TestPage from "views/TestPage"

var hist = createBrowserHistory();

ReactDOM.render(
  <StoreProvider>
    <Router history={hist}>
      <Switch>
        <Route path="/vision" component={VisionPage} />
        <Route path="/projects/:id" component={ProjectsPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/people" component={PeoplePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/test" component={TestPage} />
        <Route path="/" component={LandingPage} />
      </Switch>
    </Router>
  </StoreProvider>,
  document.getElementById("root")
);
