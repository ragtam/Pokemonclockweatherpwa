import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sunrise, Sunset, MapPin } from 'lucide-react';
import { PikachuCharacter } from './PikachuCharacter';
import { WeatherIcon } from './WeatherIcon';
import { CurrentWeather } from '../services/weatherService';

interface ClockViewProps {
  weather: CurrentWeather | null;
}

export function ClockView({ weather }: ClockViewProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  if (!weather) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <p className="text-white text-xl">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-3 lg:p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
      <div className="w-full h-full flex flex-row items-center justify-between gap-3 lg:gap-6 max-w-7xl">
        {/* Left Side: Clock and Pikachu */}
        <div className="flex flex-col items-center justify-center flex-1 min-w-0">
          {/* Floating Pikachu */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mb-2"
          >
            <PikachuCharacter size="medium" />
          </motion.div>

          {/* Clock Display - 24h format, larger size */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-0.5 lg:gap-1">
              <span className="text-7xl lg:text-9xl font-bold text-white drop-shadow-2xl tabular-nums">
                {hours.toString().padStart(2, '0')}
              </span>
              <span className="text-7xl lg:text-9xl font-bold text-white drop-shadow-2xl animate-pulse">
                :
              </span>
              <span className="text-7xl lg:text-9xl font-bold text-white drop-shadow-2xl tabular-nums">
                {minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-xl lg:text-2xl text-white/80 font-medium tabular-nums mt-1">
              {seconds.toString().padStart(2, '0')}
            </div>
            {/* Date Display */}
            <div className="mt-2 text-white/80 text-sm lg:text-base font-medium">
              {time.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Current Weather */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-5 border-2 lg:border-3 border-white/30 shadow-2xl flex-1 max-w-md min-w-0"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-white min-w-0">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="text-base lg:text-lg font-semibold truncate">{weather.location}</span>
            </div>
            <WeatherIcon condition={weather.icon} size={44} />
          </div>

          <div className="text-center mb-3">
            <div className="text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              {weather.temp}°C
            </div>
            <div className="text-lg lg:text-xl text-white/90 mt-1">
              {weather.condition}
            </div>
          </div>

          <div className="flex justify-around pt-3 border-t-2 border-white/30">
            <div className="flex items-center gap-1.5 text-white">
              <Sunrise size={18} className="text-yellow-300 flex-shrink-0" />
              <div>
                <div className="text-xs text-white/70">Sunrise</div>
                <div className="text-sm lg:text-base font-semibold">{weather.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Sunset size={18} className="text-orange-300 flex-shrink-0" />
              <div>
                <div className="text-xs text-white/70">Sunset</div>
                <div className="text-sm lg:text-base font-semibold">{weather.sunset}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}