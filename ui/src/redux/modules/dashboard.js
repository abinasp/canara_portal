import * as DashboardApi from '../api/dashboard';
import ReducerFactory from '../../utils/reducerFactory';

const reducerName = 'dashboard';
const initialState = {
    loading: false,
    error: null,
    total: 0,
    stringsCount: []
}

const reducerFactory = new ReducerFactory(reducerName, initialState);
reducerFactory.addAction('DASHBOARD_LOADING', `${reducerName}Loading`,
    (status) => status, (state, action) => {
        const newState = Object.assign({}, state);
        newState.loading = action.data;
        return newState;
    }
);

reducerFactory.addAction('GET_STRINGS_COUNT', 'getStringsCount',
    async ()=>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await DashboardApi.getStringsCount();
        return response.data;
    }, (state, action) => {
        const newState = Object.assign({}, state);
        if(action && action.data){
            newState.stringsCount = action.data;
        }
        return newState;
    }
);

export default reducerFactory;
