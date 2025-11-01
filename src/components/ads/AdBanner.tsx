'use client';

import AdSense from './AdSense';

interface AdBannerProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  className?: string;
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  // Different ad slots for different positions
  const adSlots = {
    top: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || '1234567890',
    middle: process.env.NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT || '1234567891',
    bottom: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || '1234567892',
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || '1234567893'
  };

  const adFormats = {
    top: 'horizontal' as const,
    middle: 'rectangle' as const,
    bottom: 'horizontal' as const,
    sidebar: 'vertical' as const
  };

  return (
    <div className={`ad-banner ad-${position} ${className}`}>
      <div className="text-center text-xs text-white/50 mb-2">Advertisement</div>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <AdSense
          adSlot={adSlots[position]}
          adFormat={adFormats[position]}
          className="w-full"
        />
      </div>
    </div>
  );
}