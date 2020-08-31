import axios from './index';

export async function getStringsCount(){
    return axios.get(process.env.REACT_APP_LAAS_API_FOR_STRINGS);
}