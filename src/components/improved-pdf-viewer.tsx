'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImprovedPdfViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function ImprovedPdfViewer({ pdfUrl, title, onClose }: ImprovedPdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth < 768;
    };

    setIsMobile(checkMobile());

    // Handle window resize
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async () => {
    try {
      toast.info('Starting download...');
      
      const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
      
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title.substring(0, 50).replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, '') || 'NU_Notice'}.pdf`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const handleOpenInNewTab = () => {
    // Use a more reliable method that doesn't affect current page history
    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.location.href = pdfUrl;
      toast.success('PDF opened in new tab');
    } else {
      toast.error('Popup blocked. Please allow popups for this site.');
    }
  };

  const handleOpenWithGoogleDocs = () => {
    const googleUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.location.href = googleUrl;
      toast.success('Opening with Google Docs viewer');
    } else {
      toast.error('Popup blocked. Please allow popups for this site.');
    }
  };

  const viewUrl = `/api/pdf/view?url=${encodeURIComponent(pdfUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PDF Document Viewer
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="hidden sm:flex"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              New Tab
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          {isMobile ? (
            // Mobile-optimized view
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Smartphone className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Mobile PDF Viewer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                For the best mobile experience, choose one of these options:
              </p>
              
              <div className="space-y-3 w-full max-w-sm">
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                
                <Button
                  onClick={handleOpenInNewTab}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open in Browser
                </Button>
                
                <Button
                  onClick={handleOpenWithGoogleDocs}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Monitor className="w-5 h-5 mr-2" />
                  Google Docs Viewer
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Tip: Download the PDF for offline viewing or better compatibility
              </p>
            </div>
          ) : (
            // Desktop embedded view
            <div className="relative w-full h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="text-center max-w-md">
                    <div className="text-red-500 mb-4">
                      <ExternalLink className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Cannot Display PDF
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      The PDF cannot be displayed in this viewer. Try these alternatives:
                    </p>
                    <div className="space-y-2">
                      <Button onClick={handleOpenInNewTab} className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button onClick={handleDownload} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <iframe
                src={viewUrl}
                className="w-full h-full border-0"
                title={title}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Failed to load PDF');
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile bottom actions */}
        {isMobile && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 sm:hidden">
            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleOpenInNewTab} variant="outline" className="flex-1" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}