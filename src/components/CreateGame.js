import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Map from "./Map";
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
  const [maxPlayers, setMaxPlayers] = useState("");

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
    };
    console.log(createdGame);
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
          Location
        </span>
        <span className="createGameStatusBarItems" id="createGameStatusBar3">
          Invites
        </span>
        <button
          onClick={() => {
            if (status === 3) {
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
        <div>
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
            <p></p>
          )}
          <div id="createGame">
            <form>
              <div>Title</div>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                type="text"
              />
              <div>Description</div>
              <input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <div>Date</div>
              <DatePicker
                value={date}
                onChange={(e) => {
                  setDate(e);
                }}
              />
              <div>Time</div>
              <TimePicker
                disableClock={true}
                value={time}
                onChange={(e) => {
                  setTime(e);
                }}
              />
              <div>Maximun Number of Players</div>
              <select
                onChange={(e) => {
                  setMaxPlayers(e.target.value);
                }}
              >
                <option>choose #</option>
                <option value="unlimited">unlimited</option>
                {maxPlayersSelect.map((el) => {
                  return (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  );
                })}
              </select>
              <div>Game Icon</div>
              <img className="createGameIconPreview" src={icon} />
              <div>
                <button
                  onClick={() => {
                    setSelectingIcon(true);
                  }}
                >
                  Change Icon
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {status === 2 ? (
        <div>
          <div id="createGameMapContainer">
            <Map createGame={true} height={"100%"} width={"100%"} />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {status === 3 ? (
        <div>
          {" "}
          <div>
            <button>Invite Friends</button>
          </div>
          <div>list of invited friends scrollable</div>
          <div>Make Public</div>
          <input
            onChange={() => {
              setPublicGame(!publicGame);
            }}
            type="checkbox"
            id="switch"
          />
          <label htmlFor="switch"></label>
          <button onClick={handleSubmit}>CREATE</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default CreateGame;
