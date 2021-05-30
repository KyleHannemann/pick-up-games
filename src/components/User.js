import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserFriends } from "../redux/authReducer";

const User = (props) => {
  const { user } = useSelector((store) => store.auth);
  console.log(user);
  const dispatch = useDispatch();
  //display user details,
  //if user = user display edit options


  //eventually have options for adding location, sports, etc to profile
  //eventually transfer edit page to user page;
  const userId = props.match.params.userId;
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (parseInt(user.user_id) === parseInt(props.match.params.userId)) {
      setOwnProfile(true);
      return;
    }
    for (let i = 0; i < user.friends.length; i++) {
      if (
        parseInt(user.friends[i].friend_id) ===
        parseInt(props.match.params.userId)
      ) {
        if (user.friends[i].accepted === true) {
          setFriends(true);
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
          return;
        }
        if (user.friends[i].accepted === true){
            setFriends(true);
            return;
        }
      }
    }
  }, [props.match.params.userId]);

  useEffect(() => {
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addFriend = () => {
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
      axios.put(`/users/addFriend/${e.target.value}`, {friendId : props.match.params.userId}).then((res) => {
        console.log(res.data);
        dispatch(setUserFriends(res.data));
        
      })
      .catch((err) => {
        console.log(err);
      });
      if (e.target.value === "decline"){
          setFriends(false)
          return;

      }
      setFriends(true)
      
  }

  return (
    <div id="userProfilePageContainer">
      {userProfile ? (
        <div>
          <h1>{userProfile.username}</h1>
          <h1>
            <img className="profilePicLarge" src={userProfile.picture} />
          </h1>
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
                <button  value="accept" onClick={handleFriendRequest}>accept friend request</button>
                <button value="decline" onClick={handleFriendRequest}>decline friend request</button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
export default User;
