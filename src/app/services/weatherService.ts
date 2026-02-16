// Weather service using Open-Meteo API
export interface CurrentWeather {
  temp: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
  location: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
  };
}

// Map Open-Meteo weather codes to our icon system
const getWeatherIcon = (code: number): { icon: string; condition: string } => {
  // Based on WMO Weather interpretation codes
  if (code === 0) return { icon: 'sunny', condition: 'Clear Sky' };
  if (code <= 3) return { icon: 'partly-cloudy', condition: 'Partly Cloudy' };
  if (code <= 48) return { icon: 'cloudy', condition: 'Cloudy' };
  if (code <= 67) return { icon: 'rainy', condition: 'Rainy' };
  if (code <= 77) return { icon: 'rainy', condition: 'Snow' };
  if (code <= 82) return { icon: 'rainy', condition: 'Rain Showers' };
  if (code <= 86) return { icon: 'rainy', condition: 'Snow Showers' };
  if (code <= 99) return { icon: 'thunderstorm', condition: 'Thunderstorm' };
  return { icon: 'partly-cloudy', condition: 'Unknown' };
};

// Format time from ISO string to 24h format (HH:MM)
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Get location name from coordinates using reverse geocoding
const getLocationName = async (lat: number, lon: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
          'User-Agent': 'PokemonClockWeatherPWA/1.0'
        }
      }
    );
    
    if (!response.ok) {
      console.warn(`Geocoding API error: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geocoding API response:', data);
    
    if (data && data.address) {
      const addr = data.address;
      
      // Build a readable location string
      // Priority: city > town > village > county > state
      const cityName = addr.city || addr.town || addr.village || addr.municipality || 
                       addr.county || addr.state || addr.region;
      const countryCode = addr.country_code?.toUpperCase();
      
      if (cityName) {
        // Return city with country code for clarity (e.g., "New York, US")
        return countryCode ? `${cityName}, ${countryCode}` : cityName;
      }
      
      return addr.country || 'Unknown Location';
    } else {
      console.warn('No address data from geocoding API');
    }
  } catch (error) {
    console.warn('Failed to get location name:', error);
  }
  // Return a more user-friendly fallback
  return 'Current Location';
};

// Get user's current position
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      // Default to New York City
      resolve({ latitude: 40.7128, longitude: -74.0060 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation successful:', position.coords.latitude, position.coords.longitude);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // Log detailed error information
        console.warn('Geolocation error:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.code === 1,
          POSITION_UNAVAILABLE: error.code === 2,
          TIMEOUT: error.code === 3,
        });
        // Default to New York City as fallback
        resolve({ latitude: 40.7128, longitude: -74.0060 });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

// Fetch weather data from Open-Meteo API
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<{ current: CurrentWeather; forecast: DailyForecast[] }> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&temperature_unit=celsius&timezone=auto&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: OpenMeteoResponse = await response.json();
    const locationName = await getLocationName(latitude, longitude);

    // Parse current weather
    const currentWeatherData = getWeatherIcon(data.current_weather.weathercode);
    const current: CurrentWeather = {
      temp: Math.round(data.current_weather.temperature),
      condition: currentWeatherData.condition,
      icon: currentWeatherData.icon,
      sunrise: formatTime(data.daily.sunrise[0]),
      sunset: formatTime(data.daily.sunset[0]),
      location: locationName,
    };

    // Parse 7-day forecast
    const forecast: DailyForecast[] = data.daily.time.map((dateStr, index) => {
      const date = new Date(dateStr);
      const weatherData = getWeatherIcon(data.daily.weathercode[index]);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
        condition: weatherData.condition,
        icon: weatherData.icon,
        sunrise: formatTime(data.daily.sunrise[index]),
        sunset: formatTime(data.daily.sunset[index]),
      };
    });

    return { current, forecast };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get weather data for user's current location
export const getWeatherForCurrentLocation = async (): Promise<{
  current: CurrentWeather;
  forecast: DailyForecast[];
}> => {
  const location = await getUserLocation();
  return fetchWeatherData(location.latitude, location.longitude);
};