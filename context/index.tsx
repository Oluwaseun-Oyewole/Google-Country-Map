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
}

interface CoordinateType {
  lat: number;
  lng: number;
}

interface WeatherCountryType {
  countries: CountryEntries[];
  setCountries: React.Dispatch<React.SetStateAction<CountryEntries[]>>;
  createCountries: (country: CountryEntries) => void;
  place?: PlaceType;
  addPlace: (place: string) => void;
  setPlace: React.Dispatch<React.SetStateAction<PlaceType>>;
  coordinate: CoordinateType;
  setCoordinate: React.Dispatch<React.SetStateAction<CoordinateType>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const WeatherContext = createContext<WeatherCountryType | undefined>(undefined);
export const WeatherProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [countries, setCountries] =
    useState<CountryEntries[]>(countryDataEntries);
  const [place, setPlace] = useState<PlaceType>({ country: "Osun" });
  const [coordinate, setCoordinate] = useState<CoordinateType>({
    lng: 0,
    lat: 0,
  });
  const addPlace = (newPlace: string) => {
    return setPlace({ ...place, country: newPlace });
  };
  const [value, setValue] = useState("");

  const createCountries = (countryData: CountryEntries) => {
    return setCountries([
      ...countries,
      { country: countryData.country, image: countryData.image },
    ]);
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
