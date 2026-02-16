import { motion } from 'motion/react';
import { PikachuCharacter } from './PikachuCharacter';
import { MapPin } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading weather data...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 flex flex-col items-center justify-center z-50 overflow-hidden">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mb-6"
      >
        <PikachuCharacter size="large" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/30 backdrop-blur-lg rounded-2xl px-8 py-4 border-3 border-white/40 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-white" size={24} />
          <p className="text-2xl font-bold text-white">
            {message}
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white/80 text-sm text-center px-4"
      >
        Getting your location and weather info...
      </motion.p>
    </div>
  );
}