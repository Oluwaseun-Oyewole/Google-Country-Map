import Request from "..";
import { Endpoints } from "../endpoints";
import { CurrentWeatherDetailsParams, WeatherRequestParams } from "./types";

export const getWeatherForecasts = async (params: WeatherRequestParams) => {
  try {
    const response = await Request.get(Endpoints.weatherForecast, {
      params: params,
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_KEY,
        "X-RapidAPI-Host": "yahoo-weather5.p.rapidapi.com",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentWeatherDetails = async (
  params: CurrentWeatherDetailsParams
) => {
  try {
    const response = await Request.get(Endpoints.currentWeatherDetails, {
      params: {
        lat: params.lat,
        lon: params.lng,
        timezone: "auto",
        language: "en",
        units: "auto",
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_WEATHER_DETAILS_API_KEY,
        "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getHourlyWeatherDetails = async (
  params: CurrentWeatherDetailsParams
) => {
  try {
    const response = await Request.get(Endpoints.hourlyWeatherDetails, {
      params: {
        lat: params.lat,
        lon: params.lng,
        timezone: "auto",
        language: "en",
        units: "auto",
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_WEATHER_DETAILS_API_KEY,
        "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
