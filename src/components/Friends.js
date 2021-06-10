//list of friends
//includes username, email, picture, (gamesplayed? scheduled games)
//button to see page

//discover people
import { FaRegHandshake } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { dropDownDm, dmToRed } from "../redux/dmsReducer";
import { BiMessageDetail } from "react-icons/bi";
const Friends = (props) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [discoverPeople, setDiscoverPeople] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchPeople, setSearchPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchFriends, setSearchFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("/users/friends/all")
      .then((res) => {
        let data = res.data.filter((el) => {
          if (el.user_id === user.user_id) {
            return null;
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
          return null;
        });
        setLoading(false);
        setFriends(data);
        setSearchFriends(data);
        axios
          .get("/users/get/all")
          .then((res) => {
            
            setAllUsers(res.data);
            setSearchPeople(res.data);
            
          })
          .catch((err) => {
            console.log(err);
          });
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
          {loading ? (
            <div className="loadingBarContainer" id="friendsLoadingBarContainer">
              <div className="loadingBar" id="mapLoadingBar"></div>
              <span>..loading</span>
            </div>
          ) : (
            <h2>{allUsers.length - friends.length} Friend Suggestions</h2>
          )}

          {searchPeople
            .filter((u) => {
              for (let i = 0; i < friends.length; i++) {
                if (friends[i].user_id === u.user_id) {
                  return null;
                }
              }
              if (parseInt(u.user_id) === parseInt(user.user_id)) {
                return null;
              }

              if (u.user_id === user.user_id) {
                return null;
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
                    <img
                      alt={`friend profile ${u.username}`}
                      className="profilePicLarge"
                      src={u.picture}
                    />
                  </Link>
                  <div>
                    <h2
                      onClick={() => {
                        props.history.push(`users/${u.user_id}`);
                      }}
                    >
                      {u.username}
                    </h2>
                    <IconContext.Provider
                      value={{
                        style: {
                          height: "35px",
                          width: "35px",
                          color: "#D52217",
                        },
                      }}
                    >
                      <FaRegHandshake
                        onClick={() => {
                          props.history.push(`users/${u.user_id}`);
                        }}
                      />
                    </IconContext.Provider>
                  </div>
                  <div>
                    <span>{mutualFriends.length} mutual friends</span>
                    {mutualFriends.length === 0 ? null : (
                      <div>
                        {mutualFriends.map((e) => {
                          return (
                            <div>
                              <img alt={`${e.username}`} src={e.picture} />
                              <span>{e.username}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="friendsPageFriendsContainer">
          {loading ? (
            <div className="loadingBarContainer" id="friendsLoadingBarContainer">
              <div className="loadingBar" id="mapLoadingBar"></div>
              <span>..loading</span>
            </div>
          ) : (
            <h1>
              {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
            </h1>
          )}
          <input
            placeholder="search friends.."
            onChange={handleSearchFriends}
          />
          {searchFriends.map((f) => {
            return (
              <div key={f.user_id} className="friendsPageFriendBox">
                <Link to={`/users/${f.user_id}`}>
                  <img
                    alt={`${f.username}`}
                    className="profilePicLarge"
                    src={f.picture}
                  />
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

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100px"
                  }}
                >
                  <BiMessageDetail
                    size={40}
                    onClick={() => {
                      dispatch(dmToRed(f.user_id));
                      dispatch(dropDownDm(true));
                    }}
                  />
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
