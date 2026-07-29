export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  precipitationProbability: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
}

export type RainTiming =
  | { state: 'none' }
  | { state: 'raining'; minutesUntilStop: number | null }
  | { state: 'starting'; minutesUntilStart: number };

export interface WeatherData {
  location: {
    city: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  sun: SunTimes;
  nextRain: RainTiming;
}
