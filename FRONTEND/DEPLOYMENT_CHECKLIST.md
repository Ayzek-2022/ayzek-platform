# 🚀 AYZEK Platform - Yayın Öncesi Checklist

## ✅ 1. SEO & Meta Tags

### Gerekli Paketler:

```bash
npm install next-seo
```

### Yapılacaklar:

- [ ] `next-seo` paketi kuruldu
- [ ] Her sayfaya meta tags eklendi
- [ ] Open Graph tags (Facebook/LinkedIn paylaşımları için)
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Sitemap.xml oluşturuldu
- [ ] Robots.txt yapılandırıldı

### Örnek Kod (layout.tsx veya her sayfada):

```tsx
import { NextSeo } from "next-seo";

<NextSeo
  title="AYZEK - Teknoloji Topluluğu"
  description="Selçuk Üniversitesi teknoloji topluluğu"
  canonical="https://ayzek.com"
  openGraph={{
    url: "https://ayzek.com",
    title: "AYZEK - Teknoloji Topluluğu",
    description: "Selçuk Üniversitesi teknoloji topluluğu",
    images: [
      {
        url: "https://ayzek.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AYZEK Logo",
      },
    ],
    siteName: "AYZEK",
  }}
  twitter={{
    handle: "@ayzek",
    site: "@ayzek",
    cardType: "summary_large_image",
  }}
/>;
```

---

## ✅ 2. Analytics & Monitoring

### Gerekli Paketler:

```bash
npm install @vercel/analytics
npm install @vercel/speed-insights
npm install @sentry/nextjs (opsiyonel - error tracking)
```

### Yapılacaklar:

- [ ] Google Analytics 4 entegrasyonu
- [ ] Vercel Analytics aktif
- [ ] Vercel Speed Insights aktif
- [ ] Error tracking (Sentry veya LogRocket)
- [ ] User behavior tracking
- [ ] Conversion tracking

### Örnek Kod (app/layout.tsx):

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## ✅ 3. Performance Optimization

### Image Optimization:

- [ ] Tüm görseller Next.js Image component ile kullanılıyor
- [ ] WebP formatı kullanılıyor
- [ ] Lazy loading aktif
- [ ] Placeholder blur aktif
- [ ] Responsive image sizes tanımlı

### Code Optimization:

- [ ] Bundle analyzer ile paket boyutları kontrol edildi

```bash
npm install @next/bundle-analyzer
```

- [ ] Unused dependencies temizlendi
- [ ] Dynamic imports kullanıldı (lazy loading)
- [ ] Tree shaking yapıldı

### Caching Strategy:

- [ ] Static pages cached
- [ ] API responses cached (SWR veya React Query)
- [ ] CDN yapılandırması

---

## ✅ 4. PWA Support (Progressive Web App)

### Gerekli Paketler:

```bash
npm install next-pwa
```

### Yapılacaklar:

- [ ] PWA manifest.json oluşturuldu
- [ ] Service worker yapılandırıldı
- [ ] Offline support
- [ ] App icons (192x192, 512x512)
- [ ] Install prompt

### next.config.js:

```js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... diğer config
});
```

---

## ✅ 5. Security

### Yapılacaklar:

- [ ] Environment variables güvenli
- [ ] API keys .env.local'de
- [ ] CORS yapılandırması
- [ ] Rate limiting (API)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] HTTPS zorlanıyor
- [ ] Security headers (next.config.js)

### next.config.js Security Headers:

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

---

## ✅ 6. SEO Files

### Sitemap.xml (app/sitemap.ts):

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ayzek.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://ayzek.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://ayzek.com/events",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://ayzek.com/teams",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://ayzek.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://ayzek.com/join",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
```

### Robots.txt (app/robots.ts):

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: "https://ayzek.com/sitemap.xml",
  };
}
```

---

## ✅ 7. Social Media Integration

### Yapılacaklar:

