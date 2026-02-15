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
    <div className="h-full w-full bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 p-4 lg:p-6 flex flex-col">
      {/* Header with Pikachu */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
          7-Day Forecast
        </h2>
        <PikachuCharacter size="small" />
      </motion.div>

      {/* Forecast Cards - Horizontal Scrollable Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 h-full pb-8">
          {forecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white/25 backdrop-blur-lg rounded-2xl p-3 lg:p-4 border-3 border-white/30 shadow-xl flex-shrink-0 w-40 lg:w-44 flex flex-col justify-between"
            >
              <div>
                <div className="text-center mb-3">
                  <div className="text-xl lg:text-2xl font-bold text-white">
                    {day.dayName}
                  </div>
                  <div className="text-sm text-white/80">
                    {day.date}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mb-3">
                  <WeatherIcon condition={day.icon} size={44} />
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-white">
                      {day.high}°
                    </div>
                    <div className="text-lg text-white/70">
                      {day.low}°
                    </div>
                  </div>
                </div>

                <div className="text-base lg:text-lg text-white/90 text-center mb-3">
                  {day.condition}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t-2 border-white/20">
                <div className="flex items-center gap-2 text-white justify-center">
                  <Sunrise size={18} className="text-yellow-200" />
                  <div className="text-sm font-semibold">{day.sunrise}</div>
                </div>
                <div className="flex items-center gap-2 text-white justify-center">
                  <Sunset size={18} className="text-orange-200" />
                  <div className="text-sm font-semibold">{day.sunset}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}