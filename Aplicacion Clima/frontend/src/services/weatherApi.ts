import { httpClient } from '@/services/httpClient';
import { OPEN_METEO_FORECAST_URL } from '@/constants/api';
import type { Coordinates, DailyForecastItem, WeatherData } from '@/types/weather';
import { computeRainTiming } from '@/utils/insights/rainTiming';

interface OpenMeteoForecastResponse {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    visibility: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    uv_index: number;
    precipitation_probability: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  minutely_15?: {
    time: string[];
    precipitation: number[];
  };
}

interface FetchWeatherOptions extends Coordinates {
  city: string;
  country: string;
}

export async function fetchWeather({
  latitude,
  longitude,
  city,
  country,
}: FetchWeatherOptions): Promise<WeatherData> {
  const { data } = await httpClient.get<OpenMeteoForecastResponse>(OPEN_METEO_FORECAST_URL, {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'weather_code',
        'is_day',
        'relative_humidity_2m',
        'surface_pressure',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
        'precipitation_probability',
      ].join(','),
      hourly: ['temperature_2m', 'weather_code', 'precipitation_probability', 'is_day'].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'sunrise',
        'sunset',
      ].join(','),
      minutely_15: 'precipitation',
      forecast_days: 7,
      timezone: 'auto',
    },
  });

  const nowIndex = data.hourly.time.findIndex((t) => t >= data.current.time);
  const startIndex = nowIndex >= 0 ? nowIndex : 0;

  return {
    location: { city, country, timezone: data.timezone, latitude, longitude },
    current: {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      humidity: data.current.relative_humidity_2m,
      pressure: Math.round(data.current.surface_pressure),
      visibility: Math.round(data.current.visibility / 1000),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      uvIndex: Math.round(data.current.uv_index),
      precipitationProbability: data.current.precipitation_probability,
      time: data.current.time,
    },
    hourly: data.hourly.time.slice(startIndex, startIndex + 24).map((time, i) => {
      const idx = startIndex + i;
      return {
        time,
        temperature: Math.round(data.hourly.temperature_2m[idx]),
        weatherCode: data.hourly.weather_code[idx],
        precipitationProbability: data.hourly.precipitation_probability[idx],
        isDay: data.hourly.is_day[idx] === 1,
      };
    }),
    daily: data.daily.time.map((date, idx) => ({
      date,
      weatherCode: data.daily.weather_code[idx],
      temperatureMax: Math.round(data.daily.temperature_2m_max[idx]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[idx]),
      precipitationProbability: data.daily.precipitation_probability_max[idx],
    })),
    sun: {
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    },
    nextRain: computeRainTiming(data.current.time, data.minutely_15),
  };
}

interface OpenMeteoDailyOnlyResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchDailyForecast(
  { latitude, longitude }: Coordinates,
  days: number
): Promise<DailyForecastItem[]> {
  const { data } = await httpClient.get<OpenMeteoDailyOnlyResponse>(OPEN_METEO_FORECAST_URL, {
    params: {
      latitude,
      longitude,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),
      forecast_days: Math.min(Math.max(days, 1), 16),
      timezone: 'auto',
    },
  });

  return data.daily.time.map((date, idx) => ({
    date,
    weatherCode: data.daily.weather_code[idx],
    temperatureMax: Math.round(data.daily.temperature_2m_max[idx]),
    temperatureMin: Math.round(data.daily.temperature_2m_min[idx]),
    precipitationProbability: data.daily.precipitation_probability_max[idx],
  }));
}
