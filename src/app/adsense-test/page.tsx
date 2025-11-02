'use client';

import AdBanner from '@/components/ads/AdBanner';

export default function AdSenseTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          AdSense Integration Test
        </h1>
        
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Banner Ad</h2>
            <AdBanner position="top" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Middle Banner Ad</h2>
            <AdBanner position="middle" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Bottom Banner Ad</h2>
            <AdBanner position="bottom" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Configuration Status</h2>
            <div className="text-white space-y-2">
              <p><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'Not configured'}</p>
              <p><strong>Top Slot:</strong> {process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || 'Not configured'}</p>
              <p><strong>Middle Slot:</strong> {process.env.NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT || 'Not configured'}</p>
              <p><strong>Bottom Slot:</strong> {process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || 'Not configured'}</p>
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Important Notes:</h3>
            <ul className="text-yellow-100 space-y-1 text-sm">
              <li>• Ads may take 24-48 hours to appear after setup</li>
              <li>• AdSense needs to approve your site first</li>
              <li>• Test ads won't show revenue</li>
              <li>• Use real ad unit IDs from your AdSense dashboard</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}