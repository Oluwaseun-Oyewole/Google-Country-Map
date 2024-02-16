import Request from "..";
import { Endpoints } from "../endpoints";
import { WeatherRequestParams } from "./types";

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
