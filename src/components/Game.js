import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addGamesRed, removeGameRed } from "../redux/joinedGamesReducer";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import { IconContext } from "react-icons";
import { BiLock } from "react-icons/bi";
import { FiArrowUpCircle } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

const Game = (props) => {
  const [game, setGame] = useState(null);
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  const [joined, setJoined] = useState(false);

  const dispatch = useDispatch();
  //messaging
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  
  /*beggingn on implementing replies*/
  // const [reply, setReply] = useState("");
  const reply = ""
  // const [replyArray, setReplyArray] = useState([]);

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

    setNewComment("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("game comment", (body) => {
        console.log(body);
        if (parseInt(body[0].game_id) === parseInt(props.match.params.gameId)) {
          let checkDuplicate = [...comments];
          for (let i = 0; i < checkDuplicate.length; i++){
            if (checkDuplicate[i].comment_id === body[0].comment_id){
              console.log("duplicate comment", body[0], checkDuplicate[i])
              return
            }
          }
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
                <div style={{ fontStyle: "italic", fontSize: "14px" }}>
                  Created by{" "}
                  {game.players.map((p) => {
                    if (p.user_id === game.creator) {
                      return p.username;
                    }
                    return null;
                  })}
                </div>
                <div>
                  <div>{game.date.slice(0, game.date.indexOf("00:"))}</div>
                  <div>
                    {game.time
                      .toString()
                      .split(":")
                      .reduce((acc, el, i) => {
                        if (i === 0) {
                          if (12 % el >= 12) {
                            console.log("o");
                            acc.push(el % 12);
                            acc.push("Pm");
                          } else if (parseInt(el) === 12) {
                            acc.push(el);
                            acc.push("Pm");
                          } else {
                            acc.push(el);
                            acc.push("Am");
                          }
                        } else {
                          return [acc[0], ":", el, " ", acc[1]];
                        }

                        return acc;
                      }, [])
                      .join("")}
                  </div>
                </div>
                <p style={{ fontSize: "10px" }}>{game.address}</p>
              </div>
              <div>
                <h1>{game.title}</h1>
                <img alt={game.title} src={game.icon} />
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
                  <p>{game.description}</p>
                  {joined && game.creator !== user.user_id ? (
                    <button onClick={leaveGame}>leave game</button>
                  ) : null}
                  {!joined && game.max_players > game.players.length ? (
                    <button onClick={joinGame}>join game</button>
                  ) : joined ? null : (
                    <div style={{ color: "red", fontSize: "24px" }}>
                      This Game Is Full
                    </div>
                  )}
                  <a
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${game.latitude},${game.longitude}`
                      );
                    }}
                  >
                    get directions
                  </a>
                </div>
              ) : null}
            </div>
            {joined ? (
              <div id="gamePageChatContainer">
                <div className="gameAllCommentsContainer">
                  {comments.map((comment) => {
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
                      <div className="gamePageCommentContainer">
                        {game.players.map((player) => {
                          if (
                            parseInt(comment.user_id) ===
                            parseInt(player.user_id)
                          ) {
                            return (
                              <Link to={`/users/${comment.user_id}`}>
                                <img alt={comment.username} src={player.picture} />{" "}
                              </Link>
                            );
                          }
                          return null;
                        })}

                        <div className="gameCommentsComment">
                          <span>
                            <div>
                              <span>{comment.comment_username}:</span>
                              {comment.content}
                            </div>
                          </span>
                          <div>
                            <span>
                              <span>
                                {comment.time_stamp.slice(
                                  0,
                                  comment.time_stamp.indexOf("T")
                                )}
                              </span>
                              <span>{readableTime}</span>
                            </span>
                            
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                  placeholder="comment.."
                />
                <span id="gameCommentButtonsContainer">
                  <FiArrowUpCircle size={26} onClick={submitComment} />

                  <TiDeleteOutline
                    onClick={() => {
                      setNewComment("");
                    }}
                    size={32}
                    color={"rgb(230, 86, 86)"}
                  />
                </span>
              </div>
            ) : null}
            {!joined &&
            !game.public &&
            user.friends.filter((f) => {
              if (
                game.creator === f.friendInfo.user_id &&
                f.accepted === true
              ) {
                return f;
              }
              return null;
            }).length === 0 &&
            game.creator !== user.user_id ? (
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
                                *Only friends of
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
                                alt={p.username}
                                  src={p.picture}
                                  className="profilePicSmall"
                                />
                              </Link>{" "}
                              <span style={{ marginLeft: "8px" }}>
                                {" "}
                                can join this game
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div id="gamePagePlayerContainer">
            {game.max_players === 1000 ? (
              <h3>Ulimited Players Needed</h3>
            ) : null}
            {game.max_players !== 1000 &&
            game.players.length <= game.max_players ? (
              <h3>{game.max_players - game.players.length} Players Needed</h3>
            ) : null}
            <h4 style={{ textAlign: "center", color: "grey" }}>
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
                  <div
                    id={`playerPicCommentLink${player.user_id}`}
                    className="indDashGamePlayer"
                  >
                    <img
                    alt={player.username}
                     src={player.picture} />
                    {friends === null ? (
                      <div>You</div>
                    ) : (
                      <div>{player.username}</div>
                    )}

                    {friends === true ? (
                      <span>
                        {/* <span  style={{color: "#2D8C23 "}}>Friends</span> */}
                        <IconContext.Provider
                          value={{
                            style: {
                              height: "25px",
                              width: "25px",
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
                              height: "25px",
                              width: "25px",
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
        <h1 style={{ textAlign: "center" }}>loading..</h1>
      )}
    </div>
  );
};

export default Game;
