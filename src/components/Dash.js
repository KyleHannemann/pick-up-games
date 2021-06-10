import { useState, useEffect } from "react";
import { useSelector} from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Dash = (props) => {
  const [games, setGames] = useState([]);
  const { user } = useSelector((store) => store.auth);

  const joinedGames = useSelector((store) => store.joinedGamesReducer);
  useEffect(() => {
    setGames(joinedGames.games);
  }, [joinedGames, user]);

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
              let time = game.time.split(":");
              comp.setHours(time[0], time[1]);
              if (comp >= today) {
                return game;
              }
              else return null;
            })
            .map((game) => {
              let date = new Date(game.date);
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              if (day < 10) {
                day = `0${day}`;
              }
              if (month < 10) {
                month = `0${month}`;
              }

              let eventDate = `${year}-${month}-${day} ${game.time}`;

              return {
                title: game.title,
                date: eventDate,
                id: game.game_id,
              };
            }),
        ]}
      />
    </div>
  );
};

export default Dash;
