import {createStore, combineReducers} from 'redux';
import authReducer from './authReducer';
import createGameReducer from './createGameReducer';
import joinedGamesReducer from './joinedGamesReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    createGameReducer: createGameReducer,
    joinedGamesReducer: joinedGamesReducer
})

export default createStore(rootReducer)