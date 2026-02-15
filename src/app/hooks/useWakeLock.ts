import { useEffect, useState } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported');
      setError('Wake Lock not supported in this browser');
      return;
    }

    // Check if document is visible
    if (document.visibilityState !== 'visible') {
      console.log('Document not visible, skipping Wake Lock request');
      return;
    }

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);
      setError(null);
      console.log('Wake Lock activated');

      lock.addEventListener('release', () => {
        console.log('Wake Lock released');
        setWakeLock(null);
        setIsActive(false);
      });
    } catch (err: any) {
      const errorMessage = err?.name || 'Unknown error';
      console.error('Wake Lock request failed:', err);
      
      // Handle specific error cases
      if (errorMessage === 'NotAllowedError') {
        setError('Wake Lock blocked by browser policy or permissions');
      } else if (errorMessage === 'NotSupportedError') {
        setError('Wake Lock not supported');
      } else {
        setError(`Wake Lock error: ${errorMessage}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
      } catch (err) {
        console.error('Failed to release Wake Lock:', err);
      }
    }
  };

  useEffect(() => {
    // Re-request wake lock when page becomes visible (only if it was active before)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLock) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isActive, wakeLock]);

  return { wakeLock, isSupported, isActive, error, requestWakeLock, releaseWakeLock };
};