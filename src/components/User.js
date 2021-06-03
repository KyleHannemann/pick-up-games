import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserFriends } from "../redux/authReducer";

const User = (props) => {
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  console.log(user);
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
  const [friendSql, setFriendSql] = useState(null)

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log(props.match.params.userId);
    if (parseInt(user.user_id) === parseInt(props.match.params.userId)) {
      setOwnProfile(true);
      return;
    } else {
      setOwnProfile(false);
    }
    for (let i = 0; i < user.friends.length; i++) {
      if (
        parseInt(user.friends[i].friend_id) ===
        parseInt(props.match.params.userId)
      ) {
        if (user.friends[i].accepted === true) {
          setFriends(true);
          setFriendSql(user.friends[i])
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
          setFriendSql(user.friends[i])

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
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setUserProfile(res.data);
        axios
          .get(`game/joined/${userId}`)
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
        dispatch(setUserFriends(res.data));
        setFriends("pending");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFriendRequest = (e) => {
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
          dispatch(setUserFriends(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
      setFriends(true);
    } else if (e.target.value === "decline") {
      setFriends(false);
      axios
        .put(`/users/addFriend/${e.target.value}`, {
          friend_id: friendSql.friend_id, user_id: friendSql.user_id
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
    <div id="userProfilePageContainer">
      {userProfile ? (
        <div>
          <h1>{userProfile.username}</h1>
          <h1>
            <img className="profilePicLarge" src={userProfile.picture} />
          </h1>
          <h3>{user.email}</h3>
          <h3>{userProfile.email}</h3>
          {ownProfile ? null : (
            <div>
              {friends === true ? <div>you are friends</div> : null}
              {friends === "pending" ? <div>request sent</div> : null}
              {friends === false ? (
                <button onClick={addFriend}>add friend</button>
              ) : null}
              {friends === "requested" ? (
                <div>
                  <button value="accept" onClick={handleFriendRequest}>
                    accept friend request
                  </button>
                  <button value="decline" onClick={handleFriendRequest}>
                    decline friend request
                  </button>
                </div>
              ) : null}
            </div>
          )}
          {friends === true ? (
            <div>
              {joinedGames.map((game) => {
                return (
                  <div>
                    <h1>{game.title}</h1>
                    <h2>{game.date}</h2>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
export default User;
