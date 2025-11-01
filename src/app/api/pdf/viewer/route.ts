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
    
    // Create simple HTML page with multiple PDF viewing options
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Viewer - ${title || 'Document'}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
            text-shadow: 0 0 10px #00E0FF;
            font-family: 'Poppins', sans-serif;
            letter-spacing: 0.5px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.8;
            margin: 0 0 20px 0;
        }
        .warning {
            background: rgba(255, 165, 0, 0.2);
            border: 1px solid rgba(255, 165, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 30px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
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
        .btn-warning {
            background: #ffc107;
            border-color: #ffc107;
            color: #000;
        }
        .btn-warning:hover {
            background: #e0a800;
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
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .info h3 {
            margin-top: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .info-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
        }
        @media (max-width: 768px) {
            .viewer-container {
                height: 60vh;
            }
            .buttons {
                flex-direction: column;
                align-items: center;
            }
            .btn {
                width: 200px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px;">
                    <img src="/logo.png" alt="NU Porikroma" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2);" />
                </div>
                <div>
                    <h1 class="title">📄 NU Porikroma PDF Viewer</h1>
                    <p class="subtitle">${title || 'National University Bangladesh Document'}</p>
                    ${!isNuDomain ? '<div class="warning">⚠️ This PDF is from an external domain. Please verify the source before viewing.</div>' : ''}
                </div>
            </div>
            <div class="buttons">
                <a href="${pdfUrl}" target="_blank" class="btn">📖 Open Direct</a>
                <a href="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}" target="_blank" class="btn">🔍 Google Docs</a>
                <a href="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}" target="_blank" class="btn">📄 PDF.js Viewer</a>
                <a href="/api/pdf/download?url=${encodeURIComponent(pdfUrl)}" class="btn btn-primary">⬇️ Download</a>
                ${!isNuDomain ? `<a href="#" onclick="alert('This PDF is from an external domain: ${url.hostname}. Please verify the source before opening.'); return false;" class="btn btn-warning">⚠️ Security Info</a>` : ''}
            </div>
        </div>

        <div class="viewer-container">
            <div id="loading-message" style="padding: 40px; text-align: center; color: #333;">
                <h3>🔄 Loading PDF...</h3>
                <p>Attempting to load the PDF document. If this takes too long, try the alternative options above.</p>
            </div>
            <iframe src="${pdfUrl}" class="iframe" style="display: none;"
                    onerror="handleIframeError()" 
                    onload="handleIframeLoad()"></iframe>
            <div id="error-message" style="display: none; padding: 40px; text-align: center; color: #333;">
                <h3>⚠️ PDF Access Restricted</h3>
                <p>The PDF cannot be displayed directly due to server restrictions. This is common with NU website PDFs.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <h4>🔧 How to view this PDF:</h4>
                    <ol style="margin: 10px 0;">
                        <li><strong>📖 Open Direct:</strong> Click to open in a new tab (may work in some browsers)</li>
                        <li><strong>🔍 Google Docs:</strong> Use Google's PDF viewer (most reliable)</li>
                        <li><strong>📄 PDF.js Viewer:</strong> Use Mozilla's PDF viewer</li>
                        <li><strong>⬇️ Download:</strong> Save to your device and open with a PDF reader</li>
                    </ol>
                </div>
                <p><strong>We recommend trying the Google Docs viewer first.</strong></p>
            </div>
        </div>
        
        <script>
            let iframeLoaded = false;
            let errorShown = false;
            
            function handleIframeLoad() {
                iframeLoaded = true;
                console.log('PDF iframe loaded successfully');
                document.getElementById('loading-message').style.display = 'none';
                document.querySelector('.iframe').style.display = 'block';
            }
            
            function handleIframeError() {
                if (!errorShown) {
                    showError();
                }
            }
            
            function showError() {
                errorShown = true;
                document.getElementById('loading-message').style.display = 'none';
                document.querySelector('.iframe').style.display = 'none';
                document.getElementById('error-message').style.display = 'block';
            }
            
            // Check if iframe loaded after 3 seconds (shorter timeout for better UX)
            setTimeout(() => {
                if (!iframeLoaded && !errorShown) {
                    console.log('PDF iframe failed to load within 3 seconds - likely blocked by server');
                    showError();
                }
            }, 3000);
            
            // Also check after 1 second for immediate failures
            setTimeout(() => {
                try {
                    const iframe = document.querySelector('.iframe');
                    if (iframe && !iframeLoaded) {
                        // Try to access iframe content to detect cross-origin issues
                        try {
                            const doc = iframe.contentDocument;
                            if (doc && doc.body && doc.body.innerHTML.includes('403') || doc.body.innerHTML.includes('Forbidden')) {
                                console.log('PDF access forbidden (403)');
                                showError();
                            }
                        } catch (e) {
                            // Cross-origin restrictions - this is expected for external PDFs
                            console.log('Cross-origin iframe detected');
                        }
                    }
                } catch (e) {
                    console.log('Error checking iframe content:', e);
                }
            }, 1000);
        </script>

        <div class="info">
            <h3>📋 Viewing Options</h3>
            <div class="info-grid">
                <div class="info-card">
                    <h4>📖 Direct View</h4>
                    <p>Open PDF directly in your browser. Best for modern browsers.</p>
                </div>
                <div class="info-card">
                    <h4>🔍 Google Docs</h4>
                    <p>Use Google Docs viewer. Works with most file types.</p>
                </div>
                <div class="info-card">
                    <h4>📄 PDF.js Viewer</h4>
                    <p>Mozilla's PDF.js viewer. Reliable for PDF files.</p>
                </div>
                <div class="info-card">
                    <h4>⬇️ Download</h4>
                    <p>Save PDF to your device for offline viewing.</p>
                </div>
            </div>
        </div>
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