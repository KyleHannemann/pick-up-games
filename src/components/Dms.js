import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dmToRed, dropDownDm, dmSeen } from "../redux/dmsReducer";
import axios from "axios";

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
    if (dmToState !== null){
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
  }, []);


  const handleDm = (e) => {
    e.preventDefault();
    if (message === "") {
      return alert("enter a message to send");
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
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  return (
    <div id="dmsContainer">
      <div id="dmsChatBox">
        {dmTo
          ? user.friends.map((f) => {
              if (f.friendInfo.user_id === dmTo) {
                return (
                  <div className="dmToUsername">{f.friendInfo.username}</div>
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
                .map((d) => {
                  let classCss;
                  if (d.user_id === user.user_id) {
                    classCss = "rightChatBubble";
                  } else {
                    classCss = "leftChatBubble";
                  }
                  return (
                    <div className={classCss}>
                      <div>{d.content}</div>
                    </div>
                  );
                })
            : null}
        </div>
        {dmTo ? (
          <form>
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <input type="submit" value="send" onClick={handleDm} />
          </form>
        ) : null}
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
              highlight = "rgb(133, 212, 133)";
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
                {alerts > 0 ? <span>{alerts}</span> : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dms;
