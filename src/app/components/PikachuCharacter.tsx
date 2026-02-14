import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface PikachuCharacterProps {
  size?: 'small' | 'medium' | 'large';
}

const pikachuPoses = [
  // Pose 1: Happy Pikachu
  {
    body: 'M50 30 Q40 25 35 35 L35 55 Q35 65 45 65 L55 65 Q65 65 65 55 L65 35 Q60 25 50 30 Z',
    leftEar: 'M35 35 L30 15 L40 25 Z',
    rightEar: 'M65 35 L70 15 L60 25 Z',
    leftArm: 'M35 45 L25 50 Q20 52 22 55 L35 50 Z',
    rightArm: 'M65 45 L75 50 Q80 52 78 55 L65 50 Z',
    tail: 'M60 63 L75 70 L80 60 L75 55 Z',
    cheeks: [{ cx: 40, cy: 48 }, { cx: 60, cy: 48 }],
    eyes: [{ cx: 42, cy: 42 }, { cx: 58, cy: 42 }],
    mouth: 'M45 52 Q50 54 55 52'
  },
  // Pose 2: Waving Pikachu
  {
    body: 'M50 30 Q40 25 35 35 L35 55 Q35 65 45 65 L55 65 Q65 65 65 55 L65 35 Q60 25 50 30 Z',
    leftEar: 'M35 35 L28 12 L38 23 Z',
    rightEar: 'M65 35 L72 12 L62 23 Z',
    leftArm: 'M35 45 L25 50 Q20 52 22 55 L35 50 Z',
    rightArm: 'M65 40 L75 25 Q78 20 80 22 L70 35 Z',
    tail: 'M60 63 L78 68 L85 58 L78 53 Z',
    cheeks: [{ cx: 40, cy: 48 }, { cx: 60, cy: 48 }],
    eyes: [{ cx: 42, cy: 42 }, { cx: 58, cy: 42 }],
    mouth: 'M46 52 Q50 55 54 52'
  },
  // Pose 3: Excited Pikachu
  {
    body: 'M50 32 Q40 27 35 37 L35 55 Q35 64 45 64 L55 64 Q65 64 65 55 L65 37 Q60 27 50 32 Z',
    leftEar: 'M36 37 L32 18 L42 28 Z',
    rightEar: 'M64 37 L68 18 L58 28 Z',
    leftArm: 'M36 42 L22 38 Q18 37 19 40 L33 44 Z',
    rightArm: 'M64 42 L78 38 Q82 37 81 40 L67 44 Z',
    tail: 'M58 62 L72 75 L80 68 L75 60 Z',
    cheeks: [{ cx: 40, cy: 48 }, { cx: 60, cy: 48 }],
    eyes: [{ cx: 41, cy: 43 }, { cx: 59, cy: 43 }],
    mouth: 'M43 52 Q50 56 57 52'
  },
  // Pose 4: Sitting Pikachu
  {
    body: 'M50 35 Q42 30 37 38 L37 58 Q37 66 46 66 L54 66 Q63 66 63 58 L63 38 Q58 30 50 35 Z',
    leftEar: 'M37 38 L33 20 L43 30 Z',
    rightEar: 'M63 38 L67 20 L57 30 Z',
    leftArm: 'M37 50 L30 58 Q28 62 31 63 L38 55 Z',
    rightArm: 'M63 50 L70 58 Q72 62 69 63 L62 55 Z',
    tail: 'M56 64 L68 72 L75 65 L70 58 Z',
    cheeks: [{ cx: 41, cy: 50 }, { cx: 59, cy: 50 }],
    eyes: [{ cx: 43, cy: 44 }, { cx: 57, cy: 44 }],
    mouth: 'M46 54 Q50 56 54 54'
  }
];

export function PikachuCharacter({ size = 'medium' }: PikachuCharacterProps) {
  const [currentPose, setCurrentPose] = useState(0);
  const [blinkState, setBlinkState] = useState(false);

  useEffect(() => {
    // Change pose every minute
    const poseInterval = setInterval(() => {
      setCurrentPose((prev) => (prev + 1) % pikachuPoses.length);
    }, 60000); // 60 seconds

    // Blink animation every 3-5 seconds
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(poseInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  const pose = pikachuPoses[currentPose];
  
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 140
  };

  const dimensions = sizeMap[size];

  return (
    <motion.svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 100 80"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      key={currentPose}
    >
      {/* Tail */}
      <motion.path
        d={pose.tail}
        fill="#B8860B"
        stroke="#000"
        strokeWidth="1.5"
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        style={{ transformOrigin: '60px 60px' }}
      />
      
      {/* Body */}
      <path
        d={pose.body}
        fill="#FFDE00"
        stroke="#000"
        strokeWidth="2"
      />
      
      {/* Left Ear */}
      <path
        d={pose.leftEar}
        fill="#FFDE00"
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M32 22 L30 15 L35 20 Z"
        fill="#000"
      />
      
      {/* Right Ear */}
      <path
        d={pose.rightEar}
        fill="#FFDE00"
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M68 22 L70 15 L65 20 Z"
        fill="#000"
      />
      
      {/* Left Arm */}
      <path
        d={pose.leftArm}
        fill="#FFDE00"
        stroke="#000"
        strokeWidth="1.5"
      />
      
      {/* Right Arm */}
      <path
        d={pose.rightArm}
        fill="#FFDE00"
        stroke="#000"
        strokeWidth="1.5"
      />
      
      {/* Eyes */}
      {pose.eyes.map((eye, index) => (
        <circle
          key={`eye-${index}`}
          cx={eye.cx}
          cy={eye.cy}
          r="2.5"
          fill="#000"
          opacity={blinkState ? 0 : 1}
        />
      ))}
      
      {/* Cheeks */}
      {pose.cheeks.map((cheek, index) => (
        <circle
          key={`cheek-${index}`}
          cx={cheek.cx}
          cy={cheek.cy}
          r="4"
          fill="#FF6B6B"
          opacity="0.8"
        />
      ))}
      
      {/* Mouth */}
      <path
        d={pose.mouth}
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Nose */}
      <circle cx="50" cy="48" r="1" fill="#000" />
    </motion.svg>
  );
}