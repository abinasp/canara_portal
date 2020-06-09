import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
} from "@material-ui/core";
import {
  Person as AccountIcon,
} from "@material-ui/icons";
import history from '../../utils/history';

// styles
import useStyles from "./styles";

// components
import { Badge, Typography, Button } from "../Wrappers/Wrappers";

import { useUserDispatch, signOut } from "../../context/UserContext";


export default function Header(props) {
  var classes = useStyles();

  var userDispatch = useUserDispatch();

  var [profileMenu, setProfileMenu] = useState(null);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Canara Bank Localization
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
              John Doe
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="primary"
              href="https://canarabank.com/"
            >
              Canara Bank
            </Typography>
          </div>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => {
                window.localStorage.clear();
                history.push('/login');
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
