import { useEffect, useState } from 'react';
import { Maximize, Info, MapPin } from 'lucide-react';
import { SwipeableViews } from './components/SwipeableViews';
import { ClockView } from './components/ClockView';
import { ForecastView } from './components/ForecastView';
import { PikachuView } from './components/PikachuView';
import { LoadingScreen } from './components/LoadingScreen';
import { useWakeLock } from './hooks/useWakeLock';
import { getWeatherForCurrentLocation, CurrentWeather, DailyForecast } from './services/weatherService';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [showInfo, setShowInfo] = useState(true);
  const [currentView, setCurrentView] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const { isSupported: wakeLockSupported, isActive: wakeLockActive, error: wakeLockError, requestWakeLock } = useWakeLock();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Request Wake Lock on first user interaction
  const handleUserInteraction = () => {
    if (!hasInteracted && wakeLockSupported) {
      setHasInteracted(true);
      // Request wake lock asynchronously without blocking
      setTimeout(() => {
        try {
          requestWakeLock();
        } catch (err) {
          // Silently ignore wake lock errors
          console.log('Wake lock request ignored due to environment restrictions');
        }
      }, 0);
    }
  };

  useEffect(() => {
    // Fetch weather data
    const loadWeatherData = async () => {
      try {
        setIsLoading(true);
        console.log('🌍 Fetching weather data...');
        const data = await getWeatherForCurrentLocation();
        console.log('✅ Weather data loaded successfully:', data.current.location);
        setCurrentWeather(data.current);
        setForecast(data.forecast);
        setWeatherError(null);
      } catch (error) {
        console.error('❌ Failed to load weather data:', error);
        setWeatherError('Unable to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/Pokemonclockweatherpwa/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('⚠️  Service Worker registration failed:', error);
        });
    }

    // Hide info message after 8 seconds
    const infoTimer = setTimeout(() => {
      setShowInfo(false);
    }, 8000);

    return () => {
      clearTimeout(infoTimer);
    };
  }, []);

  // Refresh weather data when currentView changes (optional)
  useEffect(() => {
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const requestFullscreen = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          console.log('Fullscreen request failed or not supported');
        });
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
      
      // Request Wake Lock asynchronously after fullscreen attempt
      setTimeout(() => {
        handleUserInteraction();
      }, 100);
    } catch (err) {
      console.log('Fullscreen error:', err);
    }
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