'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Eye, AlertCircle } from 'lucide-react';

interface PDFHelpProps {
  pdfUrl: string;
  title: string;
}

export function PDFHelp({ pdfUrl, title }: PDFHelpProps) {
  const handleOpenDirect = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleDocs = () => {
    const googleUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenPDFjs = () => {
    const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
    window.open(pdfJsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <CardTitle className="text-white">PDF Viewing Options</CardTitle>
        </div>
        <CardDescription className="text-white/70">
          The PDF cannot be displayed directly. Try these alternative viewing methods:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleOpenGoogleDocs}
          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          Open with Google Docs Viewer (Recommended)
        </Button>
        
        <Button 
          onClick={handleOpenPDFjs}
          className="w-full justify-start bg-red-600 hover:bg-red-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open with PDF.js Viewer
        </Button>
        
        <Button 
          onClick={handleOpenDirect}
          className="w-full justify-start bg-gray-600 hover:bg-gray-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Direct Link
        </Button>
        
        <Button 
          onClick={handleDownload}
          className="w-full justify-start bg-green-600 hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        
        <div className="text-sm text-white/60 mt-4 p-3 bg-white/5 rounded-lg">
          <strong>Note:</strong> NU website PDFs are often protected and may not display directly in browsers. 
          The Google Docs viewer usually works best for these files.
        </div>
      </CardContent>
    </Card>
  );
}