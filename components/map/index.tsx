"use client";
import { useCountryData } from "@/context";
import { truncate } from "@/helper";
import {
  getCurrentWeatherDetails,
  getHourlyWeatherDetails,
} from "@/services/weather";
import { CurrentWeatherDetailsParams } from "@/services/weather/types";
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
  const { place, coordinate, setCoordinate, countryInfo } = useCountryData();
  const [currentWeatherData, setCurrentWeatherData] = useState<any>();
  const [, setHourlyWeatherData] = useState<any>();
  const [, setError] = useState("");

  const fetchCurrentWeatherDetails = async (
    coordinate: CurrentWeatherDetailsParams
  ) => {
    if (!coordinate) return;
    try {
      const res = await getCurrentWeatherDetails(coordinate);
      setCurrentWeatherData(res?.current);
    } catch (error) {
      setError("Fetch Error");
    }
  };

  const fetchHourlyWeatherDetails = async (
    coordinate: CurrentWeatherDetailsParams
  ) => {
    if (!coordinate) return;
    try {
      const res = await getHourlyWeatherDetails(coordinate);
      setHourlyWeatherData(res?.hourly);
    } catch (error) {
      setError("Fetch Error");
    }
  };

  useEffect(() => {
    fetchCurrentWeatherDetails(coordinate);
    // fetchHourlyWeatherDetails(coordinate);
  }, [coordinate]);

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
                <div className="text-black font-poppins text-xs shadow-lg pr-4">
                  <div className="font-medium py-2">
                    <p>Current Location : {place?.country}</p>
                  </div>

                  <div>
                    <p className="font-medium underline">Location Details : </p>

                    <p className="py-2">
                      Coordinates:{" "}
                      {`latitude: ${coordinate?.lat} longitude: ${coordinate?.lng}`}
                    </p>
                    <div>
                      Url :{" "}
                      <a
                        href={countryInfo?.url}
                        target="_blank"
                        className="text-blue-600"
                      >
                        {truncate(countryInfo?.url, 30)}
                      </a>
                    </div>
                    <p className="py-1"> Name : {countryInfo?.name}</p>
                    <p>
                      Website:{" "}
                      <a
                        href={countryInfo?.website}
                        className="text-blue-600"
                        target="_black"
                      >
                        {countryInfo?.website}
                      </a>
                    </p>
                  </div>

                  <div className="py-2">
                    <h2 className="font-medium underline">
                      Weather Information:
                    </h2>
                    {currentWeatherData ? (
                      <>
                        <div className="flex items-center gap-4 py-2">
                          <div>
                            <p className="pb-1 font-medium">Current</p>
                            <div>
                              <p>Summary : {currentWeatherData?.summary}</p>
                              <p>
                                temperature : {currentWeatherData?.temperature}
                              </p>
                              <p>Pressure : {currentWeatherData?.pressure}</p>
                              <p>Humidity : {currentWeatherData?.humidity}</p>
                              <p>Dew-Point : {currentWeatherData?.dew_point}</p>
                              <p>
                                Wind-Chill : {currentWeatherData?.wind_chill}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center pt-2 font-medium">
                        No Weather Detail
                      </p>
                    )}
                  </div>
                </div>
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
