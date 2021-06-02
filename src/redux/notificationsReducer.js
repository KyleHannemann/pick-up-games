const initialState = {
    notifications: null
}

const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";

export function setNotifications(noti){
    return{
        type: SET_NOTIFICATIONS,
        payload: noti
    }
}

export  default function (state=initialState, action){
    switch(action.type){
        case SET_NOTIFICATIONS:
            return {...state, notifications: action.payload}
        default:
            return {...state}
    }
} 