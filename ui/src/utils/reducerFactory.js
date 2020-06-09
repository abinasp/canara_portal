import { bindActionCreators } from 'redux';

export default class ReducerFactory{
    constructor(name,initState){
        this.name = name;
        this.reduceFuncs = {};
        this.creators = {};
        this.initState = initState;
        this.boundActions = null;
    }

    isPromise(obj){
        return (!! obj && ((typeof obj) === 'object' || (typeof obj) === 'function') && obj.then && typeof obj.then === 'function');
    }

    addAction(type,trigger,data,reduce){
        this.reduceFuncs[type] = reduce.bind(this);
        if(data == null) return;
        if(typeof data !== 'function'){
            throw new Error('the data parameter must be a function');
        }
        this.creators[trigger] = (args) => {
            const _data = args ? data(args) : data()
            if(this.isPromise(_data)){
                return dispatch => _data.then(r=> {
                    dispatch({ type, data: r });
                    args && args.done && args.done({ success: true, data: r });
                    return r;
                },
                err => {
                    args && args.done && args.done({ success: false, err });
                });
            }
            return {type, data: _data};
        }
    }

    getName(){
        return this.name;
    }

    getReducer(){
        return (state = this.initState, action) => {
            if(this.reduceFuncs[action.type]){
                const _state = state;
                return this.reduceFuncs[action.type](_state,action);
            }
            return state;
        };
    }

    getActions(dispatch){
        this.boundActions = bindActionCreators(this.creators, dispatch);
        return this.boundActions;
    }

    action(name, data){
        if(this.creators[name]){
            return this.boundActions[name][data];
        }
    }
}