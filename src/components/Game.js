import { useEffect, useState } from "react";
import axios from "axios";
import TimePicker from "react-time-picker";
import { useSelector, useDispatch } from "react-redux";
import { addGamesRed, removeGameRed } from "../redux/joinedGamesReducer";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import { IconContext } from "react-icons";
import { BiLock } from "react-icons/bi";

const Game = (props) => {
  const [game, setGame] = useState(null);
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  console.log(user);
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
    setNewComment("");
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
      {game ? (
        <div id="gamePageContainer">
          {" "}
          <div id="gamePageGameContainer">
            <div id="gamePageGameDets">
              <div>
                <div>
                  Created by{" "}
                  {game.players.map((p) => {
                    if (p.user_id === game.creator) {
                      return p.username;
                    }
                    return null;
                  })}
                </div>
                <div>{game.date.slice(0, game.date.indexOf("00:"))}</div>
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

              {game.public ||
              user.friends.filter((f) => {
                if (
                  game.creator === f.friendInfo.user_id &&
                  f.accepted === true
                ) {
                  return f;
                }
                return null;
              }).length > 0 ||
              game.creator === user.user_id ? (
                <div>
                  <p>{game.address}</p>
                  <a
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${game.latitude},${game.longitude}`
                      );
                    }}
                  >
                    get directions
                  </a>

                  {joined ? (
                    <button onClick={leaveGame}>leave game</button>
                  ) : null}
                  {!joined && game.max_players > game.players.length ? (
                    <button onClick={joinGame}>join game</button>
                  ) : null}
                </div>
              ) : null}
            </div>
            {joined ? (
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
                            parseInt(comment.user_id) ===
                            parseInt(player.user_id)
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
                })}
              </div>
            ) : null}
            {(!joined && !game.public &&
              user.friends.filter((f) => {
                if (
                  game.creator === f.friendInfo.user_id &&
                  f.accepted === true
                ) {
                  return f;
                }
                return null;
              }).length === 0 &&
              game.creator !== user.user_id) ? 
              <div>
                {user.friends.filter((f) => {
                  if (
                    game.creator === f.friendInfo.user_id &&
                    f.accepted === true
                  ) {
                    return f;
                  }
                  return null;
                }).length > 0 ? null : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderTop: "2px solid black",
                        width: "100%",
                      }}
                    >
                      <IconContext.Provider
                        value={{ style: { height: "60px", width: "60px" } }}
                      >
                        <BiLock />
                      </IconContext.Provider>
                      Private game
                    </h1>

                    <div>
                      {game.players.map((p) => {
                        if (p.user_id === game.creator) {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ marginRight: "8px" }}>
                                *befriend{" "}
                              </span>
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                to={`/users/${p.user_id}`}
                              >
                                <span style={{ marginRight: "8px" }}>
                                  {p.username}
                                </span>
                                <img
                                  src={p.picture}
                                  className="profilePicSmall"
                                />
                              </Link>{" "}
                              <span style={{ marginLeft: "8px" }}>
                                {" "}
                                to join
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div> : null}
            
          </div>
          <div id="gamePagePlayerContainer">
            {game.max_players === 1000 ? (
              <h3>Ulimited Players Needed</h3>
            ) : null}
            {game.max_players !== 1000 &&
            game.players.length <= game.max_players ? (
              <h3>{game.max_players - game.players.length} Players Needed</h3>
            ) : null}
            <h4 style={{ textAlign: "center" }}>
              {game.players.length} Joined Players
            </h4>
            {game.players.map((player) => {
              let friends = false;
              for (let i = 0; i < user.friends.length; i++) {
                if (
                  (user.friends[i].friend_id === player.user_id ||
                    user.friends[i].user_id === player.user_id) &&
                  user.friends[i].accepted === true
                ) {
                  friends = true;
                }
              }
              if (player.user_id === user.user_id) {
                friends = null;
              }
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  key={player.user_id}
                  to={`/users/${player.user_id}`}
                >
                  <div className="indDashGamePlayer">
                    <div>{player.username}</div>
                    <img src={player.picture} />
                    {friends === true ? (
                      <span>
                        {/* <span  style={{color: "#2D8C23 "}}>Friends</span> */}
                        <IconContext.Provider
                          value={{
                            style: {
                              height: "35px",
                              width: "35px",
                              color: "#228209",
                            },
                          }}
                        >
                          <FaRegHandshake />
                        </IconContext.Provider>{" "}
                      </span>
                    ) : null}
                    {friends === false ? (
                      <span>
                        {/* <span style={{color: "red"}}>Not Friends Yet</span> */}

                        <IconContext.Provider
                          value={{
                            style: {
                              height: "35px",
                              width: "35px",
                              color: "#D52217",
                            },
                          }}
                        >
                          <FaRegHandshake />
                        </IconContext.Provider>
                      </span>
                    ) : null}
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
