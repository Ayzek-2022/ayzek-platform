import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ayzek.io' // Domain değişince güncellenmeli

    // Statik sayfalarımız
    const routes = [
        '',
        '/about',
        '/blog',
        '/events',
        '/join',
        '/teams',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes]
}
