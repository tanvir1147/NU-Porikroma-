'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFTestPage() {
  // Sample PDF URL for testing (you can replace with any NU PDF URL)
  const testPdfUrl = "https://www.nu.ac.bd/uploads/notice/pub_date_01112025.pdf";
  const testTitle = "Test NU Notice - November 2025";

  const handleViewPDF = async (pdfUrl: string, title: string) => {
    try {
      // Direct PDF viewing - opens immediately without delay
      const newWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=900');
      
      if (newWindow) {
        // Set the PDF URL directly for immediate viewing
        newWindow.location.href = pdfUrl;
        toast.success('PDF opened for viewing');
      } else {
        // Fallback if popup is blocked
        const tempLink = document.createElement('a');
        tempLink.href = pdfUrl;
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        toast.success('PDF opened (allow popups for better experience)');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  const handleDownloadPDF = async (pdfUrl: string, title: string) => {
    try {
      toast.info(`Downloading: ${title.substring(0, 30)}...`);
      
      // Use download API for better compatibility on all devices
      const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
      const fileName = `${title.substring(0, 50).replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, '') || 'NU_Notice'}.pdf`;
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('PDF download started');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Fallback: direct link
      try {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = pdfUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        fallbackLink.download = `${title.substring(0, 50).replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, '') || 'NU_Notice'}.pdf`;
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        
        toast.info('Download started (direct link)');
      } catch (fallbackError) {
        toast.error('Failed to download PDF');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          PDF Functionality Test
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Test PDF Functions</h2>
          <p className="text-white/80 mb-6">
            Test the View and Download functionality with a sample NU PDF:
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-white mb-2">{testTitle}</h3>
            <p className="text-white/60 text-sm mb-4">Sample PDF URL: {testPdfUrl}</p>
            
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => handleViewPDF(testPdfUrl, testTitle)}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View PDF
              </Button>
              
              <Button
                onClick={() => handleDownloadPDF(testPdfUrl, testTitle)}
                variant="outline"
                className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-300 mb-2">✅ Expected Behavior:</h3>
          <ul className="text-green-100 space-y-2 text-sm">
            <li><strong>View PDF:</strong> Opens PDF in a new tab with custom viewer</li>
            <li><strong>Download PDF:</strong> Downloads the PDF file to your device</li>
            <li><strong>Mobile:</strong> Both functions work on mobile devices</li>
            <li><strong>Desktop:</strong> Both functions work on desktop browsers</li>
            <li><strong>No URL changes:</strong> Current page stays the same</li>
          </ul>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">🧪 Test Instructions:</h3>
          <ol className="text-blue-100 space-y-2 text-sm">
            <li>1. Click "View PDF" - Should open PDF viewer in new tab</li>
            <li>2. Click "Download PDF" - Should download the PDF file</li>
            <li>3. Test on both mobile and desktop if possible</li>
            <li>4. Check that current page URL doesn't change</li>
            <li>5. Verify PDF viewer shows the document properly</li>
          </ol>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}