import axios from './index';
import env from '../../env';

export async function getStrings(data){
    return axios.get(`${env.LAAS_API}`,{
        params: {
            language: data.language,
            page:data.page,
            rowsPerPage: data.rowsPerPage,
            status: data.status
        }
    });
}

export async function editStrings(data){
    return axios.post(`${env.LAAS_API_EDIT}`, data);
}