const initialState = {
    dms: null,
    dmDrop: false,
    dmToState: null
}

const SET_DMS = "SET_DMS";
const ADD_DM = "ADD_DMS";
const DROP_DM = "DROP_DM";
const DM_TO = "DM_TO"

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
export function dropDownDm(status){
    return{
        type: DROP_DM,
        payload: status
    }
}
export function dmToRed(user_id){
    return{
        type: DM_TO,
        payload: user_id
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
        case DROP_DM:
            return {...state, dmDrop: action.payload}
        case DM_TO:
            return {...state, dmToState: action.payload}
        default: 
        return {...state}
    }
}