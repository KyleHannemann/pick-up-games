import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {Link} from 'react-router-dom';
import {setGamesRed} from '../redux/joinedGamesReducer';

const Dash = (props) => {
  //Display tab for either joinedgames or invited games(alert for invites)
  const [games, setGames] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const joinedGames = useSelector((store) => store.joinedGamesReducer);
  console.log(joinedGames)
  useEffect(() => {
    getGamesAndPlayers();
  }, []);

  const getGamesAndPlayers = async () => {
    let allGamesAndPlayers = [];
    let allGames = await axios.get(`/game/joined`);
    dispatch(setGamesRed([...allGames.data]))
    for (let i = 0; i < allGames.data.length; i++) {
      let players = await axios.get(
        `/game/players/${allGames.data[i].game_id}`
      );
      allGames.data[i].players = players.data;
      allGamesAndPlayers.push(allGames.data[i]);
    }
    setGames(allGamesAndPlayers);
  };
  const leaveGame = (e) => {
    axios.put(`/game/leave/${e.target.value}`).then(res=>{
      console.log(res)
      getGamesAndPlayers()
    }).catch(err=>{
      console.log(err)
    })
  }

  return (
    <div id="dashContainer">
      <h1>Scheduled Games</h1>
      {games.map((game) => {
        return (
          <div className="dashGameContainer" key={game.game_id}>
            <div className="dashGameDets">
              <h3 className="dashGameViewTitle">{game.title}</h3>
              <img src={game.icon} />
              <span>{game.address}</span>
              <DatePicker
                value={game.date}
                disabled={true}
                disableCalendar={true}
              />
              <TimePicker disableClock={true} value={game.time} disabled={true} />
            </div>
            <div className="dashGamePlayersContainer">
              <h3 className="dashGameViewTitle"><span>{game.players.length}</span> players</h3>
              <div className="dashGamePlayers">
              {game.players.map((player) => {
                return (
                  <div onClick={()=>{
                    props.history.push(`/users/${player.user_id}`)
                  }}className="indDashGamePlayer" key={player.picture}>
                    <img src={player.picture} />
                    <span>{player.username}</span>
                  </div>
                );
              })}
              </div>
            </div>
            <div className="dashGameOptions">
              <h3 className="dashGameViewTitle">Options</h3>
              <Link to={`/game/${game.game_id}`}><button>Game Page</button></Link>
              <button value={game.game_id} onClick={leaveGame}>Leave Game</button>
              {user ? (
                
                  parseInt(game.creator) === parseInt(user.user_id) ? (
                    <button>edit game</button>
                  ) : (
                    null
                  )
              ) : (
                null
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dash;
