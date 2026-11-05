import { MetadataRoute } from 'next';
import { COMPETITIONS } from '@/lib/registration';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        ...COMPETITIONS.map(event => ({ url: `https://www.enigmaudcs.in/enigma2/events/${event.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
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
        ...['enigma2/about', 'enigma2/events', 'enigma2/prize-pool', 'enigma2/memories', 'account-information', 'privacy', 'terms'].map((path) => ({
            url: `https://www.enigmaudcs.in/${path}`,
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        })),
    ];
}
