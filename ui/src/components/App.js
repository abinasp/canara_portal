import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect, Router } from "react-router-dom";

import { connect } from "react-redux";

// components
import Layout from "./Layout";
import history from '../utils/history';
// pages
import Error from "../pages/error";
import Login from "../pages/login";
import authReducer from "../redux/modules/auth";

function App(props) {
  const isAuthenticated = window.localStorage.getItem('rbi_auth');
  
  return (
    <HashRouter>
      {!isAuthenticated ? <Redirect  to="/"/>
        : <Redirect to="/app/dashboard" />}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/app/dashboard" component={Layout} />
        <Route path="/app" component={Layout} />
        <Route path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );
}

const AppContainer = connect(
  state => ({
    user: state.get('auth').user
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(App)

export default AppContainer;
