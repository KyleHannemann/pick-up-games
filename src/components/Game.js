import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { useSelector, useDispatch } from "react-redux";
import { addGamesRed, removeGameRed } from "../redux/joinedGamesReducer";
import { Link } from "react-router-dom";

const Game = (props) => {
  const [game, setGame] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const [joined, setJoined] = useState(false);
  const dispatch = useDispatch();

  const getGameAndPlayers = async () => {
    let res = await axios.get(`/game/${props.match.params.gameId}`);
    let thisGame = res.data[0];

    let players = await axios.get(`/game/players/${props.match.params.gameId}`);

    thisGame.players = players.data;

    if (!user) {
      //show game and prompt to join
      return;
    }
    setJoined(false);
    for (let i = 0; i < players.data.length; i++) {
      if (parseInt(players.data[i].user_id) === user.user_id) {
        setJoined(true);
      }
    }

    console.log(thisGame);
    setGame(thisGame);
  };

  useEffect(() => {
    getGameAndPlayers();
  }, [user]);

  const joinGame = () => {
    axios
      .put(`/game/join/${props.match.params.gameId}`)
      .then((res) => {
        if (res.status === 200) {
          dispatch(addGamesRed(game));
          alert("you have joined the game");
          getGameAndPlayers();

          //
        } else {
          return alert("join failed");
        }
      })
      .catch((err) => {
        console.log(err);
        return alert("join failed");
      });
  };
  const leaveGame = () => {
    axios
      .put(`/game/leave/${props.match.params.gameId}`)
      .then((res) => {
        dispatch(removeGameRed(props.match.params.gameId));
        alert("you have left this game");
        getGameAndPlayers();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      {game ? (
        <div id="gamePageContainer">
          {" "}
          <div id="gamePageGameContainer">
            <div id="gamePageGameDets">
              <div>
                <DatePicker disabled={true} value={game.date} />
                <TimePicker disabled={true} value={game.time} />
                
              </div>
              <div>
                <h1>{game.title}</h1>
                <img src={game.icon} />
                <p>{game.description}</p>
              </div>

              <div>
              <p>{game.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${game.latitude},${game.longitude}`}
                >
                  get directions
                </a>
              
              {joined ? (
                <button onClick={leaveGame}>leave game</button>
              ) : (
                <button onClick={joinGame}>join game</button>
              )}
              </div>
            </div>
            <div id="gamePageChatContainer" />
          </div>
          <div id="gamePagePlayerContainer">
            <h1>Players</h1>
            {game.players.map((player) => {
              return (
                <Link key={player.user_id} to={`/users/${player.user_id}`}>
                  <div className="indDashGamePlayer">
                    <div>{player.username}</div>
                    <img src={player.picture} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div>loading..</div>
      )}
    </div>
  );
};

export default Game;
