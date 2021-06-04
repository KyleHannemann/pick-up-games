import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setGameLocation } from "../redux/createGameReducer";
import { mapStyles } from "./mapStyles/mapStyles";
import axios from "axios";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {Link} from 'react-router-dom';

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
      addMarker(e.latLng.lat(),  e.latLng.lng() )
    }
  };
  const addMarker = async(latitude, longitude) => {
    try {
      const addy = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`)
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
      
    }
    catch (error){
        console.log(error)
    }
  }

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
        onLoad={onMapLoad}
      >
        <Search panTo={panTo} />
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
        {gameMarkers.filter((game) => {
              let today = new Date();
              let comp = new Date(game.date);
              if (comp >= today) {
                return comp;
              }
            }).map(game=>{
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
        <div className="mapInfoWindow">
          <h2>{selected.title}</h2>
          <div>
          <DatePicker value={selected.date} disableCalendar={true} clearIcon={false} disabled={true}/>
          <TimePicker value={selected.time} disableClock={true} clearIcon={false} disabled={true}/>
          </div>
          <Link to={`/game/${selected.game_id}`}><button>game page</button></Link>
        </div>
        </InfoWindow>: null}
      </GoogleMap>
    </div>
  );
};
export default Map;

function Search({ panTo }) {
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
      panTo({ lat, lng });
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
