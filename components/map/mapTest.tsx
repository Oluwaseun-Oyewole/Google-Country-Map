import Mosco from "@/assets/mosco.svg";
import { useCountryData } from "@/context";
import { MarkerF } from "@react-google-maps/api";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import "./styles.css";

const MapTest = () => {
  const [map, ,] = useState(null);
  const { coordinate, setCoordinate, countries, place } = useCountryData();

  // let maps =  google.maps.Marker[]  = []

  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow
  ) {
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  useEffect(() => {
    new google.maps.InfoWindow({});
    const infoWindow = new google.maps.InfoWindow();
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const { lat, lng } = pos;
          setCoordinate({ lat, lng });
        },
        () => {
          handleLocationError(true, infoWindow);
        }
      );
    } else {
      handleLocationError(false, infoWindow);
    }
  }, []);

  //   console.log("coordinates", coordinate);
  // console.log("testing places", place);

  return (
    <div className="w-full h-[500px]">
      <GoogleMapReact
        onGoogleApiLoaded={() => {}}
        bootstrapURLKeys={{
          key: "AIzaSyDlFFp0g93o3h0XjtiE4hQ6O5Bv-Uo-azgQ4",
        }}
        defaultCenter={coordinate}
        center={coordinate}
        defaultZoom={12}
        yesIWantToUseGoogleMapApiInternals
        shouldUnregisterMapOnUnmount
        // margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          keyboardShortcuts: true,
          //   styles: mapStyles,
        }}
        onChange={(e) => {
          setCoordinate({ lat: e.center.lat, lng: e.center.lng });
          //   setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
      >
        <MarkerF
          position={{ lat: place.lat, lng: place.long }}
          options={{ icon: Mosco }}
          label="Testing Marker Components"
          title="ossns nshsbhin"
        />
        {/* <div className="markerContainer">
          <p className="paper"> {place?.country}</p>
        </div> */}
      </GoogleMapReact>
    </div>
  );
};

export default MapTest;
