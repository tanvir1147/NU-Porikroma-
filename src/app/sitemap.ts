import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable or fallback to production URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://nu-porikroma.vercel.app';
  
  const currentDate = new Date();
  
  try {
    const sitemap: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'hourly',
        priority: 1,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms-of-service`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}