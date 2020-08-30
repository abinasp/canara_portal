import axios from './index';
import env from '../../env';

export async function getStringsCount(){
    return axios.get(env.LAAS_API_FOR_STRINGS);
}