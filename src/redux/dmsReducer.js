const initialState = {
    dms: null
}

const SET_DMS = "SET_DMS";
const ADD_DM = "ADD_DMS";

export function setDms(dms){
    return{
        type: SET_DMS,
        payload: dms
    }
}
export function addDm(dm){
    return{
        type: ADD_DM,
        payload: dm
    }
}

export default function (state=initialState, action){
    switch(action.type){
        case SET_DMS:
            return {...state, dms: action.payload}
        case ADD_DM:
            let newDms = [...state.dms]
            newDms.push(action.payload)
            return {...state, dms: newDms}
        default: 
        return {...state}
    }
}