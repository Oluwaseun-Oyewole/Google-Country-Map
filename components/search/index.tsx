"use client";
import { useCountryData } from "@/context";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import Input from "../input";

type ISearchPropsType = {
  isClassName?: boolean;
};
const GooglePlaceSearch: React.ForwardRefRenderFunction<
  {},
  ISearchPropsType
> = ({ isClassName }, ref) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsQuery = searchParams.get("query");
  let autoCompleteRef = useRef(null);
  const [query, ,] = useState(searchParamsQuery ?? "");
  const {
    addPlace,
    coordinate,
    setCoordinate,
    setValue,
    setCountryName,
    setCountryInfo,
  } = useCountryData();

  const updateURLFromSearchQuery = (query: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", query);
    router.push(`?${params.toString()}`);
  };

  const options = {
    fields: [
      "formatted_address",
      "geometry",
      "name",
      "address_components",
      "adr_address",
      "url",
      "website",
    ],
    strictBounds: false,
  };
  let autoComplete: any;
  const loadGoogleAutoComplete = async (autoCompleteRef: any) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef?.current,
      options
    );

    autoComplete.addListener("place_changed", () => {
      const place = autoComplete.getPlace();
      setCountryInfo(place);
      if (!place?.geometry || !place?.geometry.location) {
        window.alert("No details available for input:'" + place?.name + "'");
        return;
      } else {
        setCoordinate({
          ...coordinate,
          lat: place?.geometry.location.lat(),
          lng: place?.geometry.location.lng(),
        });
        addPlace({
          country: place?.formatted_address,
          lat: place?.geometry.location.lat(),
          long: place?.geometry.location.lat(),
        });
        setCountryName(place?.adr_address);
        place?.formatted_address;
        setValue(place?.formatted_address);
        updateURLFromSearchQuery(place?.address_components[0]?.long_name);
      }
    });
  };
  useEffect(() => {
    if (typeof window !== undefined && !window.google) {
      setTimeout(() => {
        loadGoogleAutoComplete(autoCompleteRef);
      }, 1000);
    }
    loadGoogleAutoComplete(autoCompleteRef);
  }, []);

  return (
    <div className={`${isClassName ? "w-full" : "mt-4"} `}>
      <Input
        defaultValue={query}
        type="search"
        ref={autoCompleteRef}
        onChange={(event) => {
          setValue(event?.target?.value);
        }}
        placeholder="Search new place"
        className="pac-input"
      />

      <br />
      {/* {info && <Image src={`${info.icon}`} alt="" width={50} height={50} />} */}
    </div>
  );
};

export default forwardRef(GooglePlaceSearch);
