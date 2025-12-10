'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { getTimeUntilExpiration } from '@/lib/token-utils';

interface TokenExpiryWarningProps {
  warningThreshold?: number; // Show warning when this many minutes remain (default: 5)
}

export function TokenExpiryWarning({ warningThreshold = 5 }: TokenExpiryWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = auth.getToken();
      if (!token) {
        setShowWarning(false);
        return;
      }

      try {
        const timeUntilExpiration = getTimeUntilExpiration(token);
        if (timeUntilExpiration === null) {
          setShowWarning(false);
          return;
        }

        const minutesRemaining = timeUntilExpiration / (60 * 1000);
        
        if (minutesRemaining <= warningThreshold && minutesRemaining > 0) {
          setShowWarning(true);
          setTimeRemaining(Math.ceil(minutesRemaining));
        } else {
          setShowWarning(false);
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        setShowWarning(false);
      }
    };

    // Check immediately
    checkToken();

    // Check every minute
    const interval = setInterval(checkToken, 60 * 1000);

    return () => clearInterval(interval);
  }, [warningThreshold]);

  if (!showWarning || !timeRemaining) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Oturum Süresi Uyarısı</p>
          <p className="text-sm">
            Oturumunuz {timeRemaining} dakika içinde sona erecek.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-white hover:text-gray-200 text-xl font-bold"
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

