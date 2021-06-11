import routes from "./routes";
import "./App.css";
import Navbar from "./components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { setUser } from "./redux/authReducer";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import {setGamesRed} from './redux/joinedGamesReducer';
import {placeSocket} from './redux/socketReducer';
import {setDms, addDm} from "./redux/dmsReducer";
import {setNotifications, addNotification} from './redux/notificationsReducer'
//Get User INFO, FRIENDS, GAMES JOINED, SAVE TO STATE 
function App(props) {
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!user){
      return;
    }
    const getGamesAndPlayers = async () => {
      let allGames = await axios.get(`/game/joined/${user.user_id}`);
      dispatch(setGamesRed([...allGames.data]));
      let notifications = await axios.get(`/users/notifications/${user.user_id}`);
      dispatch(setNotifications(notifications.data))
      let dms = await axios.get(`/users/getdms/${user.user_id}`);
      dispatch(setDms(dms.data))
    };
    getGamesAndPlayers();
  }, [user]);

  useEffect(() => {
    if (!user){
      return
    }
    const sock = io.connect()
    setSocket(sock)
    dispatch(placeSocket(sock));
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [user]);
  
  useEffect(() => {
   if (!user){
     return 
   }
    if (socket) {
      socket.on("friend added", (body) => {
        if (parseInt(body.friend_id) === parseInt(user.user_id) ||
        parseInt(body.user_id) === parseInt(user.user_id)){
          axios.get("/auth/user").then(res=>{
            dispatch(setUser(res.data))
          }).catch(err=>{
            console.log(err)
          })
        };
      });
      socket.on("friend accept", (body) => {
        if (parseInt(body.friend_id) === parseInt(user.user_id) ||
        parseInt(body.user_id) === parseInt(user.user_id)){
          axios.get("/auth/user").then(res=>{
            dispatch(setUser(res.data))
          }).catch(err=>{
            console.log(err)
          })
        };
      });
      socket.on('notification', (body) => {
        console.log(body)
        if (parseInt(body[0].user_id) === parseInt(user.user_id)){
          dispatch(addNotification(body[0]))
        }
      })

      socket.on("newDm", (body) => {
        if (parseInt(body.user_id) === parseInt(user.user_id) || parseInt(body.dm_to) === parseInt(user.user_id)){
          dispatch(addDm(body))
         
        }
      })

    }
  }, [socket]);

  const history = useHistory();
  useEffect(() => {
    axios
      .get("/auth/user")
      .then((res) => {
        if (res.status === 200) {
          props.setUser(res.data);
          console.log("user", res.data)
          console.log(history)
          history.push('/dash')
          return;
        } else {
          console.log("no user");
          history.push("/");
          return;
        }
      })
      .catch((err) => {
        history.push("/");
      });
  }, []);
  return (
    
    <div className="App">
      <Navbar />
      {routes}
    </div>
  );
}

export default connect(null, { setUser })(App);
