import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { useSelector, useDispatch } from "react-redux";
import { addGamesRed, removeGameRed } from "../redux/joinedGamesReducer";
import { Link } from "react-router-dom";

const Game = (props) => {
  const [game, setGame] = useState(null);
  const {socket} = useSelector((store)=>store.socketReducer)
  const { user } = useSelector((store) => store.auth);

  const [joined, setJoined] = useState(false);

  const dispatch = useDispatch();
  //messaging
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyArray, setReplyArray] = useState([]);
  
  //get messages
  useEffect(() => {
    if (!user) {
      return;
    }
    axios
      .get(`/game/comments/${props.match.params.gameId}`)
      .then((res) => {
        setComments(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, props.match.params.gameId]);

  
  //sumbit comment
  const submitComment = (e) => {
    let replyCheck = false;
    let repliedTo = null;
    let whichContent = newComment;
    if (e.target.value) {
      replyCheck = true;
      repliedTo = e.target.value;
      whichContent = reply;
    } else {
      if (newComment === "") {
        return;
      }
    }
    let timeStamp = new Date();
    if (!socket) {
      console.log("no socket");
      return;
    }
    socket.emit("game comment", {
      user_id: user.user_id,
      comment_username: user.username,
      content: whichContent,
      game_id: props.match.params.gameId,
      time_stamp: timeStamp,
      reply: replyCheck,
      reply_to: repliedTo,
    });
    // axios
    //   .post(`/game/comment/add/${props.match.params.gameId}`, {
    //     content: newComment,
    //     timeStamp: timeStamp
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     //put socket emit in here
    //     socket.emit("game comment", {
    //       user_id: user.user_id,
    //       comment_username: user.username,
    //       content: newComment,
    //       user_id: user.user_id,
    //       game_id: props.match.params.gameId,
    //       time_stamp: timeStamp,
    //       reply: replyCheck,
    //       reply_to: repliedTo

    //     });
    //     setNewComment("")
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setNewComment("")
  };

  useEffect(() => {
    if (socket) {
      socket.on("game comment", (body) => {
        console.log(body);
        if (parseInt(body[0].game_id) === parseInt(props.match.params.gameId)) {
          console.log(comments);
          setComments((comments) => [...comments, body[0]]);
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
  }, [user, props.match.params.gameId]);

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
                <button id="gameCommentSendButton" onClick={submitComment}>
                  send
                </button>
                <button
                  id="gameCommentClearButton"
                  onClick={() => {
                    setNewComment("");
                  }}
                >
                  &#10005;
                </button>
              </span>
              {comments.map((comment) => {
                if (comment.reply === true) {
                  return null;
                }
                let asDate = new Date(comment.time_stamp);
                let amPm = "am";
                let hours = asDate.getHours();
                let minutes = asDate.getMinutes();
                if (minutes < 10) {
                  minutes = "0" + minutes;
                }
                if (hours >= 12) {
                  amPm = "pm";
                }
                hours = hours % 12 || 12;
                let readableTime = `${hours}:${minutes} ${amPm}`;
                return (
                  <div key={comment.comment_id}>
                    <p>{comment.content}</p>
                    <div>
                      {game.players.map((player) => {
                        if (
                          parseInt(comment.user_id) === parseInt(player.user_id)
                        ) {
                          return (
                            <Link to={`/users/${comment.user_id}`}>
                              <img src={player.picture} />{" "}
                            </Link>
                          );
                        }
                        return null;
                      })}
                      <h3>{comment.comment_username}</h3>
                      <span>
                        <span>
                          {comment.time_stamp.slice(
                            0,
                            comment.time_stamp.indexOf("T")
                          )}
                        </span>
                        <span>{readableTime}</span>
                      </span>
                      {/* {//For Adding comments will probably want a seperate component
                        comments.map((comment2) => {
                        if (
                          comment2.reply === true &&
                          parseInt(comment2.reply_to) ===
                            parseInt(comment.comment_id)
                        ) {
                          let asDate = new Date(comment2.time_stamp);
                          let amPm = "am";
                          let hours = asDate.getHours();
                          let minutes = asDate.getMinutes();
                          if (minutes < 10) {
                            minutes = "0" + minutes;
                          }
                          if (hours >= 12) {
                            amPm = "pm";
                          }
                          hours = hours % 12 || 12;
                          let readableTime = `${hours}:${minutes} ${amPm}`;
                          return (
                            <div key={comment2.comment_id}>
                              <p>{comment2.content}</p>
                              <div>
                                {game.players.map((player) => {
                                  if (
                                    parseInt(comment2.user_id) ===
                                    parseInt(player.user_id)
                                  ) {
                                    return (
                                      <Link to={`/users/${comment2.user_id}`}>
                                        <img src={player.picture} />{" "}
                                      </Link>
                                    );
                                  }
                                  return null;
                                })}
                                <h3>{comment2.comment_username}</h3>
                                <span>
                                  <span>
                                    {comment2.time_stamp.slice(
                                      0,
                                      comment2.time_stamp.indexOf("T")
                                    )}
                                  </span>
                                  <span>{readableTime}</span>
                                </span>
                              </div>
                            </div>
                          );
                        } else {
                          return null;
                        } */}
                      {/* }
                      )} */}
                      {/* <button
                        onClick={() => {
                          setReplyArray([...replyArray, comment.comment_id]);
                        }}
                      >
                        reply
                      </button>
                      {replyArray.includes(comment.comment_id) === true ? (
                        <div>
                          <input
                            onChange={(e) => {
                              setReply(e.target.value);
                            }}
                          />
                          <button
                            value={comment.comment_id}
                            onClick={submitComment}
                          >
                            send
                          </button>
                        </div>
                      ) : null} */}
                    </div>
                  </div>
                );
              })
              }
            </div>
          </div>
          <div id="gamePagePlayerContainer">
            <h3>{game.players.length} Players</h3>
            {game.players.map((player) => {
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  key={player.user_id}
                  to={`/users/${player.user_id}`}
                >
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
