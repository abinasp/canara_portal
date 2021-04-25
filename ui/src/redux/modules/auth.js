import * as AuthApi from '../api/auth';
import ReducerFactory from '../../utils/reducerFactory';
import toastr from 'toastr';

const reducerName = 'auth';
const initialState = {
    loading: false,
    user: {},
    error: null,
    userLists: [],
    userTableData: []
}

const reducerFactory = new ReducerFactory(reducerName, initialState);
reducerFactory.addAction('AUTH_LOADING', `${reducerName}Loading`,
    (status) => status, (state, action) => {
        const newState = Object.assign({}, state);
        newState.loading = action.data;
        return newState;
    }
);

reducerFactory.addAction('LOGIN', 'login',
    async (data) =>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.login(data);
        return response.data;
    }, (state, action) =>{
        const newState = Object.assign({}, state);
        if(action.data.success){
            window.localStorage.setItem('rbi_auth', action.data.data.auth);
            newState.user = action.data.data.user;
        }else{
            toastr.error(action.data.error);
        }
        newState.loading = false;
        return newState;
    }
);

reducerFactory.addAction('USER_LISTS', 'getUserLists',
    async () => {
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.fetchUsers();
        return response.data;
    }, (state,action) => {
        const newState = Object.assign({}, state);
        if(action.data.success){
            newState.userLists = action.data.data.userLists;
        }
        newState.loading = false;
        return newState
    }
);

reducerFactory.addAction('CHECK_AUTH_API', 'checkApi', 
    async () => {
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.checkAuth();
        return response.data ? response.data : undefined;
    }, (state,action) => {
        const newState = Object.assign({}, state);
        if(action.data && action.data.success){
            window.localStorage.setItem('rbi_auth', action.data.data.auth);
            newState.user = action.data.data.user;
        }
        newState.loading = false;
        return newState;
    }
);

reducerFactory.addAction('CREATE_USER', 'createUser',
    async (data) =>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.createUser(data);
        return response.data;
    }, (state, action) =>{
        const newState = Object.assign({}, state);
        if(action.data.success){
            toastr.success(action.data.data);
        }else{
            toastr.error(action.data.error);
        }
        newState.loading = false;
        return newState;
    }
);

reducerFactory.addAction('UPDATE_USER', 'updateUser',
    async (data) =>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.updateUser(data);
        return response.data;
    }, (state, action) =>{
        const newState = Object.assign({}, state);
        if(action.data.success){
            toastr.success(action.data.data);
        }else{
            toastr.error(action.data.error);
        }
        newState.loading = false;
        return newState;
    }
);

reducerFactory.addAction('DELETE_USER', 'deleteUser',
    async (data) =>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await AuthApi.deleteUser(data);
        return response.data;
    }, (state, action) =>{
        const newState = Object.assign({}, state);
        if(action.data.success){
            toastr.success(action.data.data);
        }else{
            toastr.error(action.data.error);
        }
        newState.loading = false;
        return newState;
    }
);




export default reducerFactory;