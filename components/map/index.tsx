"use client";
import { useCountryData } from "@/context";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../loader";

const Map = () => {
  const [center, setCenter] = useState({ lat: 6.537216, lng: 3.3488896 });
  const [map, setMap] = useState(null);
  const { place, coordinate, setCoordinate } = useCountryData();

  // const center = {
  //   lat: -3.745,
  //   lng: -38.523,
  // };
  const containerStyle = {
    width: "100%",
    height: "450px",
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

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
          setCenter({ lat, lng });
        },
        () => {
          handleLocationError(true, infoWindow);
        }
      );
    } else {
      handleLocationError(false, infoWindow);
    }
  }, []);

  // console.log("testing co-ordinates", coordinate);

  // console.log("center", center);

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapContainerClassName="bg-[##3A3B65]"
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onBoundsChanged={() => {}}
          onCenterChanged={() => {
            console.log("center change", center);
          }}
          options={{
            mapTypeControl: false,
            // styles: [
            //   {
            //     featureType: "all",
            //     stylers: [{ color: "#262742" }],
            //   },
            //   {
            //     featureType: "road.arterial",
            //     elementType: "geometry",
            //     stylers: [{ color: "#4E4DB0" }],
            //   },
            //   {
            //     featureType: "landscape",
            //     elementType: "labels",
            //     stylers: [{ color: "#380ABB" }],
            //   },
            // ],
            controlSize: null,
            disableDefaultUI: true,
          }}
        >
          <div className="bg-red-500 h-20 w-20 absolute z-50 translate-y-1/2 translate-x-1/2">
            <p>{place?.country}</p>
          </div>
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-[440px]">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Map;
