'use client';

import Script from 'next/script';

// AdSense Script Component for Auto Ads
export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXXX') {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

// Simple component to show AdSense is enabled
export default function AdSense() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXXX') {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          AdSense not configured
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
      <p className="text-white/50 text-xs">
        Google Auto Ads Enabled
      </p>
      <p className="text-white/30 text-xs mt-1">
        Ads will appear automatically in optimal positions
      </p>
    </div>
  );
}