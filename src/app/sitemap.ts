import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Always use production URL for sitemap
  const baseUrl = 'https://nu-porikroma.vercel.app';
  
  const currentDate = new Date();
  
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
}