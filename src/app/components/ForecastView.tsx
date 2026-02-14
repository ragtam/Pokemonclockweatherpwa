import { motion } from 'motion/react';
import { Sunrise, Sunset } from 'lucide-react';
import { PikachuCharacter } from './PikachuCharacter';
import { WeatherIcon } from './WeatherIcon';
import { DailyForecast } from '../utils/mockWeatherData';

interface ForecastViewProps {
  forecast: DailyForecast[];
}

export function ForecastView({ forecast }: ForecastViewProps) {
  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 p-4 md:p-6">
      {/* Header with Pikachu */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          7-Day Forecast
        </h2>
        <PikachuCharacter size="small" />
      </motion.div>

      {/* Forecast Cards */}
      <div className="space-y-3 md:space-y-4 pb-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/25 backdrop-blur-lg rounded-2xl p-4 md:p-5 border-3 border-white/30 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {day.dayName}
                </div>
                <div className="text-base md:text-lg text-white/80">
                  {day.date}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <WeatherIcon condition={day.icon} size={48} />
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {day.high}°
                  </div>
                  <div className="text-lg md:text-xl text-white/70">
                    {day.low}°
                  </div>
                </div>
              </div>
            </div>

            <div className="text-lg md:text-xl text-white/90 mb-3 text-center">
              {day.condition}
            </div>

            <div className="flex justify-around pt-3 border-t-2 border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Sunrise size={20} className="text-yellow-200" />
                <div>
                  <div className="text-xs text-white/60">Sunrise</div>
                  <div className="text-sm md:text-base font-semibold">{day.sunrise}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Sunset size={20} className="text-orange-200" />
                <div>
                  <div className="text-xs text-white/60">Sunset</div>
                  <div className="text-sm md:text-base font-semibold">{day.sunset}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
