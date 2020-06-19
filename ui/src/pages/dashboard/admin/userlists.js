import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


import moment from 'moment';
import toastr from 'toastr';
import MUIDataTable from "mui-datatables";

import AdminStyle from '../styles';

import CRUDUser from '../components/crud/crud_user';
import authReducer from '../../../redux/modules/auth';



class UserLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openUser: false,
      editUser: false,
      deleteuser: false,
      name: '',
      role: 'translator',
      username: '',
      password: '',
      selectedUser: '',
      languages: [],
    }
    this.handleUserChange = this.handleUserChange.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.onEditSave = this.onEditSave.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
  }

  componentDidMount() {
    this.props.authReducer.checkApi().then(res => {
      if (res) {
        const { user } = this.props;
        if (user.role === 'admin') {
          this.props.authReducer.getUserLists();
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps
    }
  }

  handleUserChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLangChange(value) {
    if (value && value.length > 0) {
      let langArr = value.map(v => v.value);
      this.setState({ languages: langArr });
    } else {
      this.setState({ languages: [] });
    }
  }

  onCreateUser() {
    const { name, username, password, role, languages } = this.state;
    if (!name.trim()) {
      return toastr.warning('Name is required')
    }
    if (!username.trim()) {
      return toastr.warning('Username is required');
    }
    if (!password.trim()) {
      return toastr.warning('Password is required');
    }
    if (!languages || languages.length == 0) {
      return toastr.warning('Target language is required');
    }
    this.props.authReducer.createUser({ name, username, password, role, languages }).then((res) => {
      if (res && res.success) {
        this.props.authReducer.getUserLists().then(() => {
          this.setState({ openUser: false, name: '', username: '', password: '', languages: [] })
        });
      }
    })
  }

  onEditSave() {
    const { name, username, role, selectedUser, languages } = this.state;
    if (!name.trim()) {
      return toastr.warning('Name is required')
    }
    if (!username.trim()) {
      return toastr.warning('Username is required');
    }
    if (!languages || languages.length === 0) {
      return toastr.warning('Languages are required');
    }
    const { apikey } = selectedUser;
    const updatedUser = { apikey, name, username, languages };
    this.props.authReducer.updateUser({ updatedUser }).then((res) => {
      if (res && res.success) {
        this.props.authReducer.getUserLists().then(() => {
          this.setState({ openUser: false, editUser: false, selectedUser: '', name: '', username: '', password: '', languages: [] })
        });
      }
    })
  }

  deleteUser() {
    const { selectedUser } = this.state;
    const { apikey } = selectedUser;
    this.props.authReducer.deleteUser({ apikey }).then((res) => {
      if (res && res.success) {
        this.props.authReducer.getUserLists().then(() => {
          this.setState({ openUser: false, editUser: false, deleteuser: false, selectedUser: '', name: '', username: '', password: '', languages: [] })
        });
      }
    })
  }

  onCloseModal() {
    this.setState({ openUser: false, editUser: false, deleteuser: false, selectedUser: '', name: '', username: '', password: '', languages: [] })
  }

  onEditUser(user) {
    this.setState({ name: user.name, username: user.username, password: '', selectedUser: user, languages: user.languages ? user.languages : [] }, () => {
      this.setState({ editUser: true });
    })
  }

  onDeleteUser(user) {
    this.setState({ selectedUser: user }, () => {
      this.setState({ deleteuser: true });
    })
  }

  render() {

    const { classes, theme, userLists, user } = this.props;
    const { openUser, name, username, password, editUser, deleteuser, languages } = this.state;
    let arr = userLists && userLists.map(u=>{
      return[
        u.name,
        u.username,
        moment(u.createdAt).format('DD-MM-YYYY HH:MM:SS'),
        <EditIcon style={{color: '#4581A8', cursor: 'pointer' }} onClick={()=>this.onEditUser(u)} />,
        <DeleteIcon style={{color: 'rgb(210, 73, 18)', cursor: 'pointer' }} onClick={() => this.onDeleteUser(u)} />
      ]
    });
    return (
      <>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => this.setState({ openUser: true })}
          >
            Create User
              </Button>
        </div>
        <Grid item xs={12}>
          <MUIDataTable
            title="Translators List"
            data={arr}
            columns={['Name', 'Username', 'Created On', 'Edit', 'Delete']}
            options={{
              filter: false,
              print: false,
              download: false,
              selectableRows: false,
              sort: false
            }}
          />
        </Grid>
        {openUser && (
          <CRUDUser 
            action="create"
            openUser={openUser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.onCreateUser}
            handleLangChange={this.handleLangChange}
            crudUser={{
              name,
              username,
              password,
              languages
            }}
          />
        )}
        {editUser && (
          <CRUDUser 
            action="edit"
            openUser={editUser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.onEditSave}
            handleLangChange={this.handleLangChange}
            crudUser={{
              name,
              username,
              password,
              languages
            }}
          />
        )}
        {deleteuser && (
          <CRUDUser 
            action="delete"
            openUser={deleteuser}
            classes={classes}
            handleInputChange={this.handleUserChange}
            handleModalChange={this.onCloseModal}
            handleSave={this.deleteUser}
            handleLangChange={this.handleLangChange}
            crudUser={{
              name,
              username,
              password,
              languages
            }}
          />
        )}
      </>
    )
  }
}

const UserListsConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(UserLists);

export default withStyles(AdminStyle, { withTheme: true })(UserListsConatiner);