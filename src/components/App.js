import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ROOT_URL } from "../constants"

import LandingPage from "../views/LandingPage/LandingPage.js";
import VisionPage from "../views/VisionPage";
import PeoplePage from "../views/PeoplePage";
import LoginPage from "../views/LoginPage/LoginPage.js";
import ProjectsPage from "../views/ProjectsPage/ProjectsPage.js";
import DashboardProjects from "../views/Dashboard/DashboardProjects";
import DashboardUsers from "../views/Dashboard/DashboardUsers";
import TestPage from "../views/TestPage"

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated, isAdmin } = useUserState();
  var hist = createBrowserHistory();

  return (
    <HashRouter history={hist}>
      <Switch>
        <Route path={ROOT_URL + "vision"} component={VisionPage} />
        <Route path={ROOT_URL + "projects/:id"} component={ProjectsPage} />
        <Route path={ROOT_URL + "projects"} component={ProjectsPage} />
        <Route path={ROOT_URL + "people"} component={PeoplePage} />

        <PublicRoute path={ROOT_URL + "login"} component={LoginPage} />
        <Route exact path={ROOT_URL + "dashboard"}>
          <Redirect to={ROOT_URL + "dashboard/projects"} />
        </Route>
        <PrivateRoute path={ROOT_URL + "dashboard/users/:id"} component={DashboardUsers} />
        <PrivateRoute path={ROOT_URL + "dashboard/users"} component={DashboardUsers} />
        <PrivateRoute path={ROOT_URL + "dashboard/projects/:id"} component={DashboardProjects} />
        <PrivateRoute path={ROOT_URL + "dashboard/projects"} component={DashboardProjects} />
        <PrivateRoute path={ROOT_URL + "dashboard"} component={DashboardProjects} />

        <Route path={ROOT_URL + "test"} component={TestPage} />
        <Route path={ROOT_URL} component={LandingPage} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: ROOT_URL + "login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: ROOT_URL + "dashboard/projects",
              }}
            />
          ) : (
              React.createElement(component, props)
            )
        }
      />
    );
  }
}
