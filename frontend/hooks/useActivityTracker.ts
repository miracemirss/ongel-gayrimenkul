import { useEffect, useRef } from 'react';
import { auth } from '@/lib/auth';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 dakika (3 dakika çok kısaydı)

export function useActivityTracker() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      return;
    }

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // 3 dakika işlem yapılmadı, oturumu sonlandır
        auth.logout();
      }, INACTIVITY_TIMEOUT);
    };

    // İlk timeout'u başlat
    resetTimeout();

    // Kullanıcı aktivitelerini dinle
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout, true);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, []);
}

