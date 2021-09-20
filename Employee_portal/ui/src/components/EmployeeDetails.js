import { TextField, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import reverise from '../reverise';
import { useEffect } from 'react';

const Employee = (props) => {

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
      padding: theme.spacing(5, 3)
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

  const { userData } = props;

  useEffect(() => {
    reverise();
  })

  
  // console.log(userData.userData.firstname);
  

  
  const classes = useStyles();
  
  return (
    <div>
      <Typography variant="h6" component="h6">
        Employee Details
      </Typography>

      <form>
        <TextField
          label="Firstname"
          name="firstname"
          disabled
          defaultValue={userData.firstname}
          className={classes.textField}
        />
        <TextField
          label="Lastname"
          name="lastname"
          disabled
          defaultValue={userData.lastname}
          className={classes.textField}
        />
        <TextField
          label="Username"
          name="username"
          disabled
          defaultValue={userData.username}
          className={classes.textField}
        />
        <TextField
          label="DoB"
          name="dob"
          disabled
          defaultValue={userData.DoB}
          className={classes.textField}
        />
        <TextField
          label="Mobile No"
          name="mobileno"
          disabled
          defaultValue={userData.mobileno}
          className={classes.textField}
        />
        <TextField
          label="Company"
          name="company"
          disabled
          defaultValue={userData.company}
          className={classes.textField}
        />
        <TextField
          label="Email"
          name="email"
          disabled
          defaultValue={userData.email}
          className={classes.textField}
        />
        </form>
    </div>
  )
}

export default Employee;