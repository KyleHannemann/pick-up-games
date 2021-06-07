import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Map from "./Map";
import axios from "axios";
import {addGamesRed} from "../redux/joinedGamesReducer";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {Link} from 'react-router-dom';
const reqSvgs = require.context("../imgs", true, /\.svg$/);
const paths = reqSvgs.keys();
const svg = paths.map((path) => reqSvgs(path));


const CreateGame = (props) => {
  const [selectingIcon, setSelectingIcon] = useState(false);
  const { location } = useSelector((store) => store.createGameReducer);
  const {user} = useSelector((store)=>store.auth);
  const {socket} = useSelector((store)=>store.socketReducer);
  const dispatch = useDispatch()
  if(!user){
    props.history.push('/')
  }
  //status bar
  const [status, setStatus] = useState(1);
  const [friends, setFriends] = useState([])
  //game details
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(svg[0].default);
  const [publicGame, setPublicGame] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(1000);
  const [gender, setGender] = useState("Coed");
  const [invites, setInvites] = useState([])

  const [success, setSuccess] = useState(false)
  const [createdGameId, setCreatedGameId] = useState(null)
  const updateInvites = (e) => {
    console.log(e.target.checked)
    if (e.target.checked === true){
    console.log(e.target.value)
    setInvites([...invites, e.target.value])
    }
    else{
      let newInvites = invites.filter(el=>el !== e.target.value)
      setInvites(newInvites)
    }
  }
  useEffect(()=>{
    axios.get("/users/friends/all").then(res=>{
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
      let data = res.data.filter(el=>el.user_id !== user.user_id)
      
      setFriends(data)
      console.log(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }, [])
  const handleIconChange = (e) => {
    e.preventDefault();
    setIcon(e.target.dataset.id);
    setSelectingIcon(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const createdGame = {
      title: title,
      icon: icon,
      public: publicGame,
      date: "" + date,
      time: time,
      description: description,
      maxPlayers: maxPlayers,
      gender: gender,
      location: location,
    };
    for (let el in createdGame) {
      if (createdGame[el] === "" || createdGame[el] === null) {
        alert("please fill out all game details");
        return;
      }
    }

    axios
      .post("/game/create", createdGame)
      .then((res) => {
        console.log(res);
        dispatch(addGamesRed(res.data));
        setSuccess(true)
        setCreatedGameId(res.data.game_id)
        let finalInvites;
    if (invites.includes('all') === true){
      finalInvites = friends.map(el=>{
        return el.user_id
      })
    }
    else{
      finalInvites = invites;
    }
    socket.emit('invites', {invites: finalInvites, game_id: res.data.game_id, 
      username: user.username, user_id: user.user_id, picture: user.picture})
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const maxPlayersSelect = [];
  for (let i = 0; i < 20; i++) {
    maxPlayersSelect.push(i);
  }
  ///use a status bar for creating game
  return (
    <div id="createGameContainer">
      <h3>Create Game</h3>
      <div id="createGameStatusBar">
        <span
          className="createGameStatusBarItems active"
          id="createGameStatusBar1"
          onClick={() => {
            setStatus(1);
            let items = document.querySelectorAll(".createGameStatusBarItems");
            for (let i = 0; i < items.length; i++) {
              items[i].classList.remove("active");
            }
            document
              .getElementById(`createGameStatusBar1`)
              .classList.add("active");
          }}
        >
          <span>Details</span>
        </span>
        <span
          onClick={() => {
            setStatus(2);
            let items = document.querySelectorAll(".createGameStatusBarItems");
            for (let i = 0; i < items.length; i++) {
              items[i].classList.remove("active");
            }
            document
              .getElementById(`createGameStatusBar2`)
              .classList.add("active");
          }}
          className="createGameStatusBarItems"
          id="createGameStatusBar2"
        >
          <span>Date/Time</span>
        </span>
        <span
          onClick={() => {
            setStatus(3);
            let items = document.querySelectorAll(".createGameStatusBarItems");
            for (let i = 0; i < items.length; i++) {
              items[i].classList.remove("active");
            }
            document
              .getElementById(`createGameStatusBar3`)
              .classList.add("active");
          }}
          className="createGameStatusBarItems"
          id="createGameStatusBar3"
        >
          <span>Location</span>
        </span>
        <span
          onClick={() => {
            setStatus(4);
            let items = document.querySelectorAll(".createGameStatusBarItems");
            for (let i = 0; i < items.length; i++) {
              items[i].classList.remove("active");
            }
            document
              .getElementById(`createGameStatusBar4`)
              .classList.add("active");
          }}
          className="createGameStatusBarItems"
          id="createGameStatusBar4"
        >
          <span>Invites</span>
        </span>
        <span
          onClick={() => {
            setStatus(5);
            let items = document.querySelectorAll(".createGameStatusBarItems");
            for (let i = 0; i < items.length; i++) {
              items[i].classList.remove("active");
            }
            document
              .getElementById(`createGameStatusBar5`)
              .classList.add("active");
          }}
          className="createGameStatusBarItems"
          id="createGameStatusBar5"
        >
          <span> Review/Submit </span>
        </span>
      </div>
      <div>
        <div className="createGameStatusBarButtons">
          {status === 1 ? (
            <p></p>
          ) : (
            <button
              onClick={() => {
                if (status === 1) {
                  return;
                }

                setStatus(status - 1);
                let items = document.querySelectorAll(
                  ".createGameStatusBarItems"
                );
                for (let i = 0; i < items.length; i++) {
                  items[i].classList.remove("active");
                }
                document
                  .getElementById(`createGameStatusBar${status - 1 + ""}`)
                  .classList.add("active");
              }}
            >
              ❮
            </button>
          )}

          {status === 5 ? (
            <p></p>
          ) : (
            <button
              onClick={() => {
                if (status === 5) {
                  return;
                }
                setStatus(status + 1);
                let items = document.querySelectorAll(
                  ".createGameStatusBarItems"
                );
                for (let i = 0; i < items.length; i++) {
                  items[i].classList.remove("active");
                }
                document
                  .getElementById(`createGameStatusBar${status + 1 + ""}`)
                  .classList.add("active");
              }}
            >
              ❯
            </button>
          )}
        </div>
        {status === 1 ? (
          <div className="createGameFormContainer">
            {selectingIcon ? (
              <div id="createGameIconSelection">
                {svg.map((el) => {
                  return (
                    <img
                      key={el.default}
                      data-id={el.default}
                      onClick={handleIconChange}
                      className="createGameIconPreview"
                      src={el.default}
                    />
                  );
                })}
              </div>
            ) : (
              <p style={{ display: "none" }}></p>
            )}

            <div>
              <div>Title</div>
              <input
              maxLength="18"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                type="text"
              />
            </div>
            <div>
              <div>Description</div>
              <textarea id="createGameFormDescription"
              maxLength="100"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div>
              <div>Player Limit</div>
              <select
                onChange={(e) => {
                  setMaxPlayers(e.target.value);
                }}
              >
                <option value={1000}>unlimited</option>
                {maxPlayersSelect.map((el) => {
                  return (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <div>Game Type</div>
              <img className="createGameIconPreview" src={icon} />

              <button
                onClick={() => {
                  setSelectingIcon(true);
                }}
              >
                Change Game Type
              </button>
            </div>
          </div>
        ) : null}
        {status === 2 ? (
          <div className="createGameFormContainer">
            <div>
              <div>Date</div>
              <div style={{ backgroundColor: "white" }}>
                <DatePicker
                
                  value={date}
                  onChange={(e) => {
                    setDate(e);
                  }}
                />
              </div>
            </div>
            <div>
              <div>Time</div>
              <div style={{ backgroundColor: "white" }}>
                <TimePicker
                  disableClock={true}
                  value={time}
                  onChange={(e) => {
                    setTime(e);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
        {status === 3 ? (
          <div>
            <h2 id="createGameMapHint">
              
              * Click Location To Set Game
            </h2>
            <div id="createGameMapContainer">
              <Map createGame={true} height={"100%"} width={"100%"} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {status === 4 ? (
          <div className="createGameFormContainer">
            <div>
            <div>Invite Friends</div>
            <span>{invites.includes('all') === true? "All" : invites.length}</span>
            <div id="createGameSelectInvitesContainer">
              <div>
              <input value="all" onChange={updateInvites} type="checkbox"/>
              <div>Invite all</div>
              <span></span></div>
              {friends.map(f=>{
                return(
                  <div>
                    <input value={f.user_id} onChange={updateInvites} type="checkbox"/>
                    <span>{f.username}</span>
                    <img className="profilePicSmall"src={f.picture}/>
                  </div>
                )
              })}
            </div>
            </div>
            <div>
            <div>Public <span style={{fontSize: "10px"}}>*anyone can join</span></div>

              <input
                className="slider"
                onClick={() => {
                  setPublicGame(!publicGame);
                }}
                checked={publicGame}
                type="checkbox"
                id="switch"
              />
              <label className="sliderLabel" htmlFor="switch"></label>

            </div>
           </div>
        ) : null}

        {status === 5 ? (
          
          <div className="createGameReviewContainer">
            {success ?  <div id="createGameSuccessBox">
             <div><Link to={`/game/${createdGameId}`}><button>View Game Page</button></Link></div>
              <h1>Game Successfully Created!</h1>
            </div> : null}
            <button id="createGameCreateButton" onClick={handleSubmit}>
              Create
            </button>
            <img className="createGameIconPreview" src={icon} />

            <h1 style={{ margin: "0px" }}>
              {title ? (
                title
              ) : (
                <span
                  style={{
                    color: "red",
                    fontSize: "18px",
                    borderBottom: "1px solid red",
                  }}
                >
                  * Please enter title
                </span>
              )}
            </h1>
            <p>{description ? description : null}</p>
            <div>
              <span>Date: </span>
              <DatePicker
                value={date}
                disabled={true}
                calendarIcon={false}
                clearIcon={false}
              />
            </div>
            <div>
              <span>Time: </span>
              <TimePicker
                value={time}
                disabled={true}
                clockIcon={false}
                clearIcon={false}
              />
            </div>
            <div>
              Max Players: {maxPlayers === 1000 ? "Unlimited" : maxPlayers}
            </div>
            <div>{publicGame ? "Public Game *anyone can join" : "Private Game *only your friends can join"}</div>
            <div>
              {location ? (
                location.addy
              ) : (
                <span style={{ color: "red", borderBottom: "1px solid red" }}>
                  * Location not set
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default CreateGame;

// const [title, setTitle] = useState("");
// const [icon, setIcon] = useState(svg[0].default);
// const [publicGame, setPublicGame] = useState(false);
// const [date, setDate] = useState(new Date());
// const [time, setTime] = useState("12:00");
// const [description, setDescription] = useState("");
// const [maxPlayers, setMaxPlayers] = useState(1000);
// const [gender, setGender] = useState("coed");
