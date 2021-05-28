import { useState, useEffect, useCallback } from "react";
import {useDispatch} from 'react-redux';
import {setGameLocation} from '../redux/createGameReducer';
import { mapStyles } from "./mapStyles/mapStyles";
import axios from "axios";
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
  const [marker, setMarker] = useState([])
  const [center, setCenter] = useState({
    lat: 40.4193,
    lng: -111.8746,
  });
  const [zoom, setZoom] = useState(10);
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
      if (props.createGame !== true){
          return;
      }
      else{
        setMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng() 
        })
        
        dispatch(setGameLocation({
          lat: e.latLng.lat(),
          lng: e.latLng.lng() 
      }))


      }
  }

  return (
    <div style={{height: props.height || '100vh', width: props.width || '100vw'}}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        onClick={mapClick}
      >
          <Marker position={{lat: marker.lat, lng: marker.lng}}/>
      </GoogleMap>
    </div>
  );
};
export default Map;
