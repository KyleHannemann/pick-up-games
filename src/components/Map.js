import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setGameLocation } from "../redux/createGameReducer";
import { mapStyles } from "./mapStyles/mapStyles";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {Link} from 'react-router-dom'

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
import { formatRelative } from "date-fns";

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
  const [gameMarkers, setGameMarkers] = useState([])
  const [zoom, setZoom] = useState(10);
  const [selected, setSelected] = useState(null)
  const acceptLoc = (position) => {
    const { latitude, longitude } = position.coords;
    setCenter({
      lat: latitude,
      lng: longitude,
    });
    setZoom(12);
  };
  const denyLoc = () => {
    return;
  };
  useEffect(() => {
    axios
      .get("/game/all")
      .then((res) => {
        console.log(res);
        setGameMarkers(res.data)
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
      setMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      dispatch(
        setGameLocation({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      );
    }
  };

  return (
    <div
      style={{ height: props.height || "100vh", width: props.width || "100vw" }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        onClick={mapClick}
      >
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
        {gameMarkers.map(game=>{
          return (<Marker 
            onClick={()=>{setSelected(game)}}
            icon={{
              url: game.icon,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(0, 0),
              scaledSize: new window.google.maps.Size(30, 30),
            }}key={`${game.lat}${game.game_id}`} 
            position={{lat: game.latitude, lng: game.longitude}}/>)
        })}
        {selected? <InfoWindow onCloseClick={()=>{
            setSelected(null)
          }}
         position={{lat: selected.latitude, lng: selected.longitude}}>
        <div>
          <h2>{selected.title}</h2>
          <DatePicker value={selected.date} disableCalendar={true} disabled={true}/>
          <TimePicker value={selected.time} disableClock={true} disabled={true}/>
          <Link to={`/game/${selected.game_id}`}><button>view game details</button></Link>
        </div>
        </InfoWindow>: null}
      </GoogleMap>
    </div>
  );
};
export default Map;
