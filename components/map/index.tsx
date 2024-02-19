"use client";
import { useCountryData } from "@/context";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../loader";

const Map = () => {
  const [map, setMap] = useState<any>(null);
  const { place, coordinate, setCoordinate } = useCountryData();

  const containerStyle = {
    width: "100%",
    height: "470px",
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(coordinate);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleMarkerClick = (lat: number, lng: number) => {
    map?.setZoom(15);
    map?.panTo({ lat, lng });
  };

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
          // setCoordinate({ lat: 6.5916, lng: 3.2911 });
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

  type IPosition = {
    lat: number;
    lng: number;
  };
  const generatePlaces = (position: IPosition) => {
    const _places = [];
    for (let i = 0; i < 7; i++) {
      const direction = Math.random() < 0.5 ? -2 : 2;
      _places.push({
        lat: position.lat + Math.random() / direction,
        lng: position.lng + Math.random() / direction,
      });
    }
    return _places;
  };

  const places = useMemo(() => generatePlaces(coordinate), [coordinate]);
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapContainerClassName="bg-[##3A3B65]"
          center={coordinate}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onZoomChanged={() => {
            console.log("first map zoom", map?.getZoom());
          }}
          onCenterChanged={() => {
            map?.setZoom(10);
          }}
          options={{
            mapTypeControl: false,
            panControl: true,
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
            fullscreenControl: true,
            // streetViewControl: false,
          }}
        >
          <Marker
            onClick={() => {
              handleMarkerClick(coordinate.lat, coordinate.lng);
              setOpenInfo(true);
            }}
            position={coordinate}
            animation={google.maps.Animation.BOUNCE}
            draggable
            zIndex={10000}
            // icon={{
            //   // url: "",
            //   scaledSize: new window.google.maps.Size(30, 30),
            // }}
          >
            {openInfo && (
              <InfoWindow onCloseClick={() => setOpenInfo(false)}>
                <p className="text-black bg-red-500 h-[50%] w-[50%]">
                  Weather Info Coming Soon... and it's gonna be nice
                </p>
              </InfoWindow>
            )}
          </Marker>

          <MarkerClusterer>
            {(clusterer) => (
              <div>
                {places.map((obj: any, i) => (
                  <Marker
                    onClick={() =>
                      handleMarkerClick(coordinate.lat, coordinate.lng)
                    }
                    key={i}
                    position={obj}
                    animation={google.maps.Animation.DROP}
                  />
                ))}
              </div>
            )}
          </MarkerClusterer>
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
