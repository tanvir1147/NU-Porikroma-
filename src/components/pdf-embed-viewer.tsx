'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PdfEmbedViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function PdfEmbedViewer({ pdfUrl, title, onClose }: PdfEmbedViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [viewerOption, setViewerOption] = useState(0);

  const viewerOptions = [
    { name: 'Direct View', url: pdfUrl },
    { name: 'Google Docs', url: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` },
    { name: 'PDF Drive', url: `https://r.jina.ai/http://${pdfUrl.replace(/^https?:\/\//, '')}` }
  ];

  useEffect(() => {
    setEmbedUrl(viewerOptions[viewerOption].url);
    setIsLoading(true);
    setHasError(false);
    
    // Set a timeout for PDF loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [pdfUrl, viewerOption]);

  const handleDownload = async () => {
    try {
      const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${title.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_').substring(0, 50)}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleOpenNewTab = () => {
    const redirectUrl = `/api/pdf/redirect?url=${encodeURIComponent(pdfUrl)}`;
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              PDF Document Viewer
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-4 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                PDF Loading Failed
              </h4>
              <p className="text-gray-600 mb-4">
                The PDF couldn't be loaded. This might be due to server restrictions or the file being temporarily unavailable.
              </p>
              
              {/* Viewer Options */}
              <div className="flex flex-wrap gap-2 mb-6">
                {viewerOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={viewerOption === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setViewerOption(index);
                      setHasError(false);
                      setIsLoading(true);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleOpenNewTab} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
                <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Tip: Downloading the PDF is often more reliable than viewing it directly.
              </p>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg border border-gray-200"
              title={title}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              If the PDF doesn't display correctly, try switching viewers:
            </div>
            <div className="flex gap-2">
              {viewerOptions.map((option, index) => (
                <Button
                  key={index}
                  variant={viewerOption === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setViewerOption(index);
                    setHasError(false);
                    setIsLoading(true);
                  }}
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleOpenNewTab} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}