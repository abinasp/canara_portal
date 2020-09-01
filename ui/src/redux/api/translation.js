import axios from './index';

export async function getStrings(data){
    return axios.get(`${process.env.REACT_APP_LAAS_API}`,{
        params: {
            language: data.language,
            page:data.page,
            rowsPerPage: data.rowsPerPage,
            status: data.status,
            search: data.search
        }
    });
}

export async function editStrings(data){
    data["REV-API-KEY"] = process.env.REACT_APP_CANARA_API_KEY;
    return axios.post(`${process.env.REACT_APP_LAAS_API_EDIT}`, data);
}