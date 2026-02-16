import { useEffect, useState, useRef } from 'react';
import { Maximize, Info } from 'lucide-react';
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
  const { isSupported: wakeLockSupported, isActive: wakeLockActive, error: wakeLockError, enableWakeLock } = useWakeLock();
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Request Wake Lock on first user interaction
  const handleUserInteraction = () => {
    if (!hasInteracted && wakeLockSupported) {
      setHasInteracted(true);
      console.log('🎯 User interaction detected, enabling persistent wake lock');
      // Enable persistent wake lock with auto-retry
      enableWakeLock().catch(() => {
        console.log('Wake lock initial request failed, will retry automatically');
      });
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
      } catch (error) {
        console.error('❌ Failed to load weather data:', error);
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

  // Listen for multiple user interaction events to activate wake lock ASAP
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'touchmove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [hasInteracted, wakeLockSupported]);

  // Scroll to view function
  const scrollToView = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetScroll = index * container.offsetWidth;
      container.scrollTo({
        left: targetScroll,
        behavior: 'auto'
      });
    }
  };

  // Update current view based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      const newView = Math.round(scrollLeft / width);
      if (newView !== currentView) {
        setCurrentView(newView);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentView > 0) {
        scrollToView(currentView - 1);
      } else if (e.key === 'ArrowRight' && currentView < 2) {
        scrollToView(currentView + 1);
      } else if (e.key === 'f' || e.key === 'F') {
        requestFullscreen();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
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
      
      // Ensure Wake Lock is active after fullscreen
      handleUserInteraction();
    } catch (err) {
      console.log('Fullscreen error:', err);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Info Banner */}
      {showInfo && (
        <div className="fixed top-2 left-2 right-16 z-40 bg-blue-600/90 backdrop-blur-lg p-3 rounded-xl border-2 border-white/30 shadow-xl">
          <div className="flex items-start gap-2">
            <Info size={20} className="text-white flex-shrink-0 mt-0.5" />
            <div className="text-white">
              <p className="font-semibold text-sm mb-0.5">Pokemon Weather Clock! ⚡</p>
              <p className="text-xs text-white/90">
                Scroll left/right to navigate • {(() => {
                  if (wakeLockActive) return '✅ Screen staying awake';
                  if (wakeLockSupported) return '⏳ Activating screen wake lock...';
                  return 'Wake Lock not supported';
                })()}
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

      {/* Native Scroll Views */}
      <div 
        ref={scrollContainerRef}
        className="relative h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory bg-blue-400"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex h-full w-[300vw]">
          <div className="h-full w-screen flex-shrink-0 snap-start snap-always overflow-hidden">
            <ClockView weather={currentWeather} />
          </div>
          <div className="h-full w-screen flex-shrink-0 snap-start snap-always overflow-hidden">
            <ForecastView forecast={forecast} />
          </div>
          <div className="h-full w-screen flex-shrink-0 snap-start snap-always overflow-hidden">
            <PikachuView />
          </div>
        </div>
      </div>

      {/* Page Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => scrollToView(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentView
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50'
            }`}
            aria-label={`Go to view ${index + 1}`}
          />
        ))}
      </div>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
    </div>
  );
}