- [ ] Facebook Pixel (opsiyonel)
- [ ] Twitter/X integration
- [ ] LinkedIn integration
- [ ] Instagram feed widget (opsiyonel)
- [ ] Social share buttons
- [ ] WhatsApp share button

---

## ✅ 8. Error Handling & Logging

### Gerekli Dosyalar:

- [ ] `app/error.tsx` - Client error boundary
- [ ] `app/global-error.tsx` - Global error handler
- [ ] `app/not-found.tsx` - 404 page
- [ ] Error logging service (Sentry)

---

## ✅ 9. Testing Before Deploy

### Checklist:

- [ ] Tüm sayfalar test edildi
- [ ] Mobil responsive kontrol edildi
- [ ] Tablet responsive kontrol edildi
- [ ] Desktop responsive kontrol edildi
- [ ] Tüm linkler çalışıyor
- [ ] Forms test edildi
- [ ] Loading states test edildi
- [ ] Error states test edildi
- [ ] Browser compatibility (Chrome, Safari, Firefox, Edge)
- [ ] Lighthouse score kontrol edildi (Performance, SEO, Accessibility)

### Lighthouse Target Scores:

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

---

## ✅ 10. Deployment

### Vercel Deploy:

```bash
# Vercel hesabına bağlan
vercel login

# Deploy et
vercel --prod
```

### Environment Variables (Vercel Dashboard):

- [ ] `NEXT_PUBLIC_API_BASE` set edildi
- [ ] Diğer API keys eklendi
- [ ] Production mode'da test edildi

### Domain Setup:

- [ ] Custom domain bağlandı
- [ ] SSL certificate otomatik
- [ ] WWW redirect yapılandırıldı
- [ ] DNS records doğru

---

## ✅ 11. Post-Deploy

### Yapılacaklar:

- [ ] Google Search Console'a site eklendi
- [ ] Sitemap submit edildi
- [ ] Google Analytics çalışıyor
- [ ] Social media'da paylaşıldı
- [ ] Backup stratejisi oluşturuldu
- [ ] Monitoring alerts kuruldu

---

## 📦 Önerilen Ek Paketler

```bash
# React Query - Data fetching & caching
npm install @tanstack/react-query

# Framer Motion - Animations (zaten var)
npm install framer-motion

# React Hook Form - Form validation
npm install react-hook-form @hookform/resolvers zod

# Date formatting
npm install date-fns

# Toast notifications
npm install sonner

# Loading animations
npm install react-loading-skeleton
```

---

## 🎯 Priority Order

### Hemen Yapılması Gerekenler (P0):

1. ✅ Skeleton loaders (TAMAMLANDI)
2. SEO meta tags
3. Sitemap & Robots.txt
4. Analytics (GA4 + Vercel)
5. Error boundaries

### Önemli (P1):

6. PWA support
7. Performance optimization
8. Security headers
9. Image optimization review

### İyi Olur (P2):

10. Sentry error tracking
11. React Query for data fetching
12. Advanced caching strategies
13. Social media integrations

---

## 🚀 Hızlı Başlangıç Komutları

```bash
# 1. SEO & Analytics paketlerini kur
npm install next-seo @vercel/analytics @vercel/speed-insights

# 2. PWA ekle
npm install next-pwa

# 3. Sentry ekle (opsiyonel)
npm install @sentry/nextjs

# 4. Build al ve test et
npm run build
npm start

# 5. Lighthouse ile test et
# Chrome DevTools > Lighthouse > Generate Report

# 6. Deploy et
vercel --prod
```

---

## 📝 Notlar

- Backend API'nin production URL'i `NEXT_PUBLIC_API_BASE` ile ayarlanmalı
- Tüm sensitive data `.env.local` dosyasında olmalı
- `.env.local` dosyası `.gitignore`'da olmalı
- Production'da console.log'lar temizlenmeli
- Error handling her yerde yapılmalı

---

**Herhangi bir sorun olursa veya yardıma ihtiyacın olursa bana sor! 💪🔥**
