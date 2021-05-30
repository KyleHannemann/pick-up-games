import { useState } from "react";
import { useSelector } from "react-redux";
import Map from "./Map";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
const reqSvgs = require.context("../imgs", true, /\.svg$/);
const paths = reqSvgs.keys();
const svg = paths.map((path) => reqSvgs(path));

const CreateGame = () => {
  const [selectingIcon, setSelectingIcon] = useState(false);
  const { location } = useSelector((store) => store.createGameReducer);
  //status bar
  const [status, setStatus] = useState(1);
  //game details
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(svg[0].default);
  const [publicGame, setPublicGame] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(1000);
  const [gender, setGender] = useState("coed");

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
      date: date,
      time: time,
      description: description,
      maxPlayers: maxPlayers,
      gender: gender,
      location: location,
    };
    // for (let el in createdGame) {
    //   if (createdGame[el] === "") {
    //     alert("please fill out all game details");
    //     return;
    //   }
    // }

    axios
      .post("/game/create", createdGame)
      .then((res) => {
        console.log(res);
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
        <button
          onClick={() => {
            if (status === 1) {
              return;
            }

            setStatus(status - 1);
            let items = document.querySelectorAll(".createGameStatusBarItems");
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
        <span
          className="createGameStatusBarItems active"
          id="createGameStatusBar1"
        >
          Details
        </span>
        <span className="createGameStatusBarItems" id="createGameStatusBar2">
          Date/Time
        </span>
        <span className="createGameStatusBarItems" id="createGameStatusBar3">
          Location
        </span>
        <span className="createGameStatusBarItems" id="createGameStatusBar4">
          Invites
        </span>
        <button
          onClick={() => {
            if (status === 4) {
              return;
            }
            setStatus(status + 1);
            let items = document.querySelectorAll(".createGameStatusBarItems");
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
            <p style={{display:"none"}}></p>
          )}
          
            <div>
              <div>Title</div>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                type="text"
              />
              </div>
              <div>
              <div>Description</div>
              <input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              </div>
              <div>
              <div>Maximun Number of Players</div>
              <select
                onChange={(e) => {
                  setMaxPlayers(e.target.value);
                }}
              >
                <option>choose #</option>
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
              <div>Game Icon</div>
              <img className="createGameIconPreview" src={icon} />
              
                <button
                  onClick={() => {
                    setSelectingIcon(true);
                  }}
                >
                  Change Icon
                </button>
              </div>
           
        </div>
      ) : (
        <div></div>
      )}
      {status === 2 ? (
        <div className="createGameFormContainer">
  
          <div>Time</div>
          <TimePicker
            disableClock={true}
            value={time}
            onChange={(e) => {
              setTime(e);
            }}
          />
          <div>
          <div>Date</div>
          <DatePicker
            value={date}
            onChange={(e) => {
              setDate(e);
            }}
          />
          </div>
          <div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {status === 3 ? (
        <div>
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
          
            <button>Invite Friends</button>
          
          <div>list of invited friends scrollable</div>
          </div>
          <div>
          <div>Gender</div>
          <select
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option value="coed">Coed</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
          </div>
          <div>
          <div>Make Public</div>
          <input className="slider"
            onChange={() => {
              setPublicGame(!publicGame);
            }}
            type="checkbox"
            id="switch"
          />
          <label className="sliderLabel"htmlFor="switch"></label>
          </div>
          <div>
          <button onClick={handleSubmit}>CREATE</button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default CreateGame;
