const initialState = {
  games: []
};

const SET_GAMES = "SET_GAMES";
const ADD_GAME = "ADD_GAME";
const REMOVE_GAME = "REMOVE_GAME";

export function removeGameRed(game_id){
  return{
    type: REMOVE_GAME,
    payload: parseInt(game_id)
  }
}

export function setGamesRed(games) {
  return {
    type: SET_GAMES,
    payload: games,
  };
}
export function addGamesRed(game) {
  return {
    type: ADD_GAME,
    payload: game,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_GAMES: {
      return { ...state, games: action.payload };
    }
    case ADD_GAME: {
    
        return {...state, games: [...state.games, action.payload]}
    }
    case REMOVE_GAME: {
      let games  = [...state.games];
      return {...state, games: games.filter(game=>parseInt(game.game_id) !== action.payload)}
    }
    default: {
      return { ...state };
    }
  }
}
