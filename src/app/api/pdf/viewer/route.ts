import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  const title = searchParams.get('title');

  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
  }

  try {
    // Validate URL format
    let url: URL;
    try {
      url = new URL(pdfUrl);
    } catch (urlError) {
      // If URL is invalid, try prepending https://
      try {
        url = new URL(`https://${pdfUrl}`);
      } catch (secondUrlError) {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }

    // Allow PDF files from nu.ac.bd domain, but also allow other domains with warning
    const isNuDomain = url.hostname.includes('nu.ac.bd');
    
    // Create simple mobile-friendly PDF viewer
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF - ${title || 'NU Notice'}</title>
    <style>
        body {
            margin: 0;
            padding: 10px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        .header {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            text-align: center;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 10px 0;
            text-shadow: 0 0 10px #00E0FF;
        }
        .subtitle {
            font-size: 14px;
            opacity: 0.8;
            margin: 0 0 15px 0;
            word-break: break-word;
        }
        .buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 14px;
            text-align: center;
            min-width: 120px;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .btn-primary {
            background: #28a745;
            border-color: #28a745;
        }
        .btn-primary:hover {
            background: #218838;
        }
        .viewer-container {
            background: white;
            border-radius: 10px;
            height: 70vh;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 10px;
        }
        .message {
            padding: 30px 20px;
            text-align: center;
            color: #333;
        }
        .message h3 {
            margin-top: 0;
            color: #333;
        }
        .instructions {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: left;
            color: #333;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        @media (max-width: 768px) {
            body { padding: 5px; }
            .header { padding: 10px; }
            .title { font-size: 18px; }
            .subtitle { font-size: 12px; }
            .btn { 
                padding: 10px 15px; 
                font-size: 12px;
                min-width: 100px;
            }
            .viewer-container { height: 60vh; }
            .message { padding: 20px 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">📄 NU PDF Viewer</h1>
            <p class="subtitle">${title || 'National University Document'}</p>
            <div class="buttons">
                <a href="${pdfUrl}" target="_blank" class="btn">📖 Open PDF</a>
                <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-primary">⬇️ Download</a>
            </div>
        </div>

        <div class="viewer-container">
            <div id="loading-message" class="message">
                <h3>🔄 Loading PDF...</h3>
                <p>Please wait while we load the document...</p>
            </div>
            <iframe src="${pdfUrl}" class="iframe" style="display: none;"
                    onerror="showError()" 
                    onload="showPDF()"></iframe>
            <div id="error-message" class="message" style="display: none;">
                <h3>📱 Mobile PDF Viewer</h3>
                <p>For the best mobile experience, we recommend:</p>
                <div class="instructions">
                    <ol>
                        <li><strong>📖 Open PDF:</strong> Tap to open in your browser's PDF viewer</li>
                        <li><strong>⬇️ Download:</strong> Save to your device and open with a PDF app</li>
                    </ol>
                </div>
                <p><strong>Most mobile browsers handle PDFs automatically.</strong></p>
            </div>
        </div>
        
        <script>
            let loaded = false;
            
            function showPDF() {
                loaded = true;
                document.getElementById('loading-message').style.display = 'none';
                document.querySelector('.iframe').style.display = 'block';
            }
            
            function showError() {
                document.getElementById('loading-message').style.display = 'none';
                document.querySelector('.iframe').style.display = 'none';
                document.getElementById('error-message').style.display = 'block';
            }
            
            // Auto-show error message after 2 seconds if not loaded (mobile-friendly)
            setTimeout(() => {
                if (!loaded) {
                    showError();
                }
            }, 2000);
        </script>
    </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('PDF viewer error:', error);
    return NextResponse.json({ 
      error: 'Failed to create PDF viewer', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}