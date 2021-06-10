import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setGameLocation } from "../redux/createGameReducer";
import { mapStyles } from "./mapStyles/mapStyles";
import axios from "axios";
import TimePicker from "react-time-picker";
import DatePicker from "react-date-picker";
import { Link } from "react-router-dom";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const Map = (props) => {
  const dispatch = useDispatch();
  const [marker, setMarker] = useState([]);
  const [center, setCenter] = useState({
    lat: 40.4193,
    lng: -111.8746,
  });
  const [filter, setFilter] = useState(false);
  const [filterBy, setFilterBy] = useState({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [loadingGames, setLoadingGames] = useState(true)
  const [gameMarkers, setGameMarkers] = useState([]);
  const [zoom, setZoom] = useState(10);
  const [selected, setSelected] = useState(null);
  const acceptLoc = (position) => {
    const { latitude, longitude } = position.coords;
    setCenter({
      lat: latitude,
      lng: longitude,
    });
    setZoom(12);
  };

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const denyLoc = () => {
    return;
  };
  useEffect(() => {
    axios
      .get("/game/all/games")
      .then((res) => {
        console.log(res);
        setGameMarkers(res.data)
        setLoadingGames(false);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(acceptLoc, denyLoc);
    }
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  if (loadError) {
    return "error loading map";
  }
  if (!isLoaded) {
    return "loading maps..";
  }
  const mapClick = (e) => {
    if (props.createGame !== true) {
      return;
    } else {
      addMarker(e.latLng.lat(), e.latLng.lng());
    }
  };
  const addMarker = async (latitude, longitude) => {
    try {
      const addy = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`
      );
      setMarker({
        lat: latitude,
        lng: longitude,
      });

      dispatch(
        setGameLocation({
          addy: addy.data.results[0].formatted_address || null,
          lat: latitude,
          lng: longitude,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{ height: props.height || "90vh", width: props.width || "100vw" }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        onClick={mapClick}
        onLoad={onMapLoad}
      >
        {" "}
        {props.createGame ? null : (
          <div id="mapSetFilter">
            <span>
              <span>Search By Date and Time
              <button
                onClick={() => {
                  setFilter(true);
                }}
              >
              <span style={{fontSize: "10px"}}>&#9660;</span> 
              </button>{" "}
              </span>
              
              <span> {" "}
              <span style={{marginRight: "4px"}}>Dates:</span>
                {filterBy.startDate === null
                  ? "Any"
                  : filterBy.startDate
                      .toString()
                      .slice(
                        0,
                        filterBy.startDate.toString().indexOf("00:")
                      )}{" "}
                -{" "}
                {filterBy.endDate === null
                  ? "Any"
                  : filterBy.endDate
                      .toString()
                      .slice(0, filterBy.endDate.toString().indexOf("00:"))}
              </span>
              
              <span>
                <span style={{marginRight: "4px"}}>Times:</span>
                {filterBy.startTime === null
                  ? "Any"
                  : filterBy.startTime
                      .toString()
                      .split(":")
                      .reduce((acc, el, i) => {
                        if (i === 0) {
                          if (12 % el >= 12) {
                            console.log("o");
                            acc.push(el % 12);
                            acc.push("Pm");
                          } else if (parseInt(el) === 12) {
                            acc.push(el);
                            acc.push("Pm");
                          } else {
                            acc.push(el);
                            acc.push("Am");
                          }
                        } else {
                          return [acc[0], ":", el, " ", acc[1]];
                        }

                        return acc;
                      }, [])
                      .join("")}{" "}
                -{" "}
                {filterBy.endTime === null
                  ? "Any"
                  : filterBy.endTime
                      .toString()
                      .split(":")
                      .reduce((acc, el, i) => {
                        if (i === 0) {
                          if (12 % el >= 12) {
                            console.log("o");
                            acc.push(el % 12);
                            acc.push("Pm");
                          } else if (parseInt(el) === 12) {
                            acc.push(el);
                            acc.push("Pm");
                          } else {
                            acc.push(el);
                            acc.push("Am");
                          }
                        } else {
                          return [acc[0], ":", el, " ", acc[1]];
                        }

                        return acc;
                      }, [])
                      .join("")}
              </span>
            </span>
          </div>
        )}
        {filter ? (
          <div id="mapFilter">
            <div>
              <span></span>
              <button
                onClick={() => {
                  setFilter(false);
                }}
              >
                &#x2715;
              </button>
            </div>

            <div>
              <span>Start</span>
              <DatePicker
                value={filterBy.startDate}
                onChange={(e) => {
                  setFilterBy({ ...filterBy, startDate: e });
                }}
              />
            </div>
            <div>
              <span>End</span>
              <DatePicker
                value={filterBy.endDate}
                onChange={(e) => {
                  setFilterBy({ ...filterBy, endDate: e });
                }}
              />
            </div>
            <div>
              <span>Start</span>
              <TimePicker
                disableClock={true}
                clockIcon={false}
                value={filterBy.startTime}
                onChange={(e) => {
                  console.log(e);
                  setFilterBy({ ...filterBy, startTime: e });
                }}
              />
            </div>
            <div>
              <span>End</span>
              <TimePicker
                disableClock={true}
                clockIcon={false}
                value={filterBy.endTime}
                onChange={(e) => {
                  setFilterBy({ ...filterBy, endTime: e });
                }}
              />
            </div>
            <button style={{marginTop: "10px", borderRadius:"6px", border: "none", backgroundColor: "#efe9f4", padding: "4px 8px"}}onClick={()=>{
              setFilter(false)
            }}>Apply</button>
          </div>
        ) : null}
        <Search panTo={panTo} createGame={props.createGame} />
        {loadingGames && !props.createGame ? <div className="loadingBarContainer" id="mapLoadingBarContainer" >

        <div className="loadingBar" id="mapLoadingBar"></div>
        <span>..loading games</span></div> : null}
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
        {gameMarkers
          .filter((game) => {
            if (game.public !== true){
              return null
            }

            let startDate = filterBy.startDate;
            if (startDate !== null) {
              if (new Date(game.date) < new Date(startDate)) {
                return null;
              }
            }
            let endDate = filterBy.endDate;
            if (endDate !== null) {
              if (new Date(game.date) > new Date(endDate)) {
                return null;
              }
            }
            let startHours = filterBy.startTime;
            if (startHours !== null) {
              if (
                parseInt(startHours.toString().split(":")[0]) >
                parseInt(game.time.toString().split(":")[0])
              ) {
                return null;
              }
            }
            let startMin = filterBy.startTime;
            if (startMin !== null) {
              if (
                parseInt(startMin.toString().split(":")[1]) >
                parseInt(game.time.toString().split(":")[1])
              ) {
                return null;
              }
            }
            let endHours = filterBy.endTime;
            if (endHours !== null) {
              if (
                parseInt(endHours.toString().split(":")[0]) <
                parseInt(game.time.toString().split(":")[0])
              ) {
                return null;
              }
            }
            let endMin = filterBy.endTime;
            if (endMin !== null) {
              if (
                parseInt(endMin.toString().split(":")[1]) <
                parseInt(game.time.toString().split(":")[1])
              ) {
                return null;
              }
            }
            return game;
          })
          .map((game) => {
            return (
              <Marker
                onClick={() => {
                  setSelected(game);
                }}
                icon={{
                  url: game.icon,
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(0, 0),
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                key={`${game.lat}${game.game_id}`}
                position={{ lat: game.latitude, lng: game.longitude }}
              />
            );
          })}
        {selected ? (
          <InfoWindow
            onCloseClick={() => {
              setSelected(null);
            }}
            position={{ lat: selected.latitude, lng: selected.longitude }}
          >
            <div className="mapInfoWindow">
              <h2
                onClick={() => {
                  console.log(selected);
                }}
              >
                {selected.title}
              </h2>
              <div>{selected.date.slice(0, selected.date.indexOf("00:"))}</div>
              <div>
                <TimePicker
                  value={selected.time}
                  disableClock={true}
                  clearIcon={false}
                  disabled={true}
                />
              </div>
              <div>{selected.players.length < selected.max_players? selected.players.length + " Players": <span style={{color: "red", borderBottom: "1px solid red"}}>This Game Is Full</span>}</div>

              <Link to={`/game/${selected.game_id}`}>
                <button>game page</button>
              </Link>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};
export default Map;

function Search(props) {
  console.log(props);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      props.panTo({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mapSearchBar">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
