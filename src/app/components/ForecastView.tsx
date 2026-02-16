import { motion } from 'motion/react';
import { Sunrise, Sunset } from 'lucide-react';
import { PikachuCharacter } from './PikachuCharacter';
import { WeatherIcon } from './WeatherIcon';
import { DailyForecast } from '../services/weatherService';
import { useState, useEffect } from 'react';

interface ForecastViewProps {
  forecast: DailyForecast[];
}

export function ForecastView({ forecast }: ForecastViewProps) {
  const [visibleDays, setVisibleDays] = useState(7);

  useEffect(() => {
    const updateVisibleDays = () => {
      const width = window.innerWidth;
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      
      // Determine how many days to show based on screen size
      if (isLandscape && width < 700) {
        setVisibleDays(3); // Small mobile landscape
      } else if (isLandscape && width < 900) {
        setVisibleDays(5); // Medium mobile landscape
      } else if (width < 600) {
        setVisibleDays(3); // Small mobile portrait
      } else {
        setVisibleDays(7); // Desktop or large screens
      }
    };

    updateVisibleDays();
    window.addEventListener('resize', updateVisibleDays);
    window.addEventListener('orientationchange', updateVisibleDays);

    return () => {
      window.removeEventListener('resize', updateVisibleDays);
      window.removeEventListener('orientationchange', updateVisibleDays);
    };
  }, []);

  const displayForecast = forecast.slice(0, visibleDays);

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 p-3 lg:p-4 flex flex-col overflow-hidden">
      {/* Header with Pikachu */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-3 flex-shrink-0"
      >
        <h2 className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
          {visibleDays}-Day Forecast
        </h2>
        <PikachuCharacter size="small" />
      </motion.div>

      {/* Forecast Cards - Full Width Grid */}
      <div className="flex-1 overflow-hidden min-h-0 mb-4">
        <div className="h-full flex gap-2 lg:gap-3">
          {displayForecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.06 }}
              className="bg-white/25 backdrop-blur-lg rounded-xl lg:rounded-2xl p-2 lg:p-3 border-2 lg:border-3 border-white/30 shadow-xl flex-1 flex flex-col justify-between min-w-0 overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="text-center mb-2 flex-shrink-0">
                  <div className="text-lg lg:text-xl font-bold text-white truncate">
                    {day.dayName}
                  </div>
                  <div className="text-xs lg:text-sm text-white/80 truncate">
                    {day.date}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 lg:gap-2 mb-2 flex-shrink-0">
                  <WeatherIcon condition={day.icon} size={36} />
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      {day.high}°
                    </div>
                    <div className="text-base lg:text-lg text-white/70">
                      {day.low}°
                    </div>
                  </div>
                </div>

                <div className="text-sm lg:text-base text-white/90 text-center mb-2 flex-shrink-0 line-clamp-1">
                  {day.condition}
                </div>

                <div className="space-y-1 pt-2 border-t-2 border-white/20 flex-shrink-0 mt-auto">
                  <div className="flex items-center gap-1 text-white justify-center">
                    <Sunrise size={14} className="text-yellow-200 flex-shrink-0" />
                    <div className="text-xs lg:text-sm font-semibold truncate">{day.sunrise}</div>
                  </div>
                  <div className="flex items-center gap-1 text-white justify-center">
                    <Sunset size={14} className="text-orange-200 flex-shrink-0" />
                    <div className="text-xs lg:text-sm font-semibold truncate">{day.sunset}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}