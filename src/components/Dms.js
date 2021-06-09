import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dmToRed, dropDownDm, dmSeen } from "../redux/dmsReducer";
import axios from "axios";
import { FiArrowUpCircle } from "react-icons/fi";
import userPic from "../miscImgs/user.svg";
//i need dms in entire app

const Dms = (props) => {
  const { socket } = useSelector((store) => store.socketReducer);
  const { user } = useSelector((store) => store.auth);
  const { dms, dmToState, dmDrop } = useSelector((store) => store.dmsReducer);
  const dispatch = useDispatch();
  console.log(dms, dmToState, dmDrop);
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
    console.log("yooo");
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
                  <div className="dmToUsername">
                    <img
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
                  //check if applies to this user
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
                    <div className={classCss}>
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

          <FiArrowUpCircle
            onMouseOver={(e)=>{
              e.target.style.backgroundColor = "white"
            }}
            onMouseOut={(e)=>{
              e.target.style.backgroundColor = "black"
            }}
            size={28}
            style={{ color: "white", backgroundColor:"black", borderRadius:"50%" }}
            onClick={handleDm}
          />
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
          <span>Dm Friends</span>
        </div>
        {user.friends
          .filter((f) => {
            if (f.accepted === true) {
              return f;
            }
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
                  className="profilePicExtraSmall"
                  src={f.friendInfo.picture}
                />
                <span>{f.friendInfo.username}</span>
                {alerts > 0 ? (
                  <span style={{ color: "red" }}>{alerts}</span>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dms;
