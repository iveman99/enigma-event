import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://enigmaudcs.in',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...['account-information', 'privacy', 'terms'].map((path) => ({
            url: `https://www.enigmaudcs.in/${path}`,
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        })),
    ];
}
