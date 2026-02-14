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
    <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      {/* Floating Pikachu */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-4 md:mb-8"
      >
        <PikachuCharacter size="large" />
      </motion.div>

      {/* Clock Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-4 md:mb-8"
      >
        <div className="flex items-end justify-center gap-1 md:gap-2 mb-2">
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-2xl tabular-nums">
            {displayHours.toString().padStart(2, '0')}
          </span>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-2xl animate-pulse">
            :
          </span>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-2xl tabular-nums">
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white/90 drop-shadow-lg mb-2 md:mb-4">
            {ampm}
          </span>
        </div>
        <div className="text-xl sm:text-2xl md:text-2xl lg:text-3xl text-white/80 font-medium tabular-nums">
          {seconds.toString().padStart(2, '0')}
        </div>
      </motion.div>

      {/* Current Weather */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/20 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border-3 md:border-4 border-white/30 shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={20} />
            <span className="text-lg md:text-xl font-semibold">{weather.location}</span>
          </div>
          <WeatherIcon condition={weather.icon} size={56} />
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
            {weather.temp}°
          </div>
          <div className="text-xl md:text-2xl text-white/90 mt-2">
            {weather.condition}
          </div>
        </div>

        <div className="flex justify-around pt-4 border-t-2 border-white/30">
          <div className="flex items-center gap-2 text-white">
            <Sunrise size={24} className="text-yellow-300" />
            <div>
              <div className="text-xs text-white/70">Sunrise</div>
              <div className="text-lg font-semibold">{weather.sunrise}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Sunset size={24} className="text-orange-300" />
            <div>
              <div className="text-xs text-white/70">Sunset</div>
              <div className="text-lg font-semibold">{weather.sunset}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-white/80 text-xl md:text-2xl font-medium"
      >
        {time.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </motion.div>
    </div>
  );
}