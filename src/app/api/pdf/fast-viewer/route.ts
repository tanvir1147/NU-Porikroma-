import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'NU PDF Document';

  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
  }

  try {
    // Create a fast, simple PDF viewer that opens immediately
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
        }
        .header {
            background: #2a2a2a;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .title {
            font-size: 16px;
            font-weight: bold;
            flex: 1;
            margin-right: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .buttons {
            display: flex;
            gap: 10px;
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
        .btn-download {
            background: #059669;
        }
        .btn-download:hover {
            background: #047857;
        }
        .pdf-container {
            width: 100%;
            height: calc(100vh - 60px);
            background: #333;
        }
        .pdf-frame {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }
        .fallback {
            display: none;
            text-align: center;
            padding: 50px 20px;
            background: #2a2a2a;
            margin: 20px;
            border-radius: 10px;
        }
        .fallback h3 {
            color: #f59e0b;
            margin-bottom: 15px;
        }
        .fallback-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        @media (max-width: 768px) {
            .header {
                padding: 10px 15px;
            }
            .title {
                font-size: 14px;
            }
            .btn {
                padding: 6px 12px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="buttons">
            <a href="${pdfUrl}" target="_blank" class="btn">🔗 Direct Link</a>
            <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-download">⬇️ Download</a>
        </div>
    </div>
    
    <div class="pdf-container">
        <iframe 
            id="pdfFrame" 
            class="pdf-frame" 
            src="${pdfUrl}"
            onload="pdfLoaded()"
            onerror="showFallback()">
        </iframe>
        
        <div id="fallback" class="fallback">
            <h3>📄 PDF Viewer</h3>
            <p>Choose how to view this PDF:</p>
            <div class="fallback-buttons">
                <a href="${pdfUrl}" target="_blank" class="btn">📖 Open PDF</a>
                <a href="https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}" target="_blank" class="btn">🔍 Google Viewer</a>
                <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-download">⬇️ Download</a>
            </div>
        </div>
    </div>

    <script>
        let pdfLoaded = false;
        
        function pdfLoaded() {
            pdfLoaded = true;
            console.log('PDF loaded successfully');
        }
        
        function showFallback() {
            document.getElementById('pdfFrame').style.display = 'none';
            document.getElementById('fallback').style.display = 'block';
        }
        
        // Show fallback after 3 seconds if PDF doesn't load
        setTimeout(() => {
            if (!pdfLoaded) {
                showFallback();
            }
        }, 3000);
        
        // For mobile devices, show fallback sooner
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            setTimeout(() => {
                if (!pdfLoaded) {
                    showFallback();
                }
            }, 1500);
        }
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
    console.error('Fast PDF viewer error:', error);
    return NextResponse.json({ 
      error: 'Failed to create PDF viewer', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}