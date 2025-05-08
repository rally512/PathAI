import { TOMORROW_IO_API_KEY } from '../config';
import { getConditionDescription } from './getConditionDescription';

export interface DailyForecast {
  date: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherForecast {
  forecast: DailyForecast[];
  externalUrl: string;
}

export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast | null> {
  try {
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${TOMORROW_IO_API_KEY}&timesteps=1d&units=imperial`;

    const response = await fetch(url);
    const data = await response.json();

    const days = data?.timelines?.daily?.slice(0, 5);

    if (!days || !Array.isArray(days)) {
      console.error('No daily forecast data available');
      return null;
    }

    const forecast: DailyForecast[] = days.map((d: any, index: number) => {
      const date = d.time?.split('T')[0] || `Day ${index + 1}`;
      const high = Math.round(d.values?.temperatureMax);
      const low = Math.round(d.values?.temperatureMin);
      const code = d.values?.weatherCodeMax;
      const condition = getConditionDescription(code);

      console.log(`🌤️ Forecast for ${date}:`, { high, low, code, condition });

      return {
        date,
        icon: code?.toString(),
        high,
        low,
        condition,
      };
    });

    return {
      forecast,
      externalUrl: `https://www.tomorrow.io/weather/${lat},${lon}`,
    };
  } catch (err) {
    console.error('Failed to fetch weather:', err);
    return null;
  }
}
