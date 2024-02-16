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

type CountryArrayType = {
  name: string;
}[];

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
    return setCountries([
      ...countries,
      { country: countryData.country, image: countryData.image },
    ]);
  };
  const [countryName, setCountryName] = useState("");
  const [tableArray, setTableArray] = useState<any>([]);
  const allCountriesArray = (data: any) => {
    data?.length > 0 && setTableArray((prev: any) => [...prev, ...data]);
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
