const initialState = {
    location: null
}

const SET_GAME_LOCATION = "SET_GAME_LOCATION";



export function setGameLocation(location){
    return{
        type: SET_GAME_LOCATION,
        payload: location
    }
}

export default function createGameReducer(state=initialState, action){
    switch(action.type){
        case SET_GAME_LOCATION:
            return {...state, location: action.payload}
        default: 
            return {...state}
    }
}