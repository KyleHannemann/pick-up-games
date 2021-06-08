import {createStore, combineReducers} from 'redux';
import authReducer from './authReducer';
import createGameReducer from './createGameReducer';
import joinedGamesReducer from './joinedGamesReducer';
import socketReducer from './socketReducer';
import notificationReducer from './notificationsReducer';
import dmsReducer from "./dmsReducer";

const rootReducer = combineReducers({
    dmsReducer: dmsReducer,
    notificationReducer: notificationReducer,
    socketReducer: socketReducer,
    auth: authReducer,
    createGameReducer: createGameReducer,
    joinedGamesReducer: joinedGamesReducer
})

export default createStore(rootReducer)