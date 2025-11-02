import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'NU PDF Document';

  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
  }

  try {
    // Create a web-based PDF viewer using PDF.js
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: #1a1a1a;
            color: white;
            overflow: hidden;
        }
        .header {
            background: #2a2a2a;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
            flex-wrap: wrap;
            gap: 10px;
        }
        .title {
            font-size: 16px;
            font-weight: bold;
            flex: 1;
            min-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .btn:hover {
            background: #0284c7;
        }
        .btn-secondary {
            background: #6b7280;
        }
        .btn-secondary:hover {
            background: #4b5563;
        }
        .page-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #374151;
            padding: 5px 10px;
            border-radius: 6px;
        }
        .page-input {
            width: 50px;
            padding: 4px 6px;
            border: 1px solid #6b7280;
            border-radius: 4px;
            background: #1f2937;
            color: white;
            text-align: center;
        }
        .zoom-controls {
            display: flex;
            align-items: center;
            gap: 5px;
            background: #374151;
            padding: 5px;
            border-radius: 6px;
        }
        .zoom-btn {
            background: #4b5563;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .zoom-btn:hover {
            background: #6b7280;
        }
        .pdf-container {
            width: 100%;
            height: calc(100vh - 70px);
            overflow: auto;
            background: #2a2a2a;
            display: flex;
            justify-content: center;
            padding: 20px;
        }
        .pdf-viewer {
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 100%;
        }
        .pdf-page {
            margin-bottom: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            background: #2a2a2a;
            padding: 30px;
            border-radius: 10px;
        }
        .error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            background: #2a2a2a;
            padding: 30px;
            border-radius: 10px;
            max-width: 400px;
        }
        .error h3 {
            margin-bottom: 15px;
            color: #f59e0b;
        }
        .error-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        @media (max-width: 768px) {
            .header {
                padding: 8px 15px;
            }
            .title {
                font-size: 14px;
                min-width: 150px;
            }
            .btn {
                padding: 6px 12px;
                font-size: 12px;
            }
            .controls {
                width: 100%;
                justify-content: center;
            }
            .pdf-container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="controls">
            <div class="page-controls">
                <button class="zoom-btn" onclick="prevPage()">◀</button>
                <input type="number" id="pageInput" class="page-input" value="1" min="1" onchange="goToPage()">
                <span id="pageCount">/1</span>
                <button class="zoom-btn" onclick="nextPage()">▶</button>
            </div>
            <div class="zoom-controls">
                <button class="zoom-btn" onclick="zoomOut()">-</button>
                <span id="zoomLevel">100%</span>
                <button class="zoom-btn" onclick="zoomIn()">+</button>
            </div>
            <a href="${pdfUrl}" target="_blank" class="btn btn-secondary">📖 Direct</a>
            <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn">⬇️ Download</a>
        </div>
    </div>
    
    <div class="pdf-container">
        <div id="loading" class="loading">
            <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
            <div>Loading PDF...</div>
            <div style="font-size: 12px; margin-top: 10px; opacity: 0.7;">Please wait while we render the document</div>
        </div>
        
        <div id="error" class="error" style="display: none;">
            <h3>📄 PDF Loading Failed</h3>
            <p>We couldn't load the PDF directly. Try these alternatives:</p>
            <div class="error-buttons">
                <a href="${pdfUrl}" target="_blank" class="btn">📖 Open Direct</a>
                <a href="https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}" target="_blank" class="btn">🔍 Google Viewer</a>
                <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-secondary">⬇️ Download</a>
            </div>
        </div>
        
        <div id="pdfViewer" class="pdf-viewer" style="display: none;"></div>
    </div>

    <script>
        // PDF.js configuration
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        let pdfDoc = null;
        let currentPage = 1;
        let scale = 1.0;
        let totalPages = 0;
        
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const pdfViewer = document.getElementById('pdfViewer');
        const pageInput = document.getElementById('pageInput');
        const pageCount = document.getElementById('pageCount');
        const zoomLevel = document.getElementById('zoomLevel');
        
        // Load PDF
        async function loadPDF() {
            try {
                // First try to load through our proxy
                let pdfUrl = '/api/pdf/view?url=${encodeURIComponent(pdfUrl)}';
                
                try {
                    pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
                } catch (proxyError) {
                    console.log('Proxy failed, trying direct URL...');
                    // If proxy fails, try direct URL
                    pdfDoc = await pdfjsLib.getDocument('${pdfUrl}').promise;
                }
                
                totalPages = pdfDoc.numPages;
                pageCount.textContent = '/' + totalPages;
                pageInput.max = totalPages;
                
                loading.style.display = 'none';
                pdfViewer.style.display = 'block';
                
                renderPage(1);
            } catch (err) {
                console.error('Error loading PDF:', err);
                loading.style.display = 'none';
                error.style.display = 'block';
            }
        }
        
        // Render a specific page
        async function renderPage(pageNum) {
            try {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });
                
                // Create canvas for this page
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.className = 'pdf-page';
                
                // Clear previous pages and add new one
                pdfViewer.innerHTML = '';
                pdfViewer.appendChild(canvas);
                
                // Render page
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                currentPage = pageNum;
                pageInput.value = pageNum;
            } catch (err) {
                console.error('Error rendering page:', err);
            }
        }
        
        // Navigation functions
        function nextPage() {
            if (currentPage < totalPages) {
                renderPage(currentPage + 1);
            }
        }
        
        function prevPage() {
            if (currentPage > 1) {
                renderPage(currentPage - 1);
            }
        }
        
        function goToPage() {
            const pageNum = parseInt(pageInput.value);
            if (pageNum >= 1 && pageNum <= totalPages) {
                renderPage(pageNum);
            }
        }
        
        // Zoom functions
        function zoomIn() {
            scale += 0.2;
            zoomLevel.textContent = Math.round(scale * 100) + '%';
            renderPage(currentPage);
        }
        
        function zoomOut() {
            if (scale > 0.4) {
                scale -= 0.2;
                zoomLevel.textContent = Math.round(scale * 100) + '%';
                renderPage(currentPage);
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    prevPage();
                    break;
                case 'ArrowRight':
                    nextPage();
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                    zoomOut();
                    break;
            }
        });
        
        // Load PDF when page loads
        loadPDF();
    </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Web PDF viewer error:', error);
    return NextResponse.json({ 
      error: 'Failed to create PDF viewer', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}