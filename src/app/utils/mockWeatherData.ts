// Mock weather data for demonstration
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

export const getMockCurrentWeather = (): CurrentWeather => {
  return {
    temp: 72,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    sunrise: "6:32 AM",
    sunset: "6:48 PM",
    location: "Pallet Town"
  };
};

export const getMock7DayForecast = (): DailyForecast[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = [
    { name: 'Sunny', icon: 'sunny' },
    { name: 'Partly Cloudy', icon: 'partly-cloudy' },
    { name: 'Cloudy', icon: 'cloudy' },
    { name: 'Rainy', icon: 'rainy' },
    { name: 'Thunderstorm', icon: 'thunderstorm' }
  ];
  
  const today = new Date();
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayIndex = date.getDay();
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    const condition = conditions[conditionIndex];
    
    // Sunrise gets slightly later, sunset gets slightly earlier
    const sunriseMinutes = 392 + i; // Start at 6:32 AM
    const sunsetMinutes = 1128 - i; // Start at 6:48 PM
    
    const sunriseHour = Math.floor(sunriseMinutes / 60);
    const sunriseMin = sunriseMinutes % 60;
    const sunsetHour = Math.floor(sunsetMinutes / 60);
    const sunsetMin = sunsetMinutes % 60;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: days[dayIndex],
      high: Math.floor(70 + Math.random() * 20),
      low: Math.floor(50 + Math.random() * 15),
      condition: condition.name,
      icon: condition.icon,
      sunrise: `${sunriseHour}:${sunriseMin.toString().padStart(2, '0')} AM`,
      sunset: `${sunsetHour - 12}:${sunsetMin.toString().padStart(2, '0')} PM`
    };
  });
};
