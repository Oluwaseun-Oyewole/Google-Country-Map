"use client";
import { CountryEntries, countryDataEntries } from "@/utils/mock";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface PlaceType {
  country: string;
  lat: number;
  long: number;
}

interface CoordinateType {
  lat: number;
  lng: number;
}

type InfoType = {
  url: string;
  website: string;
  name: string;
};

interface WeatherCountryType {
  countryName: string;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  countries: CountryEntries[];
  setCountries: React.Dispatch<React.SetStateAction<CountryEntries[]>>;
  createCountries: (country: CountryEntries) => void;
  place: PlaceType;
  addPlace: (place: PlaceType) => void;
  setPlace: React.Dispatch<React.SetStateAction<PlaceType>>;
  coordinate: CoordinateType;
  setCoordinate: React.Dispatch<React.SetStateAction<CoordinateType>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  tableArray: Array<any>;
  allCountriesArray: (data: any) => void;
  countryInfo: InfoType;
  setCountryInfo: React.Dispatch<React.SetStateAction<InfoType>>;
}

const WeatherContext = createContext<WeatherCountryType | undefined>(undefined);
export const WeatherProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [countries, setCountries] =
    useState<CountryEntries[]>(countryDataEntries);
  const [place, setPlace] = useState<PlaceType>({
    country: "",
    lat: 0,
    long: 0,
  });
  const [coordinate, setCoordinate] = useState<CoordinateType>({
    lat: 0,
    lng: 0,
  });
  const [countryName, setCountryName] = useState("");
  const [tableArray, setTableArray] = useState<any>([]);
  const [countryInfo, setCountryInfo] = useState<InfoType>({
    url: "",
    website: "",
    name: "",
  });
  const addPlace = (newPlace: PlaceType) => {
    return setPlace({
      ...place,
      country: newPlace.country,
      lat: newPlace.lat,
      long: newPlace.long,
    });
  };
  const [value, setValue] = useState("");

  const createCountries = (countryData: CountryEntries) => {
    if (countries) {
      if (
        !countries.some((country) => country.country === countryData.country)
      ) {
        return setCountries([
          ...countries,
          { country: countryData.country, image: countryData.image },
        ]);
      }
    }
  };

  const allCountriesArray = (data: any) => {
    if (data) {
      if (
        !tableArray.some((obj: any) => obj.capital[0] === data[0].capital[0])
        // obj?.every(
        //   (val: any, index: number) =>
        //     obj[index].capital[index] === data[index].capital[index]
        // )
      ) {
        return setTableArray((prev: any) => [...prev, ...data]);
      }
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        countries,
        setCountries,
        createCountries,
        place,
        setPlace,
        addPlace,
        coordinate,
        setCoordinate,
        value,
        setValue,
        countryName,
        setCountryName,
        tableArray,
        allCountriesArray,
        countryInfo,
        setCountryInfo,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useCountryData = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useCountryData must be used within a CountryDataProvider");
  }
  return context;
};
