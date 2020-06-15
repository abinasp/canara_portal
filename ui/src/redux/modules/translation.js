import * as TranslationAPi from '../api/translation';
import ReducerFactory from '../../utils/reducerFactory';
import toastr from 'toastr';

const reducerName = 'translation';
const initialState = {
    loading: false,
    error: null,
    total: 0,
    strings: []
}

const reducerFactory = new ReducerFactory(reducerName, initialState);
reducerFactory.addAction('TRANSLATION_LOADING', `${reducerName}Loading`,
    (status) => status, (state, action) => {
        const newState = Object.assign({}, state);
        newState.loading = action.data;
        return newState;
    }
);

reducerFactory.addAction('GET_STRINGS', 'getStrings',
    async (data)=>{
        reducerFactory.action(`${reducerName}Loading`, true);
        const response = await TranslationAPi.getStrings(data);
        return response.data;
    }, (state, action) => {
        const newState = Object.assign({}, state);
        if(action && action.data){
            newState.strings = action.data.strings;
            newState.total = action.data.total;
        }
        return newState;
    }
);

export default reducerFactory;