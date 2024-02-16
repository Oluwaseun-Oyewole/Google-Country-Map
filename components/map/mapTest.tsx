import { useCountryData } from "@/context";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import "./styles.css";

const MapTest = () => {
  const [map, ,] = useState(null);
  const { coordinate, setCoordinate, countries, place } = useCountryData();
  const [infoWindow, setWindow] = useState<any>();

  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow
  ) {
    infoWindow?.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow?.open(map);
  }

  useEffect(() => {
    try {
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
    } catch (error) {
      alert("The Google Maps JavaScript API could not load.");
    }
  }, []);

  //   console.log("coordinates", coordinate);
  // console.log("testing places", place);

  return (
    <div className="w-full h-[300px] md:h-[470px]">
      <GoogleMapReact
        onGoogleApiLoaded={() => {
          const infoWindow: any = new google.maps.InfoWindow();
          setWindow(infoWindow);
        }}
        bootstrapURLKeys={{
          libraries: ["places"],
          key: "AIzaSyBd0vAku9eywLaQkzxlE0iwFb8aSu9OEyI",
        }}
        defaultCenter={coordinate}
        center={coordinate}
        defaultZoom={12}
        // yesIWantToUseGoogleMapApiInternals
        // shouldUnregisterMapOnUnmount
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
      ></GoogleMapReact>
    </div>
  );
};

export default MapTest;
