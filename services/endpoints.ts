export const COUNTRY_API_BASE_URL = process.env.NEXT_PUBLIC_COUNTRY_URL;
export const WEATHER_FORECAST_URL = process.env.NEXT_PUBLIC_WEATHER_API;

export class Endpoints {
  static country = COUNTRY_API_BASE_URL;
  static weatherForecast = WEATHER_FORECAST_URL + "weather";
}
