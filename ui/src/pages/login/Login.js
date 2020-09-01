import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import toastr from 'toastr';
import { withStyles } from '@material-ui/core/styles';
import history from '../../utils/history';
// styles
import LoginStyle from "./styles";
import { connect } from "react-redux";
import authReducer  from "../../redux/modules/auth";


class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isLoading: false,
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name] : e.target.value});
  }

  onLogin(){
    const { username, password } = this.state;
    this.setState({ isLoading: true });
    const { authReducer } = this.props;
    if(!username.trim()){
      return toastr.warning('Username is required');
    }
    if(!password.trim()){
      return toastr.warning('Password is required');
    }
    const reqObj = {username, password};
    authReducer.login(reqObj).then(res=>{
      if(res && res.success){
        history.push('/app/dashboard')
        window.location.reload();
        this.setState({ isLoading: false });
      }else{
        this.setState({ isLoading: false });
      }
    })
  }

  render(){
    const { classes } = this.props;
    const { username, password, isLoading } = this.state;
    return(
      <Grid container className={classes.container}>
        <div className={classes.logotypeContainer}>
          <Typography className={classes.logotypeText}>Canara bank Localization</Typography>
        </div>
        <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <TextField
                id="username"
                name="username"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={username}
                onChange={this.handleChange}
                margin="normal"
                label="Username"
                type="text"
                fullWidth
              />
              <TextField
                id="password"
                name="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={password}
                onChange={this.handleChange}
                margin="normal"
                label="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      username.length === 0 || password.length === 0
                    }
                    onClick={this.onLogin}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
              </div>
            </React.Fragment>
        </div>
        <Typography color="primary" className={classes.copyright}>
          © Reverie Language Technologies. All rights reserved.
        </Typography>
      </div>
      </Grid>
    )
  }
}

const LoginConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(Login);

export default withStyles(LoginStyle)(LoginConatiner);
