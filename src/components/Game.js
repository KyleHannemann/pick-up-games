import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { useSelector, useDispatch } from "react-redux";
import { addGamesRed, removeGameRed } from "../redux/joinedGamesReducer";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const Game = (props) => {
  const [game, setGame] = useState(null);

  const { user } = useSelector((store) => store.auth);
  const [joined, setJoined] = useState(false);

  const dispatch = useDispatch();
  //messaging
  const [comments, setComments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newComment, setNewComment] = useState("");
  //get messages
  useEffect(() => {
    if (!user) {
      return;
    }
    axios
      .get(`/game/comments/${props.match.params.gameId}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //connect to io
  useEffect(() => {
    if (!user) {
      return;
    }
    setSocket(io.connect());
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);
  //sumbit comment
  const submitComment = () => {
    if (newComment === "") {
      return;
    }
    let timeStamp = new Date();
    axios
      .post(`/game/comment/add/${props.match.params.gameId}`, {
        content: newComment,
        timeStamp: timeStamp
      })
      .then((res) => {
        console.log(res);
        //put socket emit in here
        socket.emit("game comment", {
          user_id: user.user_id,
          comment_username: user.username,
          content: newComment,
          user_id: user.user_id,
          game_id: props.match.params.gameId,
          time_stamp: timeStamp
        });
        setNewComment("")
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (socket) {
      socket.on("game comment", (body) => {
        console.log(body);
        if (parseInt(body.game_id) === parseInt(props.match.params.gameId)) {
          console.log(comments);
          setComments((comments)=>[...comments, body]);
        }
      });
    }
  }, [socket]);
  ////////////////
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
      {console.log(comments)}
      {game ? (
        <div id="gamePageContainer">
          {" "}
          <div id="gamePageGameContainer">
            <div id="gamePageGameDets">
              <div>
                <DatePicker
                  clearIcon={false}
                  calendarIcon={false}
                  disabled={true}
                  value={game.date}
                />
                <TimePicker
                  clearIcon={false}
                  clockIcon={false}
                  disabled={true}
                  value={game.time}
                />
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
            <div id="gamePageChatContainer">
              <input
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
                placeholder="comment.."
              />
              <span id="gameCommentButtonsContainer">
              <button id="gameCommentSendButton" onClick={submitComment}>send</button>
              <button id="gameCommentClearButton" onClick={()=>{setNewComment("")}}>&#10005;</button>
              </span>
              {comments.map((comment) => {
                let asDate = new Date(comment.time_stamp)
                let amPm = 'am'
                let hours = asDate.getHours();
                let minutes = asDate.getMinutes();
                if(minutes < 10){
                  minutes = "0"+minutes;
                }
                if(hours >= 12){
                  amPm = "pm"
                }
                hours = (hours % 12) || 12;
                let readableTime = `${hours}:${minutes} ${amPm}`
                return (
                  <div key={comment.time_stamp}>
                    <p>{comment.content}</p>
                   <div>
                      {game.players.map(player=>{
                        if(parseInt(comment.user_id) === parseInt(player.user_id)){
                          return  <Link to={`/users/${comment.user_id}`}><img src={player.picture}/> </Link>
                        }
                        return null
                      })}
                    <h3>{comment.comment_username}</h3>
                    <span><span>{comment.time_stamp.slice(0, comment.time_stamp.indexOf("T"))}</span>
                    <span>{readableTime}</span>
                    </span>
                    </div>
                   
                    
                  </div>
                );
              })}
            </div>
          </div>
          <div id="gamePagePlayerContainer">
            <h3>{game.players.length} Players</h3>
            {game.players.map((player) => {
              return (
                <Link style={{textDecoration: "none"}} key={player.user_id} to={`/users/${player.user_id}`}>
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
