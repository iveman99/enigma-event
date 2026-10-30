import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.enigmaudcs.in',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://www.enigmaudcs.in/enigma2',
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...['enigma2/about', 'enigma2/events', 'account-information', 'privacy', 'terms'].map((path) => ({
            url: `https://www.enigmaudcs.in/${path}`,
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        })),
    ];
}
