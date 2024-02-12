"use client";
import { useCountryData } from "@/context";

const Map = () => {
  // const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  // const [map, setMap] = useState(null);
  const { place, coordinate, setCoordinate } = useCountryData();
  // const containerStyle = {
  //   width: "100%",
  //   height: "450px",
  // };
  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "YOUR_API_KEY",
  // });
  // const onLoad = useCallback(function callback(map: any) {
  //   const bounds = new window.google.maps.LatLngBounds(coordinates);
  //   map.fitBounds(bounds);
  //   setMap(map);
  // }, []);

  // const onUnmount = useCallback(function callback(map: any) {
  //   setMap(null);
  // }, []);

  // function handleLocationError(
  //   browserHasGeolocation: boolean,
  //   infoWindow: google.maps.InfoWindow
  // ) {
  //   infoWindow.setContent(
  //     browserHasGeolocation
  //       ? "Error: The Geolocation service failed."
  //       : "Error: Your browser doesn't support geolocation."
  //   );
  //   infoWindow.open(map);
  // }

  // useEffect(() => {
  //   new google.maps.InfoWindow({});
  //   const infoWindow = new google.maps.InfoWindow();
  //   if (navigator?.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         const { lat, lng } = pos;
  //         setCoordinates({ lat, lng });
  //       },
  //       () => {
  //         handleLocationError(true, infoWindow);
  //       }
  //     );
  //   } else {
  //     handleLocationError(false, infoWindow);
  //   }
  // }, []);

  // useEffect(() => {
  //   setCoordinate({
  //     ...coordinate,
  //     lat: "200",
  //     lng: "300",
  //   });
  // }, []);

  return (
    <div>
      Mapping
      {/* {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapContainerClassName="bg-[##3A3B65]"
          center={coordinates}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onBoundsChanged={() => {}}
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
      )} */}
    </div>
  );
};

export default Map;
