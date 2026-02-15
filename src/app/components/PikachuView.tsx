import { motion } from 'motion/react';
import { PikachuCharacter } from './PikachuCharacter';
import { Sparkles } from 'lucide-react';

export function PikachuView() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 p-4 lg:p-6 relative overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl mb-1 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-200" size={32} />
          Pikachu Friends
          <Sparkles className="text-yellow-200" size={32} />
        </h2>
        <p className="text-lg lg:text-xl text-white/90">
          Keeping you company!
        </p>
      </motion.div>

      {/* Three Pikachus in a row - Optimized for horizontal */}
      <div className="flex items-center justify-center gap-4 lg:gap-6 mb-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-white/30 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 border-3 border-white/40 shadow-2xl"
        >
          <PikachuCharacter size="medium" />
          <div className="text-center mt-2 text-white font-bold text-lg">
            Happy
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="bg-white/30 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 border-3 border-white/40 shadow-2xl"
        >
          <PikachuCharacter size="medium" />
          <div className="text-center mt-2 text-white font-bold text-lg">
            Excited
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="bg-white/30 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 border-3 border-white/40 shadow-2xl"
        >
          <PikachuCharacter size="medium" />
          <div className="text-center mt-2 text-white font-bold text-lg">
            Cheerful
          </div>
        </motion.div>
      </div>

      {/* Fun message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border-3 border-white/30 shadow-xl"
      >
        <p className="text-2xl lg:text-3xl text-white font-bold text-center">
          ⚡ Pika Pika! ⚡
        </p>
      </motion.div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Sparkles className="text-yellow-200" size={20} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}