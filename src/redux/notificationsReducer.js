const initialState = {
    notifications: null
}

const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION"
export function setNotifications(noti){
    return{
        type: SET_NOTIFICATIONS,
        payload: noti
    }
}
export function addNotification(noti){
    return{
        type: ADD_NOTIFICATION,
        payload: noti
    }
}
export function removeNotification(notiId){
    return{
        type: REMOVE_NOTIFICATION,
        payload: notiId
    }
}

export  default function (state=initialState, action){
    switch(action.type){
        case SET_NOTIFICATIONS:
            return {...state, notifications: action.payload}
        case ADD_NOTIFICATION:
            let notis = [...state.notifications];
            let flag = false
            for (let i = 0; i < notis.length; i++){
                if (notis[0].notification_id === action.payload.notification_id){
                    flag = true;
                }
            }
            if (flag === false){
                notis = [...notis, action.payload]
            }
            return {...state, notifications: notis}
        case REMOVE_NOTIFICATION:
            let removedNoti = [...state.notifications];
            removedNoti = removedNoti.filter(el=>
                parseInt(el.notification_id) !== action.payload
            )
            return {...state, notifications: removedNoti}

        default:
            return {...state}
    }
} 