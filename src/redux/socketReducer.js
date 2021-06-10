const initialState = {
    socket: null
}

const SET_SOCKET = "SET_SOCKET"
const REMOVE_SOCKET = "REMOVE_SOCKET"
export function removeSocket(){
    return{
        type: REMOVE_SOCKET,
        payload: null
    }
}
export function placeSocket(socket){
    return{
        type: SET_SOCKET,
        payload: socket
    }
}

export default function reducer(state=initialState, action){
    switch(action.type){
        case SET_SOCKET:
            return {...state, socket:action.payload}
        case REMOVE_SOCKET:
            return {...state, socket: null}
        default:
            return {...state}
    }
}