import {createStore, combineReducers} from 'redux';
import authReducer from './authReducer';
import createGameReducer from './createGameReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    createGameReducer: createGameReducer
})

export default createStore(rootReducer)