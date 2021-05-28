import {useEffect, useState} from 'react';
import axios from 'axios';

const Game =  (props) => {
    const [game, setGame] = useState([])
    useEffect(() => {
        const getGameAndPlayers = async () => {
          let thisGame = await axios.get(`/game/${props.match.params.gameId}`);
            let players = await axios.get(
              `/game/players/${props.match.params.gameId}`)
            
            thisGame.data.players = players.data;
            
          
          console.log(thisGame);
          setGame(thisGame);
        };
        getGameAndPlayers();
      }, []);

      return (<div>yo</div>)
}

export default Game;