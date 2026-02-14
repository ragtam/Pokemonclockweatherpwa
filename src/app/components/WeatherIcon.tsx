import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
}

export function WeatherIcon({ condition, size = 48 }: WeatherIconProps) {
  const iconProps = {
    size,
    className: "drop-shadow-lg"
  };

  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    case 'partly-cloudy':
    case 'partly cloudy':
      return <Cloud {...iconProps} className={`${iconProps.className} text-gray-300`} />;
    case 'cloudy':
    case 'overcast':
      return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    case 'rainy':
    case 'rain':
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-400`} />;
    case 'snowy':
    case 'snow':
      return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-200`} />;
    case 'thunderstorm':
    case 'storm':
      return <CloudLightning {...iconProps} className={`${iconProps.className} text-purple-400`} />;
    case 'drizzle':
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-300`} />;
    default:
      return <Cloud {...iconProps} className={`${iconProps.className} text-gray-300`} />;
  }
}
