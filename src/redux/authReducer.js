const initialState = {
    user: null
}

const SET_USER = "SET_USER";
const SET_FRIENDS = "SET_FRIENDS";

export function setUserFriends(friends){
    return{
        type: SET_FRIENDS,
        payload: friends
    }
}

export function setUser(user){
    return{
        type: SET_USER,
        payload: user
    }
}

export default function authReducer(state=initialState, action){
    switch(action.type){
        case SET_USER:
            return {...state, user: action.payload}
        case SET_FRIENDS:
            let newUserState = {...state.user, friends: action.payload}
            return {...state, user: newUserState}
        
        default: 
            return {...state};
    }
}