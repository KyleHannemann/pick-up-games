const initialState = {
  dms: null,
  dmDrop: false,
  dmToState: null,
};

const SET_DMS = "SET_DMS";
const ADD_DM = "ADD_DMS";
const DROP_DM = "DROP_DM";
const DM_TO = "DM_TO";
const DM_SEEN = "DM_SEEN";

export function setDms(dms) {
  return {
    type: SET_DMS,
    payload: dms,
  };
}
export function addDm(dm) {
  return {
    type: ADD_DM,
    payload: dm,
  };
}
export function dropDownDm(status) {
  return {
    type: DROP_DM,
    payload: status,
  };
}
export function dmToRed(user_id) {
  return {
    type: DM_TO,
    payload: user_id,
  };
}
export function dmSeen(user_id, dm_from_id) {
  return {
    type: DM_SEEN,
    payload: { user_id: user_id, dm_from_id: dm_from_id },
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DMS:
      return { ...state, dms: action.payload };
    case ADD_DM:
      let newDms = [...state.dms];
      newDms = newDms.filter(d=>d.dm_id !== action.payload.dm_id)
      newDms.push(action.payload);
      return { ...state, dms: newDms };
    case DROP_DM:
      return { ...state, dmDrop: action.payload };
    case DM_TO:
      return { ...state, dmToState: action.payload };
    case DM_SEEN:
      let curDms = [...state.dms];
      for (let i = 0; i < curDms.length; i++) {
        if (
          curDms[i].dm_to === action.payload.user_id &&
          curDms[i].user_id === action.payload.dm_from_id
        ) {
            curDms[i].seen = true
        }
      }
      return {...state, dms: curDms}

    default:
      return { ...state };
  }
}
