import {useEffect, useState} from 'react';
import axios from 'axios';
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {useSelector} from 'react-redux';


const Game =  (props) => {
    const [game, setGame] = useState(null)
    const {user} = useSelector((store)=>store.auth)
    const [joined, setJoined] = useState(false)

    useEffect(() => {
        const getGameAndPlayers = async () => {
          let thisGame = await axios.get(`/game/${props.match.params.gameId}`);
            let players = await axios.get(
              `/game/players/${props.match.params.gameId}`)
            
            thisGame.data.players = players.data;
            for (let i = 0; i < players.data.length; i++){
              if (parseInt(players.data[i].user_id) === user.user_id){
                setJoined(true);
              }
            }
          
          console.log(thisGame.data);
          setGame(thisGame.data);
  
        };
        getGameAndPlayers();
      }, []);

      return (<div id="gamePageContainer">
        {game? <div id="gamePageGameContainer">
          <div>
          <h1>{game[0].title}</h1>
          <p>{game[0].description}</p>
          </div>
          <div>
            <DatePicker disabled={true} value={game[0].date}/>
            <TimePicker disabled={true} value={game[0].time}/>
          </div>
          <div>
            {game.players.map(player=>{
              return(
                <div className="indDashGamePlayer">
                <div>{player.username}</div>
                <img src={player.picture}/>
                </div>
              )
            })}
            {joined? <div>
              <button>leave game</button>
            </div>: <div>
              <button>join game</button>
              </div>}
          </div>
        </div>: <div>loading..</div>}

      </div>)
}

export default Game;