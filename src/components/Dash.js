import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { Link } from "react-router-dom";
import { setGamesRed } from "../redux/joinedGamesReducer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Dash = (props) => {
  //Display tab for either joinedgames or invited games(alert for invites)
  const [games, setGames] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const joinedGames = useSelector((store) => store.joinedGamesReducer);
  useEffect(() => {
    setGames(joinedGames.games);
  }, [joinedGames, user]);

  // const getGamesAndPlayers = async () => {
  //   let allGamesAndPlayers = [];
  //   let allGames = await axios.get(`/game/joined`);
  //   dispatch(setGamesRed([...allGames.data]));
  //   for (let i = 0; i < allGames.data.length; i++) {
  //     let players = await axios.get(
  //       `/game/players/${allGames.data[i].game_id}`
  //     );
  //     allGames.data[i].players = players.data;
  //     allGamesAndPlayers.push(allGames.data[i]);
  //   }
  //   setGames(allGamesAndPlayers);
  // };
  // const leaveGame = (e) => {
  //   axios.put(`/game/leave/${e.target.value}`).then(res=>{
  //     console.log(res)
  //     getGamesAndPlayers()
  //   }).catch(err=>{
  //     console.log(err)
  //   })
  // }
  const eventClick = (e) => {
    let game_id = e.event._def.publicId;
    props.history.push(`/game/${game_id}`);
  };

  return (
    <div id="dashContainer">
      <h2 id="calendarTitle">Scheduled Games</h2>
      <FullCalendar
        headerToolbar={{
          start: "title",
          center: "",
          end: "prev,next",
        }}
        height="80vh"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        displayEventTime={true}
        eventBackgroundColor={"#5FBFF9"}
        eventClick={eventClick}
        eventTextColor={"black"}
        eventDisplay={"block"}
        events={[
          ...games
            .filter((game) => {
              let today = new Date();
       
              let comp = new Date(game.date);
              let time = game.time.split(":")
              comp.setHours(time[0], time[1])
              if (comp >= today) {
                return game;
              }
            })
            .map((game) => {
              let date = new Date(game.date)
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              if (day < 10){
                day = `0${day}`
              }
              if(month < 10){
                  month = `0${month}`
              }
              
              let eventDate = `${year}-${month}-${day} ${game.time}`
              console.log(date)
              console.log(eventDate)

              return {
                title: game.title,
                date: eventDate,
                id: game.game_id,
              };
            }),
        ]}
      />
    </div>
    // <div id="dashContainer">
    //   <h1>Scheduled Games</h1>
    //   {games.map((game) => {
    //     return (
    //       <div className="dashGameContainer" key={game.game_id}>
    //         <div className="dashGameDets">
    //           <h3 className="dashGameViewTitle">{game.title}</h3>
    //           <img src={game.icon} />
    //           <span>{game.address}</span>
    //           <DatePicker
    //             value={game.date}
    //             disabled={true}
    //             disableCalendar={true}
    //           />
    //           <TimePicker disableClock={true} value={game.time} disabled={true} />
    //         </div>
    //         <div className="dashGamePlayersContainer">
    //           <h3 className="dashGameViewTitle"><span>{game.players.length}</span> players</h3>
    //           <div className="dashGamePlayers">
    //           {game.players.map((player) => {
    //             return (
    //               <div onClick={()=>{
    //                 props.history.push(`/users/${player.user_id}`)
    //               }}className="indDashGamePlayer" key={player.picture}>
    //                 <img src={player.picture} />
    //                 <span>{player.username}</span>
    //               </div>
    //             );
    //           })}
    //           </div>
    //         </div>
    //         <div className="dashGameOptions">
    //           <h3 className="dashGameViewTitle">Options</h3>
    //           <Link to={`/game/${game.game_id}`}><button>Game Page</button></Link>
    //           <button value={game.game_id} onClick={leaveGame}>Leave Game</button>
    //           {user ? (

    //               parseInt(game.creator) === parseInt(user.user_id) ? (
    //                 <button>edit game</button>
    //               ) : (
    //                 null
    //               )
    //           ) : (
    //             null
    //           )}
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default Dash;
