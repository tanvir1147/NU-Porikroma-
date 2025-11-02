import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'NU PDF Document';

  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
  }

  try {
    // Create a simple HTML page that directly embeds the PDF
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
            overflow: hidden;
        }
        .header {
            background: #2a2a2a;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
        }
        .title {
            font-size: 16px;
            font-weight: bold;
            flex: 1;
            margin-right: 20px;
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
        .pdf-container {
            width: 100%;
            height: calc(100vh - 60px);
            position: relative;
        }
        .pdf-embed {
            width: 100%;
            height: 100%;
            border: none;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
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
            <a href="${pdfUrl}" target="_blank" class="btn">📖 Direct</a>
            <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-secondary">⬇️ Download</a>
        </div>
    </div>
    
    <div class="pdf-container">
        <div id="loading" class="loading">
            <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
            <div>Loading PDF...</div>
        </div>
        
        <div id="error" class="error" style="display: none;">
            <h3>📄 PDF Ready</h3>
            <p>Choose how you'd like to view this PDF:</p>
            <div class="error-buttons">
                <a href="${pdfUrl}" target="_blank" class="btn">📖 Open Direct</a>
                <a href="https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}" target="_blank" class="btn">🔍 Google Viewer</a>
                <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-secondary">⬇️ Download</a>
            </div>
        </div>
        
        <embed id="pdf-embed" src="${pdfUrl}" type="application/pdf" class="pdf-embed" style="display: none;">
    </div>

    <script>
        let loaded = false;
        
        // Try to load PDF with embed tag
        const embed = document.getElementById('pdf-embed');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        
        // Show PDF after a short delay
        setTimeout(() => {
            if (!loaded) {
                loading.style.display = 'none';
                embed.style.display = 'block';
                loaded = true;
            }
        }, 1000);
        
        // Show error options after longer delay if PDF doesn't load
        setTimeout(() => {
            if (!loaded) {
                loading.style.display = 'none';
                embed.style.display = 'none';
                error.style.display = 'block';
            }
        }, 3000);
        
        // For mobile, show options sooner
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            setTimeout(() => {
                loading.style.display = 'none';
                embed.style.display = 'none';
                error.style.display = 'block';
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
    console.error('Simple PDF viewer error:', error);
    return NextResponse.json({ 
      error: 'Failed to create PDF viewer', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}