import React from 'react';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

export default class CRUDUser extends React.Component{
  constructor(props){
    super(props);
    this.state={}
  }

  render(){
    const { action, openUser, handleInputChange, handleModalChange, handleSave, classes, crudUser } = this.props;
    return(
        <Dialog open={openUser} onClose={handleModalChange} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
          <DialogTitle id="form-dialog-title">{action==="create" ? "Create User": action === "edit" ? "Edit User" : "Delete User"}</DialogTitle>
          <DialogContent>
            {action === "delete" ? (
              <DialogContentText>Are you sure to delete this selected user ? </DialogContentText>
            ):(
              <>
                <TextField
                  margin="dense"
                  name="role"
                  label="Role"
                  value="Translator"
                  type="text"
                  disabled
                  fullWidth
                  />
                  <TextField
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    value={crudUser.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    name="username"
                    label="Username"
                    type="text"
                    value={crudUser.username}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  {action==="create" && (
                    <TextField
                      margin="dense"
                      name="password"
                      label="Password"
                      type="password"
                      value={crudUser.password}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalChange} classes={{ root: classes.button }}
                variant="contained"
                size="large"
                color={action==="delete" ? "primary" : "secondary"}>
              Cancel
            </Button>
            <Button onClick={handleSave} classes={{ root: classes.button }}
                variant="contained"
                size="large"
                color={action==="delete" ? "secondary": "primary"}>
              {action==="delete" ? "Delete" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
}