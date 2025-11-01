export interface PdfLink {
  url: string;
  title?: string;
  isValid: boolean;
}

export class PdfLinkExtractor {
  static extractPdfLinks(html: string): PdfLink[] {
    const pdfLinks: PdfLink[] = [];
    
    // Regular expression to find PDF links
    const pdfRegex = /href=["']([^"']*\.pdf[^"']*)["']/gi;
    let match;
    
    while ((match = pdfRegex.exec(html)) !== null) {
      const url = match[1];
      pdfLinks.push({
        url: this.normalizeUrl(url),
        isValid: this.isValidPdfUrl(url)
      });
    }
    
    return pdfLinks;
  }
  
  static normalizeUrl(url: string): string {
    // Convert relative URLs to absolute
    if (url.startsWith('/')) {
      return `https://nu.ac.bd${url}`;
    } else if (url.startsWith('http')) {
      return url;
    } else {
      return `https://nu.ac.bd/${url}`;
    }
  }
  
  static isValidPdfUrl(url: string): boolean {
    // Check if URL ends with .pdf (case insensitive)
    return /\.pdf$/i.test(url);
  }
  
  static async validatePdfUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && (contentType?.includes('application/pdf') || false);
    } catch {
      return false;
    }
  }
  
  static async findWorkingPdfUrl(urls: string[]): Promise<string | null> {
    for (const url of urls) {
      if (await this.validatePdfUrl(url)) {
        return url;
      }
    }
    return null;
  }
}

export function generatePdfDownloadUrl(pdfUrl: string): string {
  return `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
}

export function generatePdfViewUrl(pdfUrl: string): string {
  return `/api/pdf/view?url=${encodeURIComponent(pdfUrl)}`;
}