import { Button, Paper, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";

import Employee from "./EmployeeDetails";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import reverise from '../reverise.js'

const UserForm = (props) => {

  useEffect(() => {
    reverise();
  },[])

  const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1)
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    },
    rightIcon: {
      marginLeft: theme.spacing(1)
    },
    iconSmall: {
      fontSize: 20
    },
    root: {
      padding: theme.spacing(3, 2)
    },
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 400
    }
  }));

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      password: ""
    }
  );

  const [showEmployee, setShowEmployee] = useState(false)
  const [userData, setUserData] = useReducer(
    (state, newState) => ({...state, ...newState}), {}
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();
    let data = { formInput };
    let response;
    setTimeout( async() => {
      response = await axios.post("http://localhost:5000/app/login", data);
      alert(response.data.message)
      if (response.data.message === "loggedIn successfully") {
        setUserData({ ...response.data.data })
        setShowEmployee({ showEmployee: true })
      }
    }, 1000);
  };
  
  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h3" align="center" style={{ margin: "10px", paddingBottom: "50px" }}>Employee Portal</Typography>
          <div>
            <Paper className={classes.root}>
              <Typography variant="h6" component="h3">
                Login Form
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  name="username"
                  defaultValue=""
                  className={classes.textField}
                  helperText="Enter your full name"
                  onChange={handleInput}
                />
                <TextField
                  label="Password"
                  name="password"
                  defaultValue=""
                  className={classes.textField}
                  type="password"
                  helperText="Enter your Password"
                  onChange={handleInput}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Login
                </Button>
              </form>
            </Paper>
            <Paper className={classes.root}>
              {showEmployee && (
              <Employee userData={userData}/>
              )}
            </Paper>
          </div>
    </div>

  );
}

export default UserForm;
