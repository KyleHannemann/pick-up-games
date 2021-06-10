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

export  default function reducer(state=initialState, action){
    switch(action.type){
        case SET_NOTIFICATIONS:
            return {...state, notifications: action.payload}
        case ADD_NOTIFICATION:
            let current_notis = [...state.notifications];
            let filter_out_duplicates = current_notis.filter(noti=>{
                if (parseInt(noti.notification_id) !== parseInt(action.payload.notification_id)){
                    return noti
                }
                else{
                    return null
                }
                 
            })
            let filtered_out_duplicates_with_new_added = [...filter_out_duplicates, action.payload]
            return {...state, notifications: filtered_out_duplicates_with_new_added}
            
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