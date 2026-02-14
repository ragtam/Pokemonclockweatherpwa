import { useState, useRef, ReactNode } from 'react';
import { motion, PanInfo } from 'motion/react';

interface SwipeableViewsProps {
  children: ReactNode[];
  onViewChange?: (index: number) => void;
}

export function SwipeableViews({ children, onViewChange }: SwipeableViewsProps) {
  const [currentView, setCurrentView] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeView = (newView: number) => {
    if (newView >= 0 && newView < children.length) {
      setCurrentView(newView);
      setDragOffset(0);
      onViewChange?.(newView);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 75; // Minimum swipe distance
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Check velocity for quick swipes
    if (Math.abs(velocity) > 500) {
      if (velocity < 0 && currentView < children.length - 1) {
        changeView(currentView + 1);
      } else if (velocity > 0 && currentView > 0) {
        changeView(currentView - 1);
      } else {
        setDragOffset(0);
      }
    }
    // Check offset for slower swipes
    else if (offset < -threshold && currentView < children.length - 1) {
      changeView(currentView + 1);
    } else if (offset > threshold && currentView > 0) {
      changeView(currentView - 1);
    } else {
      setDragOffset(0);
    }
  };

  const baseOffset = -currentView * 100;
  const totalOffset = baseOffset + (dragOffset / (containerRef.current?.offsetWidth || 1)) * 100;

  return (
    <div className="relative h-screen w-screen overflow-hidden" ref={containerRef}>
      {/* Views Container */}
      <motion.div
        className="flex h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => setDragOffset(info.offset.x)}
        animate={{ x: `${baseOffset}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: `${children.length * 100}%` }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="h-full flex-shrink-0"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </motion.div>

      {/* Page Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => changeView(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentView
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/50'
            }`}
            aria-label={`Go to view ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}