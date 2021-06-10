import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/authReducer";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState } from "react";
import { IconContext } from "react-icons";
import { removeNotification } from "../redux/notificationsReducer";
import Dms from "./Dms";
import { dropDownDm, dmToRed } from "../redux/dmsReducer";
import {AiOutlineCalendar} from "react-icons/ai";
import {RiTeamLine} from 'react-icons/ri';
import {BsFilePlus} from 'react-icons/bs';
import {BiMap} from 'react-icons/bi';
import {BsChatDots} from 'react-icons/bs'

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { notifications } = useSelector((store) => store.notificationReducer);
  const { dmDrop, dms, dmToState } = useSelector((store) => store.dmsReducer);
  const [notiDropDown, setNotiDropDown] = useState(false);
  const [dmAlert, setDmAlert] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!dms) {
      return;
    }
    if (!user){
      return;
    }
    let alert = [];
    const checkDmsForSeen = () => {
      for (let i = 0; i < dms.length; i++) {
        if (dmToState === parseInt(dms[i].user_id)) {
          axios
            .put("/users/dms/seen", { user_id: dmToState, dm_to: user.user_id })
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        } else if (dms[i].dm_to === user.user_id && dms[i].seen === false) {
          alert.push(dms[i]);
        }
      }
      setDmAlert(alert);
    };
    checkDmsForSeen();
  }, [dms, dmToState, user]);
  const logout = async () => {
     await axios.get("/auth/logout").then((res) => {
      if (res.status === 200) {
        if (navDrop === false) {
          history.push("/");
          dispatch(setUser(null));
          return;
        }
        navDropDown();
        history.push("/");
        dispatch(setUser(null));
      }
    });
  };

  const [navDrop, setNavDrop] = useState(false);
  //change to conditional rendering
  const navDropDown = () => {
    if(!user){
      return
    }
    let checkForDomElements = {w: null, x: null, y: null, z : null}  
    checkForDomElements.w = document.getElementById("navBar")
    checkForDomElements.x = document.getElementById("navBarPageLinks")
    checkForDomElements.y = document.getElementById("navBarAuthLinks")
    checkForDomElements.z = document.getElementById("navHamburger")
    if (!checkForDomElements.w || !checkForDomElements.x || !checkForDomElements.y || !checkForDomElements.z){
      return;
    }
    if (navDrop === false) {
      document.getElementById("navBar").classList.add("active");
      document.getElementById("navBarPageLinks").classList.add("active");
      document.getElementById("navBarAuthLinks").classList.add("active");
      document.getElementById("navHamburger").classList.add("active");
      setNavDrop(true);
    } else {
      document.getElementById("navBarPageLinks").classList.remove("active");
      document.getElementById("navBarAuthLinks").classList.remove("active");
      document.getElementById("navHamburger").classList.remove("active");
      document.getElementById("navBar").classList.remove("active");

      setNavDrop(false);
    }
  };
  const linkClick = (e) => {
    console.log(e.target)
    document.getElementById("navBarUserName").style.color = "white";

    let links = Array.from(document.querySelectorAll(".navBarLink > div"));
    for (let i = 0; i < links.length; i++) {
      if (e.target === links[i]){
        e.target.style.color = "#5fbff9";
      }
      else{
      links[i].style.color = "white";
      }
    }
  
    if (navDrop === false) {
      return;
    }
    navDropDown();
  };

  const handleNotificationRemoval = (e) => {
    if (e.target.dataset.id === "view") {
      setNotiDropDown(false);
    }
    dispatch(removeNotification(parseInt(e.target.value)));
    axios
      .delete(`/users/notifications/delete/${e.target.value}`)
      .then((res) => {
        console.log(res);
        if (notifications.length < 2){
          setNotiDropDown(false);

        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      {user ? (
        <div id="navBar">
          {dmDrop ? <Dms /> : null}

          {notifications ? (
            notifications.length < 1 ? (
              <div
                onClick={() => {
                  setNotiDropDown(true);
                }}
                id="websiteLogoName"
              >
                <IconContext.Provider
                  value={{ style: { height: "30px", width: "30px" } }}
                >
                  <IoIosNotificationsOutline />
                </IconContext.Provider>
              </div>
            ) : (
              <div
                id="websiteLogoName"
                className="notiAnimation"
                onClick={() => {
                  setNotiDropDown(true);
                }}
              >
                <IconContext.Provider
                  value={{
                    style: { color: "red" },
                  }}
                >
                  <IoIosNotificationsOutline size={28} />
                </IconContext.Provider>
                <span id="notificationsAlerts">{notifications.length}</span>
              </div>
            )
          ) : (
            <div
              id="websiteLogoName"
              onClick={() => {
                setNotiDropDown(true);
              }}
            >
              <IconContext.Provider
                value={{}}
              >
                <IoIosNotificationsOutline size={28}/>
              </IconContext.Provider>
            </div>
          )}

          <div
            onClick={() => {
              let links = Array.from(
                document.querySelectorAll(".navBarLink > div")
              );
              for (let i = 0; i < links.length; i++) {
                links[i].style.color = "white";
              }
              document.getElementById("navBarUserName").style.color = "#5fbff9";

              history.push(`/users/${user.user_id}`);
              if (navDrop === false) {
                return;
              }
              navDropDown();
            }}
            id="navBarUserInfo"
          >
            <img className="profilePicMedium"
            alt={user.username}
             src={user.picture} />
            <div id="navBarUserName">{user.username}</div>
          </div>
          <div id="navBarPageLinks">
            <Link className="navBarLink" onClick={linkClick} to="/dash">
              
              <div>My Games <AiOutlineCalendar size={22}/></div>
            </Link>

            <Link onClick={linkClick} className="navBarLink" to="/friends">
              <div>Friends <RiTeamLine size={22}/></div>
            </Link>
            <Link onClick={linkClick} className="navBarLink" to="/create/game">
              <div>Start A Game<BsFilePlus size={22}/></div>
            </Link>

            <Link onClick={linkClick} className="navBarLink" to="/map">
              <div>Public Games<BiMap size={22}/></div>
            </Link>
          </div>
          <div id="navBarAuthLinks">
            <div>
              <a className="navBarLink"
              
              onClick={()=>{
                dispatch(dropDownDm(true))
                dispatch(dmToRed(null))
                navDropDown()}}>
                <div>
                {dmAlert.length > 0 ? (
                  <IconContext.Provider
                    value={{ height: "30px", width: "30px", color: "red" }}
                  >
                    <BsChatDots id="navbarDmLink" size={22} onClick={()=>{
                      dispatch(dropDownDm(true))
                      dispatch(dmToRed(null))
                     
                    }} />
                  </IconContext.Provider>
                ) : (
                  <IconContext.Provider
                    value={{ height: "30px", width: "30px", color: "white" }}
                  >
                    <BsChatDots size={22} 
                    />
                  </IconContext.Provider>
                  
                )}
                </div>

                {dmAlert.length > 0 ? <span>{dmAlert.length}</span> : null}
              </a>
            </div>
            <div id="logout" onClick={logout}>
              Logout
            </div>
          </div>
          <GiHamburgerMenu onClick={navDropDown} id="navHamburger" />
        </div>
      ) : (
        <div></div>
      )}
      {notiDropDown ? (
        <div id="notiDropDown">
          <button
            onClick={async () => {
              await document
                .getElementById("notiDropDown")
                .classList.add("notiExit");
              setTimeout(async () => {
                await document
                  .getElementById("notiDropDown")
                  .classList.remove("notiExit");
                setNotiDropDown(false);
              }, 1000);
            }}
          >
            &#x2715;
          </button>
          {notifications ? (
            notifications.map((n) => {
              return (
                <div key={n.notification_id}>
                  <img
                    alt={n.user_interaction_username}
                    className="profilePicSmall"
                    src={n.user_interaction_picture}
                  ></img>
                  <span>
                    {n.user_interaction_username + " " + n.description}
                  </span>
                  {n.description === "invited you to a game" ? (
                    <div className="notiDropDownButtons">
                      <Link to={`/game/${n.game_id}`}>
                        <button
                          data-id="view"
                          value={n.notification_id}
                          onClick={handleNotificationRemoval}
                        >
                          view
                        </button>
                      </Link>
                      <button
                        data-id="delete"
                        onClick={handleNotificationRemoval}
                        value={n.notification_id}
                      >
                        &#x2715;
                      </button>
                    </div>
                  ) : (
                    <div className="notiDropDownButtons">
                      <Link to={`/users/${n.user_interaction_id}`}>
                        <button
                          data-id="view"
                          value={n.notification_id}
                          onClick={handleNotificationRemoval}
                        >
                          view
                        </button>
                      </Link>
                      <button
                        data-id="delete"
                        onClick={handleNotificationRemoval}
                        value={n.notification_id}
                      >
                        &#x2715;
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div>you have 0 notifications</div>
          )}
        </div>
      ) : null}
    </div>
  );
};
export default Navbar;
