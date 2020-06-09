import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createReducer from './reducers';

export default function configureStore(){
    let composeEnhancers = compose;

    if(process.env.NODE_ENV !== 'production' && typeof window === 'object'){
        if(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
    }

    const middleware = [thunk];
    const enhancers = [applyMiddleware(...middleware)];
    const store = createStore(createReducer(),composeEnhancers(...enhancers));

    store.injectedReducers = {};
    if(module.hot){
        module.hot.accept('./reducers', () => {
            store.replaceReducer(createReducer(store.injectedReducers));
        });
    }

    return store;
}
