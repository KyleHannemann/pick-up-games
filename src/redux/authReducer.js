const initialState = {
  user: null,
};

const SET_USER = "SET_USER";
const SET_FRIENDS = "SET_FRIENDS";
const UPDATE_FRIENDS = "UPDATE_FRIENDS";
const REMOVE_FRIEND = "REMOVE_FRIEND";
export function setUserFriends(friends) {
  return {
    type: SET_FRIENDS,
    payload: friends,
  };
}
export function updateFriends(friend) {
  return {
    type: UPDATE_FRIENDS,
    payload: friend,
  };
}
export function removeFriend(friend) {
  return {
    type: REMOVE_FRIEND,
    payload: friend,
  };
}
export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_FRIENDS:
      let newUserState = { ...state.user, friends: action.payload };
      return { ...state, user: newUserState };
    case UPDATE_FRIENDS:
      let updatedFriends;
      if (state.user.friends) {
        let newFriendsState = [...state.user.friends];
        newFriendsState = newFriendsState.filter((el) => {
          if (
            parseInt(el.friend_id) !== parseInt(action.payload.friend_id) &&
            parseInt(el.user_id) !== parseInt(action.payload.user_id)
          ) {
            return el;
          }
          return null;
        });
        newFriendsState.push(action.payload);
        updatedFriends = {
          ...state.user,
          friends: newFriendsState,
        };
      } else {
        updatedFriends = { ...state.user, friends: [action.payload] };
      }
      return { ...state, user: updatedFriends };
    case REMOVE_FRIEND:
      let removeFriends = [...state.user.friends];
      removeFriends = removeFriends.filter((f) => {
        if (
          f.friend_id !== action.payload.friend_id &&
          f.user_id !== action.payload.user_id
        ) {
        }
      });
    default:
      return { ...state };
  }
}
