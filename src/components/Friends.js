//list of friends
//includes username, email, picture, (gamesplayed? scheduled games)
//button to see page

//discover people
import {FaRegHandshake} from 'react-icons/fa'
import {IconContext} from 'react-icons';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Dms from './Dms';

const Friends = (props) => {
  const { user } = useSelector((store) => store.auth);
  console.log(user);
  const [discoverPeople, setDiscoverPeople] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchPeople, setSearchPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchFriends, setSearchFriends] = useState([]);

  useEffect(() => {
    axios
      .get("/users/friends/all")
      .then((res) => {
        // let data = res.data;
        // // let friendsArr = [{key: 'invite all friends', id: 'all'}]
        // // for (let i = 0; i < data.length; i++){
        // //   if(parseInt(data[i].user_id) !== parseInt(user.user_id)){
        // //      friendsArr.push({
        // //        key: data[i].username,
        // //        id: data[i].user_id
        // //      })
        // //   }
        // // }
        // console.log(friendsArr)
        console.log(res.data);
        let data = res.data.filter((el) => {
          if (el.user_id === user.user_id) {
            return;
          }
          for (let i = 0; i < user.friends.length; i++) {
            if (
              user.friends[i].accepted === true &&
              (user.friends[i].user_id === el.user_id ||
                user.friends[i].friend_id === el.user_id)
            ) {
              return el;
            }
          }
        });

        setFriends(data);
        setSearchFriends(data);
        axios
          .get("/users/get/all")
          .then((res) => {
            setAllUsers(res.data);
            setSearchPeople(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const handleSearchPeople = (e) => {
    let search = e.target.value.toUpperCase();
    let peopleSearch = [...allUsers];
    peopleSearch = peopleSearch.filter((p) =>
      p.username.toUpperCase().includes(search)
    );
    setSearchPeople(peopleSearch);
  };
  const handleSearchFriends = (e) => {
    let search = e.target.value.toUpperCase();
    let peopleSearch = [...friends];
    peopleSearch = peopleSearch.filter((p) =>
      p.username.toUpperCase().includes(search)
    );
    setSearchFriends(peopleSearch);
  };

  return (
    <div id="friendsPageContainer">
      <div id="friendsPageSearchContainer">
        <span>My Friends</span>
        <input
          className="sliderFriends"
          onChange={() => {
            setDiscoverPeople(!discoverPeople);
          }}
          type="checkbox"
          id="friendsSearch"
        />
        <label className="sliderLabelFriends" htmlFor="friendsSearch"></label>
        <span>Make Friends</span>
      </div>
      {discoverPeople ? (
        <div className="friendsPageFriendsContainer">
          <input
            placeholder="search all people.."
            onChange={handleSearchPeople}
          />
          <h2>{allUsers.length - friends.length} Friend Suggestions</h2>
          {searchPeople
            .filter((u) => {
              for (let i = 0; i < friends.length; i++) {
                if (friends[i].user_id === u.user_id) {
                  return;
                }
              }
              if (parseInt(u.user_id) === parseInt(user.user_id)) {
                return;
              }

              if (u.user_id === user.user_id) {
                return;
              }
              return u;
            })
            .map((u) => {
              let mutualFriends = [];
              for (let i = 0; i < user.friends.length; i++) {
                if (user.friends[i].accepted === true) {
                  for (
                    let j = 0;
                    j < user.friends[i].mutualFriends.length;
                    j++
                  ) {
                    if (
                      u.user_id === user.friends[i].mutualFriends[j].user_id
                    ) {
                      mutualFriends.push(user.friends[i].friendInfo);
                    }
                  }
                }
              }

              return (
                <div key={u.user_id} className="friendsPageFriendBox">
                  <Link to={`users/${u.user_id}`}>
                    <img className="profilePicLarge" src={u.picture} />
                  </Link>
                  <div>
                    <h2>{u.username}</h2>
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
                  </div>
                  <div>
                    <span>{mutualFriends.length} mutual friends</span>
                    <div>
                      {mutualFriends.map((e) => {
                        return (
                          <div>
                            <img src={e.picture} />
                            <span>{e.username}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="friendsPageFriendsContainer">
          {friends.length === 1 ? (
            <h1>1 Friend</h1>
          ) : (
            <h1>{friends.length} Friends</h1>
          )}
          <input
            placeholder="search friends.."
            onChange={handleSearchFriends}
          />
          {searchFriends.map((f) => {
            return (
              <div key={f.user_id} className="friendsPageFriendBox">
                <Link to={`/users/${f.user_id}`}>
                  <img className="profilePicLarge" src={f.picture} />
                </Link>
                <div>
                  <h2>{f.username}</h2>
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
                  </IconContext.Provider>
                </div>

                <div>
                  <span>email: {f.email}</span>
                  <Dms dmTo={f.user_id}/> 
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Friends;
