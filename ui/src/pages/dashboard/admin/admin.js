import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import AdminDashboardStyle from '../styles';

import UserLists from './userlists';
import authReducer from '../../../redux/modules/auth';

class AdminDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={}
  }

  render(){
    const { userLists, user } =this.props;
    return(
      <>
        <UserLists 
            userLists={userLists}
            user={user}
        />
      </>
    )
  }
}

const AdminDashboardConatiner = connect(
  state => ({
    error: state.get('auth').error,
    loading: state.get('auth').loading,
    user: state.get('auth').user,
    userLists: state.get('auth').userLists
  }),
  dispatch => ({
    authReducer: authReducer.getActions(dispatch)
  })
)(AdminDashboard);

export default withStyles(AdminDashboardStyle, {withTheme: true})(AdminDashboardConatiner);