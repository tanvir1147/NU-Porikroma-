'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ''
}: AdSenseProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const loadAd = () => {
      try {
        // @ts-ignore
        if (window.adsbygoogle && window.adsbygoogle.loaded) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        } else {
          // Retry after a short delay if AdSense isn't loaded yet
          setTimeout(loadAd, 100);
        }
      } catch (err) {
        console.error('AdSense error:', err);
        setAdLoaded(true); // Set to true to hide loading state
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render if client ID is not set or is placeholder
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXXX') {
    return (
      <div className={`adsense-placeholder ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AdSense not configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      {!adLoaded && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Loading ad...</p>
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: adLoaded ? 'block' : 'none' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

// AdSense Script Component
export function AdSenseScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}