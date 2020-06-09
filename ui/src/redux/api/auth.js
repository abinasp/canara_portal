import axios from './index';

export async function checkAuth(){
    return axios.get('check');
}

export async function login(data){
    return axios.post('login',data);
}

export async function fetchUsers(){
    return axios.get('get-user');
}

export async function createUser(data){
    return axios.post('create-user',data);
}

export async function updateUser(data){
    return axios.put('update-user',data);
}

export async function deleteUser(data){
    return axios.post('delete-user',data);
}