import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sunrise, Sunset, MapPin } from 'lucide-react';
import { PikachuCharacter } from './PikachuCharacter';
import { WeatherIcon } from './WeatherIcon';
import { CurrentWeather } from '../utils/mockWeatherData';

interface ClockViewProps {
  weather: CurrentWeather;
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
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return (
    <div className="h-full w-full flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full h-full flex flex-row items-center justify-between gap-4 lg:gap-8 max-w-7xl">
        {/* Left Side: Clock and Pikachu */}
        <div className="flex flex-col items-center justify-center flex-1">
          {/* Floating Pikachu */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mb-3"
          >
            <PikachuCharacter size="medium" />
          </motion.div>

          {/* Clock Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-end justify-center gap-1">
              <span className="text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl tabular-nums">
                {displayHours.toString().padStart(2, '0')}
              </span>
              <span className="text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl animate-pulse">
                :
              </span>
              <span className="text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl tabular-nums">
                {minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-3xl lg:text-4xl font-bold text-white/90 drop-shadow-lg mb-3">
                {ampm}
              </span>
            </div>
            <div className="text-xl lg:text-2xl text-white/80 font-medium tabular-nums mt-1">
              {seconds.toString().padStart(2, '0')}
            </div>
            {/* Date Display */}
            <div className="mt-3 text-white/80 text-base lg:text-lg font-medium">
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
          className="bg-white/20 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 lg:p-6 border-3 border-white/30 shadow-2xl flex-1 max-w-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white">
              <MapPin size={20} />
              <span className="text-lg lg:text-xl font-semibold">{weather.location}</span>
            </div>
            <WeatherIcon condition={weather.icon} size={48} />
          </div>

          <div className="text-center mb-4">
            <div className="text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
              {weather.temp}°
            </div>
            <div className="text-xl lg:text-2xl text-white/90 mt-2">
              {weather.condition}
            </div>
          </div>

          <div className="flex justify-around pt-4 border-t-2 border-white/30">
            <div className="flex items-center gap-2 text-white">
              <Sunrise size={22} className="text-yellow-300" />
              <div>
                <div className="text-xs text-white/70">Sunrise</div>
                <div className="text-base lg:text-lg font-semibold">{weather.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Sunset size={22} className="text-orange-300" />
              <div>
                <div className="text-xs text-white/70">Sunset</div>
                <div className="text-base lg:text-lg font-semibold">{weather.sunset}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}