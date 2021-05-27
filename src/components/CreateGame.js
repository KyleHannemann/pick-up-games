import { useState, useEffect } from "react";
import Map from "./Map";

const CreateGame = () => {
  return (
    <div>
      <div id="createGame">
        <h2>Create Game</h2>
        <form>
          <div>Title</div>
          <input type="text" />
          <div>Description</div>
          <input type="text" />
          <div>Maximun Number of Players</div>
          <select>
            <option>choose #</option>
          </select>
          <div>Game Icon</div>
          <select>
            <option></option>
          </select>
          <div>Invite Friends</div>
          <input />
          <div>list of invited friends scrollable</div>
          <div>Make Public</div>
          <input type="checkbox" id="switch" /><label for="switch"></label>
        </form>
      </div>
      <div id="createGameMapContainer">
        <Map height={"100%"} width={"100%"} />
      </div>
    </div>
  );
};
export default CreateGame;
