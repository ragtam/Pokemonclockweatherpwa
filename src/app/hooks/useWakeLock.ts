import { useEffect, useState, useRef } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldKeepAwake, setShouldKeepAwake] = useState(false);
  const retryTimeoutRef = useRef<number | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported');
      setError('Wake Lock not supported in this browser');
      return false;
    }

    // Check if document is visible
    if (document.visibilityState !== 'visible') {
      console.log('Document not visible, skipping Wake Lock request');
      return false;
    }

    // Don't request if we already have an active lock
    if (wakeLock && isActive) {
      console.log('Wake Lock already active');
      return true;
    }

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);
      setError(null);
      console.log('✅ Wake Lock activated - screen will stay on');

      lock.addEventListener('release', () => {
        console.log('⚠️ Wake Lock released - will retry in 2s');
        setWakeLock(null);
        setIsActive(false);
        
        // Automatically retry after a short delay if we should keep awake
        if (shouldKeepAwake) {
          retryTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Retrying Wake Lock request...');
            requestWakeLock();
          }, 2000);
        }
      });

      return true;
    } catch (err: any) {
      const errorMessage = err?.name || 'Unknown error';
      
      // Don't log these as errors if blocked by permissions policy
      if (errorMessage === 'NotAllowedError') {
        console.log('Wake Lock blocked by browser policy or permissions - this is normal in iframe environments');
        setError(null);
      } else if (errorMessage === 'NotSupportedError') {
        console.log('Wake Lock not supported');
        setError('Wake Lock not supported');
      } else {
        console.log(`Wake Lock request failed: ${errorMessage}`);
        setError(null);
      }
      
      return false;
    }
  };

  const releaseWakeLock = async () => {
    setShouldKeepAwake(false);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        console.log('Wake Lock manually released');
      } catch (err) {
        console.error('Failed to release Wake Lock:', err);
      }
    }
  };

  const enableWakeLock = async () => {
    setShouldKeepAwake(true);
    const success = await requestWakeLock();
    
    // Set up periodic check to ensure wake lock stays active
    if (success && !keepAliveIntervalRef.current) {
      keepAliveIntervalRef.current = setInterval(() => {
        if (!wakeLock || !isActive) {
          console.log('🔄 Wake Lock lost, re-requesting...');
          requestWakeLock();
        }
      }, 30000); // Check every 30 seconds
    }
  };

  useEffect(() => {
    // Re-request wake lock when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldKeepAwake) {
        console.log('📱 Page visible, ensuring Wake Lock is active');
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [shouldKeepAwake]);

  return { wakeLock, isSupported, isActive, error, requestWakeLock, releaseWakeLock, enableWakeLock };
};