import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/authReducer";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState } from "react";
import { IconContext } from "react-icons";
import {removeNotification} from '../redux/notificationsReducer';

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { notifications } = useSelector((store) => store.notificationReducer);
  console.log(notifications);
  const [notiDropDown, setNotiDropDown] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const logout = () => {
    axios.get("/auth/logout").then((res) => {
      if (res.status === 200) {
        if (navDrop === false) {
          dispatch(setUser(null));
          history.push("/");
          return;
        }
        navDropDown();
        dispatch(setUser(null));
        history.push("/");
      }
    });
  };
  
  const [navDrop, setNavDrop] = useState(false);
  //change to conditional rendering
  const navDropDown = () => {
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
  const linkClick = () => {
    if (navDrop === false) {
      return;
    }
    navDropDown();
  };

  const handleNotificationRemoval = (e) =>{
      console.log(e.target.value)
     setNotiDropDown(false)
    dispatch(removeNotification(parseInt(e.target.value)));
    axios.delete(`/users/notifications/delete/${e.target.value}`).then(res=>{
      console.log(res)
    }).catch(err=>console.log(err))
  }
  return (
    <div>
      {user ? (
        <div id="navBar">
          {notifications?  notifications.length < 1? <div id="websiteLogoName">
              <IconContext.Provider
                value={{ style: { height: "35px", width: "35px" } }}
              >
                <IoIosNotificationsOutline />
              </IconContext.Provider>
            </div> : (
            <div id="websiteLogoName" onClick={()=>{
                setNotiDropDown(true)
            }}>
              <IconContext.Provider
                value={{
                  style: { color: "red", height: "35px", width: "35px" },
                }}
              >
                <IoIosNotificationsOutline />
              </IconContext.Provider>
              <span id="notificationsAlerts">{notifications.length}</span>
            </div>
          ) : (
            <div id="websiteLogoName">
              <IconContext.Provider
                value={{ style: { height: "35px", width: "35px" } }}
              >
                <IoIosNotificationsOutline />
              </IconContext.Provider>
            </div>
          )}

          <div
            onClick={() => {
              history.push(`/users/${user.user_id}`);
            }}
            id="navBarUserInfo"
          >
            <img className="profilePicMedium" src={user.picture} />
            <div>{user.username}</div>
          </div>
          <div id="navBarPageLinks">
            <Link className="navBarLink" onClick={linkClick} to="/dash">
              <div>Home</div>
            </Link>
            
            <Link onClick={linkClick} className="navBarLink" to="/friends">
              <div>Friends</div>
            </Link>
            <Link onClick={linkClick} className="navBarLink" to="/create/game">
              <div>Create Game</div>
            </Link>

            <Link onClick={linkClick} className="navBarLink" to="/map">
              <div>Discover Games</div>
            </Link>
          </div>
          <div id="navBarAuthLinks">
            <Link className="navBarLink" onClick={linkClick} to="/edit/profile">
              <div>Edit Profile</div>
            </Link>
            <div id="logout" onClick={logout}>
              Logout
            </div>
          </div>
          <GiHamburgerMenu onClick={navDropDown} id="navHamburger" />
        </div>
      ) : (
        <div></div>
      )}
      {notiDropDown? <div id="notiDropDown">
        
          <button onClick={()=>{
              setNotiDropDown(false)
          }}>X</button>
          {notifications ? notifications.map(n=>{
              return(
                  <div key={n.notification_id}>
                      <img className="profilePicSmall" src={n.user_interaction_picture}></img>
                      <span>{n.user_interaction_username + " " + n.description}</span>
                      {n.description === "invited you to a game" ? 
                      <Link to={`/game/${n.game_id}`}>
                      <button  value={n.notification_id} onClick={handleNotificationRemoval}>view</button>
                      </Link> : <Link to={`/users/${n.user_interaction_id}`}>
                      <button  value={n.notification_id} onClick={handleNotificationRemoval}>view</button>
                      </Link>}
                  </div>
              )
          }): <div>
              you have 0 notifications</div>}
          
      </div> : null}
    </div>
  );
};
export default Navbar;
