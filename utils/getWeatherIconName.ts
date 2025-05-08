export type WeatherIconName =
  | 'weather-sunny'
  | 'weather-partly-cloudy'
  | 'weather-cloudy'
  | 'weather-lightning'
  | 'weather-rainy'
  | 'weather-snowy'
  | 'weather-cloudy-alert'; // fallback

export function getWeatherIconName(condition: string): WeatherIconName {
  const c = condition?.toLowerCase() || '';
  if (c.includes('sun') || c.includes('clear')) return 'weather-sunny';
  if (c.includes('partly')) return 'weather-partly-cloudy';
  if (c.includes('cloud')) return 'weather-cloudy';
  if (c.includes('thunder')) return 'weather-lightning';
  if (c.includes('rain')) return 'weather-rainy';
  if (c.includes('snow')) return 'weather-snowy';
  return 'weather-cloudy-alert';
}
