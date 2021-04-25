import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Person as AccountIcon,
} from "@material-ui/icons";
import history from '../../utils/history';

// styles
import useStyles from "./styles";
import { connect } from "react-redux";
import authReducer from "../../redux/modules/auth";
import classNames from "classnames";

// components
import { Badge, Typography, Button } from "../Wrappers/Wrappers";
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

import { useUserDispatch, signOut } from "../../context/UserContext";


function Header(props) {
  var classes = useStyles();
  var layoutState = useLayoutState();
  var userDispatch = useUserDispatch();
  var layoutDispatch = useLayoutDispatch();
  var [profileMenu, setProfileMenu] = useState(null);
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {props.user && props.user.role === "admin" && (
          <IconButton
            color="inherit"
            onClick={() => toggleSidebar(layoutDispatch)}
            className={classNames(
              classes.headerMenuButton,
              classes.headerMenuButtonCollapse,
            )}
          >
            {layoutState.isSidebarOpened ? (
              <MenuIcon
                classes={{
                  root: classNames(
                    classes.headerIcon,
                    classes.headerIconCollapse,
                  ),
                }}
              />
            ) : (
                <MenuIcon
                  classes={{
                    root: classNames(
                      classes.headerIcon,
                      classes.headerIconCollapse,
                    ),
                  }}
                />
              )}
          </IconButton>
        )}
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          RBI Localization solution
        </Typography>
        <div className={classes.grow} />
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {props.user && props.user.name ? props.user.name : 'RBI User'}
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="primary"
              href="https://rbi.org.in"
            >
              RBI Bank
            </Typography>
          </div>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => {
                window.localStorage.clear();
                history.push('#');
                window.location.reload();
              }}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

const HeaderConatiner = connect(
  state => ({
    user: state.get('auth').user
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(Header);

export default HeaderConatiner;
