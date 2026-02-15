import { useEffect, useState } from 'react';
import { Maximize, Info } from 'lucide-react';
import { SwipeableViews } from './components/SwipeableViews';
import { ClockView } from './components/ClockView';
import { ForecastView } from './components/ForecastView';
import { PikachuView } from './components/PikachuView';
import { LoadingScreen } from './components/LoadingScreen';
import { useWakeLock } from './hooks/useWakeLock';
import { getMockCurrentWeather, getMock7DayForecast } from './utils/mockWeatherData';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(getMockCurrentWeather());
  const [forecast, setForecast] = useState(getMock7DayForecast());
  const [showInfo, setShowInfo] = useState(true);
  const [currentView, setCurrentView] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isSupported: wakeLockSupported, isActive: wakeLockActive, error: wakeLockError, requestWakeLock } = useWakeLock();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Request Wake Lock on first user interaction
  const handleUserInteraction = () => {
    if (!hasInteracted && wakeLockSupported) {
      setHasInteracted(true);
      requestWakeLock();
    }
  };

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Hide loading screen after a short delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Hide info message after 5 seconds
    const infoTimer = setTimeout(() => {
      setShowInfo(false);
    }, 5000);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentView > 0) {
        setCurrentView(currentView - 1);
      } else if (e.key === 'ArrowRight' && currentView < 2) {
        setCurrentView(currentView + 1);
      } else if (e.key === 'f' || e.key === 'F') {
        requestFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(infoTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentView]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
    
    // Request Wake Lock when entering fullscreen
    handleUserInteraction();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" onClick={handleUserInteraction}>
      {/* Fullscreen Button */}
      <button
        onClick={requestFullscreen}
        className="fixed top-2 right-2 z-50 bg-white/20 backdrop-blur-lg p-2 rounded-full border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all"
        aria-label="Enter fullscreen"
      >
        <Maximize size={20} className="text-white" />
      </button>

      {/* Info Banner */}
      {showInfo && (
        <div className="fixed top-2 left-2 right-16 z-40 bg-blue-600/90 backdrop-blur-lg p-3 rounded-xl border-2 border-white/30 shadow-xl">
          <div className="flex items-start gap-2">
            <Info size={20} className="text-white flex-shrink-0 mt-0.5" />
            <div className="text-white">
              <p className="font-semibold text-sm mb-0.5">Pokemon Weather Clock! ⚡</p>
              <p className="text-xs text-white/90">
                Swipe left/right to navigate • {wakeLockActive ? 'Screen will stay awake ✓' : wakeLockSupported ? 'Tap to activate screen wake' : 'Wake Lock not supported'}
                {wakeLockError && <span className="block text-xs mt-1 text-yellow-300">Note: {wakeLockError}</span>}
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-white/80 hover:text-white ml-auto text-lg leading-none"
              aria-label="Close info"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Swipeable Views */}
      <SwipeableViews onViewChange={setCurrentView}>
        <ClockView weather={currentWeather} />
        <ForecastView forecast={forecast} />
        <PikachuView />
      </SwipeableViews>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
    </div>
  );
}