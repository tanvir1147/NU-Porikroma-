'use client';

interface AdBannerProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  className?: string;
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  // With Auto Ads, Google automatically places ads
  // These placeholders help reserve space for ads
  return (
    <div className={`ad-banner ad-${position} ${className} min-h-[100px]`}>
      <div className="text-center text-xs text-white/50 mb-2">Advertisement</div>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        {/* Google Auto Ads will automatically insert ads here */}
        <div className="text-center text-white/30 text-xs py-8">
          Ad space - Google Auto Ads enabled
        </div>
      </div>
    </div>
  );
}