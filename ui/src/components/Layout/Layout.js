import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import UserLists from "../../pages/dashboard/admin/admin";
import StringLists from "../../pages/dashboard/admin/strings";
import authReducer from "../../redux/modules/auth";


// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();
  // global
  var layoutState = useLayoutState();
  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} {...props}/>
          {props.user && props.user.role === "admin" && (
            <Sidebar />
          )}
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/users" component={UserLists} />
              {/* <Route path="/app/translations" component={StringLists} /> */}
            </Switch>
          </div>
        </>
    </div>
  );
}

const LayoutContainer = connect(
  state => ({
    user: state.get('auth').user
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(Layout);
export default LayoutContainer;
