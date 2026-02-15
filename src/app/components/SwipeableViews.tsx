import { useState, useRef, ReactNode } from 'react';
import { motion, PanInfo } from 'motion/react';

interface SwipeableViewsProps {
  children: ReactNode[];
  onViewChange?: (index: number) => void;
}

export function SwipeableViews({ children, onViewChange }: SwipeableViewsProps) {
  const [currentView, setCurrentView] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeView = (newView: number) => {
    if (newView >= 0 && newView < children.length) {
      setCurrentView(newView);
      onViewChange?.(newView);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50; // Minimum swipe distance
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Check velocity for quick swipes
    if (Math.abs(velocity) > 300) {
      if (velocity < 0 && currentView < children.length - 1) {
        changeView(currentView + 1);
      } else if (velocity > 0 && currentView > 0) {
        changeView(currentView - 1);
      }
    }
    // Check offset for slower swipes
    else if (offset < -threshold && currentView < children.length - 1) {
      changeView(currentView + 1);
    } else if (offset > threshold && currentView > 0) {
      changeView(currentView - 1);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden" ref={containerRef}>
      {/* Views Container */}
      <motion.div
        className="flex h-full w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentView * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="h-full w-screen flex-shrink-0"
          >
            {child}
          </div>
        ))}
      </motion.div>

      {/* Page Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => changeView(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentView
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50'
            }`}
            aria-label={`Go to view ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}