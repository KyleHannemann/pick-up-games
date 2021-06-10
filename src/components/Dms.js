import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dmToRed, dropDownDm, dmSeen } from "../redux/dmsReducer";
import axios from "axios";
import { FiArrowUpCircle } from "react-icons/fi";
//i need dms in entire app

const Dms = (props) => {
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  const { dms, dmToState} = useSelector((store) => store.dmsReducer);
  const dispatch = useDispatch();
  const [dmTo, setDmTo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (dmToState === null) {
      //do something
      //show list of friends to dm or not
    }
    if (dmToState !== null) {
      setTimeout(() => {
        scrollDown();
      }, 300);
    }
    if (dmTo !== null) {
      axios
        .put("/users/dms/seen", { user_id: dmTo, dm_to: user.user_id })
        .then(() => {
          dispatch(dmSeen(user.user_id, dmTo));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setDmTo(dmToState);
    axios
      .put("/users/dms/seen", { user_id: dmToState, dm_to: user.user_id })
      .then(() => {
        dispatch(dmSeen(user.user_id, dmToState));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dmToState]);

  useEffect(() => {
    setTimeout(() => {
      scrollDown();
    }, 300);
  }, [dms]);

  const handleDm = (e) => {
    if(!socket){
      return
    }
    e.preventDefault();
    if (message === "") {
      return alert("enter a message to send");
    }
    if (dmTo === null) {
      return alert("select a friend to message");
    }
    socket.emit("dm", {
      user_id: user.user_id,
      dm_to: dmTo,
      content: message,
      timestamp: new Date(),
      seen: false,
    });
    setMessage("");
  };

  const scrollDown = () => {
    let chatBox = document.getElementById("dmsChatBoxChat");
    if (!chatBox) {
      return;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  return (
    <div id="dmsContainer">
      <div id="dmsChatBox">
        {dmTo
          ? user.friends.map((f) => {
              if (f.friendInfo.user_id === dmTo) {
                return (
                  <div key={f.friendInfo.picture}className="dmToUsername">
                    <img alt="friend profile"
                      className="chatProfilePicSmall"
                      src={f.friendInfo.picture}
                    />
                  </div>
                );
              }
            })
          : null}
        <div id="dmsChatBoxChat">
          {dms && dmTo !== null
            ? dms
                .filter((d) => {
                  if (d.user_id === dmTo || d.dm_to === dmTo) {
                    return d;
                  }
                  else return null
                })
                .sort((a, b) => {
                  if (new Date(a.timestamp) >= new Date(b.timestamp)) {
                    return 1;
                  } else return -1;
                })
                .map((d) => {
                  let asDate = new Date(d.timestamp);
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
                  let date = asDate
                    .toString()
                    .slice(0, asDate.toString().indexOf(":") - 2);
                  let readableTime = `${date} ${hours}:${minutes} ${amPm}`;
                  let classCss;
                  if (d.user_id === user.user_id) {
                    classCss = "rightChatBubble";
                  } else {
                    classCss = "leftChatBubble";
                  }
                  return (
                    <div key={d.timestamp} className={classCss}>
                      <div>
                        <div>{d.content}</div>
                        <span>{readableTime}</span>
                      </div>
                    </div>
                  );
                })
            : null}
          {user.friends.filter((f) => {
            if (f.accepted === true) {
              return f;
            }
            else return null
          }).length === 0 ? (
            <div style={{ color: "red" }}>Make some friends to DM!</div>
          ) : null}
        </div>

        <form>
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          
          <input type="submit" onClick={handleDm} style={{display: "none"}}/>
          <div id="dmSendInput">
          <FiArrowUpCircle
          type="submit"
            onMouseOver={(e)=>{
              document.getElementById("dmSendInput").classList.add("active")
            }}
            onMouseOut={(e)=>{
              document.getElementById("dmSendInput").classList.remove("active")

            }}
            size={28}
            style={{ color: "#5fbff9", backgroundColor:"#efe9f4", borderRadius:"50%" }}
            onClick={handleDm}
          />
          </div>
        </form>
      </div>
      <div id="dmsFriendsContainer">
       
        <button
          onClick={async () => {
            if (dmTo !== null) {
              await axios
                .put("/users/dms/seen", { user_id: dmTo, dm_to: user.user_id })
                .then(() => {
                  dispatch(dmSeen(user.user_id, dmTo));
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            dispatch(dmToRed(null));
            dispatch(dropDownDm(false));
          }}
        >
          &#x2715;
        </button>
        <div id="chatBoxFriendsTitle">
          <span style={{fontWeight: "500"}}>Friends</span>
        </div>
        <div id="dmsFriendsScroll">
        {user.friends
          .filter((f) => {
            if (f.accepted === true) {
              return f;
            }
            else return null
          })
          .map((f) => {
            let alerts = 0;
            for (let i = 0; i < dms.length; i++) {
              if (
                dms[i].user_id === f.friendInfo.user_id &&
                dms[i].seen === false &&
                f.friendInfo.user_id !== dmToState
              ) {
                alerts++;
              }
            }
            let highlight = "inherit";
            if (f.friendInfo.user_id === dmTo) {
              highlight = "#999a9b";
            }
            return (
              <div
                onClick={() => {
                  dispatch(dmToRed(f.friendInfo.user_id));
                  setMessage("");
                }}
                className="dmsFriend"
                style={{ backgroundColor: highlight }}
              >
                <img
                alt={`friend profile ${f.friendInfo.username}`}
                  className="profilePicExtraSmall"
                  src={f.friendInfo.picture}
                />
                <div>
                <span>{f.friendInfo.username}</span>
                {alerts > 0 ? (
                  <span className="dmFriendMessageAlerts" >{alerts}</span>
                ) : null}
                </div>
              </div>
            );
          })}
          </div>
      </div>
    </div>
  );
};

export default Dms;
