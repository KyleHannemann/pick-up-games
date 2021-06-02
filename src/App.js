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
import {updateFriends} from './redux/authReducer';
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
      
    };
    getGamesAndPlayers();
  }, [user]);
  useEffect(() => {
    if (!user){
      return
    }
    //setSocket(io.connect("", {username: 'kyle'}))
    setSocket(io.connect());
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [user]);
  useEffect(() => {
   
    if (socket) {
      socket.on("friend added", (body) => {
        console.log(body)
        if (parseInt(body.friend_id) === parseInt(user.user_id)){
          console.log(body)
          dispatch(updateFriends(body))
        };
      });
      socket.on("friend accept", (body) => {
        console.log(body)
        if (parseInt(body.user_id) === parseInt(user.user_id)){
          console.log(body)
          dispatch(updateFriends(body))
        };
      });
    }
  }, [socket]);

  const history = useHistory();
  useEffect(() => {
    console.log("check");
    axios
      .get("/auth/user")
      .then((res) => {
        if (res.status === 200) {
          props.setUser(res.data);
          console.log("user");
          //history.push('/dash')
          return;
        } else {
          console.log("no user");
          history.push("/");
          return;
        }
      })
      .catch((err) => {
        console.log("error on user find");
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
