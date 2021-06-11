import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegHandshake } from "react-icons/fa";
import { IconContext } from "react-icons";
import TimePicker from "react-time-picker";
import EditProfile from "./EditProfile";
import { BiMessageDetail } from "react-icons/bi";
import { dmToRed, dropDownDm } from "../redux/dmsReducer";

const User = (props) => {
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  //display user details,
  //if user = user display edit options

  //eventually have options for adding location, sports, etc to profile
  //eventually transfer edit page to user page;
  const userId = props.match.params.userId;
  const [userProfile, setUserProfile] = useState(null);
  const [joinedGames, setJoinedGames] = useState([]);
  const [friends, setFriends] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);
  const [friendSql, setFriendSql] = useState(null);
  const [thisUserFriends, setThisUserFriends] = useState([]);

  //edit own profile
  const [edit, setEdit] = useState(false);
  useEffect(() => {}, [props.match.params.userId]);
  useEffect(() => {
    if (!user) {
      return;
    }
    axios
      .get(`/users/get/users/friends/${props.match.params.userId}`)
      .then((res) => {
        setThisUserFriends(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if (parseInt(user.user_id) === parseInt(props.match.params.userId)) {
      setOwnProfile(true);
      return;
    } else {
      setOwnProfile(false);
    }
    setFriends(false);
    for (let i = 0; i < user.friends.length; i++) {
      if (
        parseInt(user.friends[i].friend_id) ===
        parseInt(props.match.params.userId)
      ) {
        if (user.friends[i].accepted === true) {
          setFriends(true);
          setFriendSql(user.friends[i]);
          return;
        } else {
          setFriends("pending");
          return;
        }
      }
      if (
        parseInt(user.friends[i].user_id) ===
        parseInt(props.match.params.userId)
      ) {
        if (user.friends[i].accepted === false) {
          setFriends("requested");
          setFriendSql(user.friends[i]);

          return;
        }
        if (user.friends[i].accepted === true) {
          setFriends(true);
          return;
        }
      }
    }
  }, [props.match.params.userId, user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setUserProfile(res.data);
        axios
          .get(`/game/joined/${userId}`)
          .then((res) => {
            setJoinedGames(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.match.params.userId, user]);

  const addFriend = () => {
    if (!socket) {
      return;
    }
    setFriends("pending");

    socket.emit("friend update", {
      user_id: user.user_id,
      friend_id: parseInt(props.match.params.userId),
      accepted: false,
    });

    socket.emit("friend request notification", {
      user_id: parseInt(props.match.params.userId),
      description: "requested to be your friend",
      game_id: null,
      username: user.username,
      user_interaction_id: user.user_id,
      picture: user.picture,
    });

    axios
      .post("/users/addFriend", { friendId: userProfile.user_id })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFriendRequest = (e) => {
    if (!socket) {
      return;
    }
    if (e.target.value === "accept") {
      socket.emit("friend accept", {
        user_id: parseInt(props.match.params.userId),
        friend_id: user.user_id,
        accepted: true,
      });

      axios
        .put(`/users/addFriend/${e.target.value}`, {
          friendId: props.match.params.userId,
        })
        .then((res) => {
          console.log(res.data);
          //dispatch(setUserFriends(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
      setFriends(true);
    } else if (e.target.value === "decline") {
      setFriends(false);
      axios
        .put(`/users/addFriend/${e.target.value}`, {
          friend_id: friendSql.friend_id,
          user_id: friendSql.user_id,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      return;
    }
  };

  return (
    
    <div>
      {edit ? (
        <div id="userPageEditProfileFauxContainer">
          <button
            id="closeProfileEditScreen"
            onClick={async () => {
              await document
                .getElementById("editProfileContainer")
                .classList.add("editExit");
              await document
                .getElementById("closeProfileEditScreen")
                .classList.add("editExit");
              setTimeout(async () => {
                await document
                  .getElementById("editProfileContainer")
                  .classList.remove("editExit");
                await document
                  .getElementById("closeProfileEditScreen")
                  .classList.remove("editExit");

                setEdit(false);
              }, 150);
            }}
          >
            &#215;
          </button>
          <EditProfile
            closeEdit={async () => {
              await document
                .getElementById("editProfileContainer")
                .classList.add("editExit");
              await document
                .getElementById("closeProfileEditScreen")
                .classList.add("editExit");
              setTimeout(async () => {
                await document
                  .getElementById("editProfileContainer")
                  .classList.remove("editExit");
                await document
                  .getElementById("closeProfileEditScreen")
                  .classList.remove("editExit");

                setEdit(false);
              }, 100);
            }}
          />
        </div>
      ) : null}
      {userProfile ? (
        <div id="userProfilePageContainer">
          <div id="topHalfContainerProfile">
            <div id="topHalfTopHalfProfile">
              <div>
                <h1>{userProfile.username}</h1>
                <div>
                  {
                    joinedGames.filter((game) => {
                      let today = new Date();

                      let comp = new Date(game.date);
                      let time = game.time.split(":");
                      comp.setHours(time[0], time[1]);
                      if (comp <= today) {
                        return game;
                      } else return null;
                    }).length
                  }
                </div>
                <div>Games Played</div>
              </div>
              <div>
                <img alt={userProfile.username} src={userProfile.picture} />
              </div>

              {ownProfile ? (
                <div>
                  <span>Edit</span>
                  <IconContext.Provider
                    value={{ style: { height: "50px", width: "50px" } }}
                  >
                    <a
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      <AiOutlineEdit />
                    </a>
                  </IconContext.Provider>{" "}
                </div>
              ) : (
                <div id="profilePageFriendActions">
                  {friends === true ? (
                    <div>
                      <div>Friends</div>
                      <IconContext.Provider
                        value={{
                          style: {
                            height: "70px",
                            width: "70px",
                            color: "#228209",
                          },
                        }}
                      >
                        <FaRegHandshake />
                      </IconContext.Provider>
                    </div>
                  ) : null}
                  {friends === "pending" ? (
                    <div>
                      <div>Requested</div>
                      <IconContext.Provider
                        value={{
                          style: {
                            height: "70px",
                            width: "70px",
                            color: "#D52217",
                          },
                        }}
                      >
                        <FaRegHandshake />
                      </IconContext.Provider>
                    </div>
                  ) : null}
                  {friends === false ? (
                    <div>
                      <div>Not Friends Yet</div>
                      <IconContext.Provider
                        value={{
                          style: {
                            height: "70px",
                            width: "70px",
                            color: "#D52217",
                          },
                        }}
                      >
                        <FaRegHandshake />
                      </IconContext.Provider>
                      <div className="friendActionButtons">
                        <button
                          className="posFriendRequest"
                          onClick={addFriend}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {friends === "requested" ? (
                    <div>
                      <div>{userProfile.username}</div>
                      <div> Requested To Be Your Friend</div>
                      <IconContext.Provider
                        value={{
                          style: {
                            height: "70px",
                            width: "70px",
                            color: "#D52217",
                          },
                        }}
                      >
                        <FaRegHandshake />
                      </IconContext.Provider>
                      <div className="friendActionButtons">
                        <button
                          className="posFriendRequest"
                          value="accept"
                          onClick={handleFriendRequest}
                        >
                          Accept
                        </button>
                        <button
                          id="declineFriendRequest"
                          value="decline"
                          onClick={handleFriendRequest}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {friends === true || ownProfile === true ? (
              <div id="bottomHalfTopHalfProfil">
                {friends === true && !ownProfile ? (
                  <BiMessageDetail
                    size={40}
                    onClick={() => {
                      dispatch(dmToRed(userProfile.user_id));
                      dispatch(dropDownDm(true));
                    }}
                  />
                ) : null}
              </div>
            ) : (
              <div id="profileLockContainer">
                <IconContext.Provider
                  value={{ style: { height: "60px", width: "60px" } }}
                >
                  <BiLock />
                </IconContext.Provider>
                <h3>Become Friends to View {userProfile.username}'s Info</h3>
              </div>
            )}
          </div>
          {friends === true || ownProfile === true ? (
            <div id="bottomHalfContainerProfile">
              <div id="bottomHalfGamesContainerProfile">
                <h2>
                  {userProfile.username} has{" "}
                  {
                    joinedGames.filter((game) => {
                      let today = new Date();

                      let comp = new Date(game.date);
                      let time = game.time.split(":");
                      comp.setHours(time[0], time[1]);
                      if (comp >= today) {
                        return game;
                      } else return null;
                    }).length
                  }{" "}
                  games scheduled
                </h2>
                {joinedGames
                  .filter((game) => {
                    let today = new Date();

                    let comp = new Date(game.date);
                    let time = game.time.split(":");
                    comp.setHours(time[0], time[1]);
                    if (comp >= today) {
                      return game;
                    } else return null;
                  })
                  .sort((a, b) => {
                    if (new Date(a.date) >= new Date(b.date)) {
                      return 1;
                    } else {
                      return -1;
                    }
                  })
                  .map((game) => {
                    return (
                      <div>
                        <Link to={`/game/${game.game_id}`}>
                          <img alt="sport icon" src={game.icon} />
                        </Link>
                        <Link to={`/game/${game.game_id}`}>
                          <span>{game.title}</span>
                        </Link>
                        <div>
                          <div>
                            {game.date.slice(0, game.date.indexOf("00:"))}
                          </div>
                          <TimePicker
                            value={game.time}
                            disabled={true}
                            clearIcon={false}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div id="bottomHalfFriendsContainerProfile">
                <h2>{userProfile.username}'s Friends</h2>
                {thisUserFriends.map((el) => {
                  let areFriends = false;
                  if (el.user_id === userProfile.user_id) {
                    return null;
                  }
                  for (let i = 0; i < user.friends.length; i++) {
                    if (
                      (user.friends[i].user_id === el.user_id ||
                        user.friends[i].friend_id === el.user_id) &&
                      user.friends[i].accepted === true
                    ) {
                      areFriends = true;
                    }
                    if (user.user_id === el.user_id) {
                      areFriends = null;
                    }
                  }
                  return (
                    <div>
                      <Link to={`/users/${el.user_id}`}>
                        <img
                          alt={el.username}
                          className="profilePicSmall"
                          src={el.picture}
                        />
                      </Link>
                      {areFriends === null ? (
                        <span>You</span>
                      ) : (
                        <span>{el.username}</span>
                      )}

                      {areFriends === true ? (
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
                        </IconContext.Provider>
                      ) : null}
                      {areFriends === false ? (
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
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="loadingBarContainer" id="friendsLoadingBarContainer">
          <div className="loadingBar" id="mapLoadingBar"></div>
          <span>..loading</span>
        </div>
      )}
    </div>
  );
};
export default User;
