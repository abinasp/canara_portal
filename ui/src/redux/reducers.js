import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from '../utils/history';
import auth from '../redux/modules/auth';
import translation from '../redux/modules/translation';

export default function createReducer(injectedReducer = {}){
    const rootReducer = combineReducers({
        auth: auth.getReducer(),
        translation: translation.getReducer(),
        ...injectedReducer
    });
    const mergeWithRouterState = connectRouter(history);
    return mergeWithRouterState(rootReducer);
}