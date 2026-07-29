export type WeatherAnimation = 'sun' | 'moon' | 'cloud' | 'cloud-sun' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';

export interface WeatherCodeInfo {
  label: string;
  icon: WeatherAnimation;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'Despejado', icon: 'sun' },
  1: { label: 'Mayormente despejado', icon: 'cloud-sun' },
  2: { label: 'Parcialmente nublado', icon: 'cloud-sun' },
  3: { label: 'Nublado', icon: 'cloud' },
  45: { label: 'Niebla', icon: 'fog' },
  48: { label: 'Niebla escarchada', icon: 'fog' },
  51: { label: 'Llovizna ligera', icon: 'drizzle' },
  53: { label: 'Llovizna moderada', icon: 'drizzle' },
  55: { label: 'Llovizna intensa', icon: 'drizzle' },
  56: { label: 'Llovizna helada', icon: 'drizzle' },
  57: { label: 'Llovizna helada intensa', icon: 'drizzle' },
  61: { label: 'Lluvia ligera', icon: 'rain' },
  63: { label: 'Lluvia moderada', icon: 'rain' },
  65: { label: 'Lluvia intensa', icon: 'rain' },
  66: { label: 'Lluvia helada', icon: 'rain' },
  67: { label: 'Lluvia helada intensa', icon: 'rain' },
  71: { label: 'Nevada ligera', icon: 'snow' },
  73: { label: 'Nevada moderada', icon: 'snow' },
  75: { label: 'Nevada intensa', icon: 'snow' },
  77: { label: 'Granizo fino', icon: 'snow' },
  80: { label: 'Chubascos ligeros', icon: 'rain' },
  81: { label: 'Chubascos moderados', icon: 'rain' },
  82: { label: 'Chubascos violentos', icon: 'rain' },
  85: { label: 'Chubascos de nieve', icon: 'snow' },
  86: { label: 'Chubascos de nieve intensos', icon: 'snow' },
  95: { label: 'Tormenta eléctrica', icon: 'thunder' },
  96: { label: 'Tormenta con granizo', icon: 'thunder' },
  99: { label: 'Tormenta con granizo intenso', icon: 'thunder' },
};

export function getWeatherCodeInfo(code: number, isDay: boolean): WeatherCodeInfo {
  const info = WEATHER_CODE_MAP[code] ?? { label: 'Desconocido', icon: 'cloud' };
  if (!isDay && info.icon === 'sun') {
    return { label: info.label, icon: 'moon' };
  }
  if (!isDay && info.icon === 'cloud-sun') {
    return { label: info.label, icon: 'cloud' };
  }
  return info;
}
