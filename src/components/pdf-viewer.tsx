'use client';

import { useState } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function PdfViewer({ pdfUrl, title, onClose }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const viewUrl = `/api/pdf/view?url=${encodeURIComponent(pdfUrl)}`;
  const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. You can try downloading it instead.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/10 backdrop-blur-md border-white/20 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl shadow-cyan-400/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border-white/20 flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg truncate">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <a
              href={downloadUrl}
              download
              className="p-3 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/20"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/20"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative overflow-hidden rounded-b-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-400/30 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-white/80 mt-4 font-medium">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
              <div className="text-center p-8 max-w-md">
                <div className="text-red-400 mb-4">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-white/10 backdrop-blur-md border-red-400/30 flex items-center justify-center">
                    <X className="h-8 w-8" />
                  </div>
                </div>
                <p className="text-white/90 mb-6">{error}</p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border-white/20 text-white rounded-xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-cyan-400/30"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Instead
                </a>
              </div>
            </div>
          )}

          <iframe
            src={viewUrl}
            className="w-full h-full border-0 bg-white/5"
            onLoad={handleLoad}
            onError={handleError}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}