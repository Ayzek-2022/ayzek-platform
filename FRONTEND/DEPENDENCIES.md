# Proje Bağımlılıkları (Dependencies)

Bu dosya projedeki tüm npm paketlerini detaylı olarak listeler.

## Kurulum Komutu

```bash
npm install
# veya
pnpm install
# veya
yarn install
```

---

## 🎯 Ana Production Bağımlılıkları

### Framework & Core
```json
"next": "^14.2.12"                    // Next.js React Framework
"react": "^18.3.1"                    // React Library
"react-dom": "^18.3.1"                // React DOM Renderer
"typescript": "^5.9.3"                // TypeScript
```

### Styling & CSS
```json
"tailwindcss": "^4.1.9"               // Tailwind CSS Framework
"autoprefixer": "^10.4.20"            // CSS Autoprefixer
"postcss": "^8.5.6"                   // CSS Post-processor
"tailwindcss-animate": "^1.0.7"       // Tailwind animasyon eklentisi
"tw-animate-css": "^1.3.3"            // Animate.css for Tailwind
"tailwind-merge": "^2.5.5"            // Tailwind class merger utility
"clsx": "^2.1.1"                      // Conditional className utility
"class-variance-authority": "^0.7.1"  // CSS variants utility
```

### UI Component Library (Radix UI)
```json
"@radix-ui/react-accordion": "1.2.2"
"@radix-ui/react-alert-dialog": "1.1.4"
"@radix-ui/react-aspect-ratio": "1.1.1"
"@radix-ui/react-avatar": "1.1.2"
"@radix-ui/react-checkbox": "1.1.3"
"@radix-ui/react-collapsible": "1.1.2"
"@radix-ui/react-context-menu": "2.2.4"
"@radix-ui/react-dialog": "1.1.4"
"@radix-ui/react-dropdown-menu": "2.1.4"
"@radix-ui/react-hover-card": "1.1.4"
"@radix-ui/react-label": "2.1.1"
"@radix-ui/react-menubar": "1.1.4"
"@radix-ui/react-navigation-menu": "1.2.3"
"@radix-ui/react-popover": "1.1.4"
"@radix-ui/react-progress": "1.1.1"
"@radix-ui/react-radio-group": "1.2.2"
"@radix-ui/react-scroll-area": "1.2.2"
"@radix-ui/react-select": "2.1.4"
"@radix-ui/react-separator": "1.1.1"
"@radix-ui/react-slider": "1.2.2"
"@radix-ui/react-slot": "1.1.1"
"@radix-ui/react-switch": "1.1.2"
"@radix-ui/react-tabs": "1.1.2"
"@radix-ui/react-toast": "1.2.4"
"@radix-ui/react-toggle": "1.1.1"
"@radix-ui/react-toggle-group": "1.1.1"
"@radix-ui/react-tooltip": "1.1.6"
```

### Animation & Motion
```json
"framer-motion": "^12.23.26"          // Animation library
"@tsparticles/react": "^3.0.0"        // Particle effects
"@tsparticles/slim": "^3.9.1"         // Particle effects (slim version)
"tsparticles-engine": "^2.12.0"       // Particle engine
"tsparticles-plugin-emitters": "^2.12.0"
"tsparticles-preset-links": "^2.12.0"
```

### 3D Graphics & Visual Effects
```json
"three": "^0.180.0"                   // 3D graphics library
"vanta": "^0.5.24"                    // Animated backgrounds
```

### Form Management & Validation
```json
"react-hook-form": "^7.60.0"          // Form state management
"@hookform/resolvers": "^3.10.0"      // Form validation resolvers
"zod": "3.25.67"                      // Schema validation
```

### Data Fetching & API
```json
"axios": "^1.11.0"                    // HTTP client
```

### Date & Time
```json
"date-fns": "4.1.0"                   // Date manipulation
"react-day-picker": "9.8.0"           // Date picker component
```

### UI Components & Libraries
```json
"embla-carousel-react": "8.5.1"       // Carousel component
"recharts": "2.15.4"                  // Chart/Graph library
"vaul": "^0.9.9"                      // Drawer component
"cmdk": "1.0.4"                       // Command palette
"input-otp": "1.4.1"                  // OTP input component
"react-resizable-panels": "^2.1.7"    // Resizable panels
```

### Icons
```json
"lucide-react": "^0.454.0"            // Icon library
"react-icons": "^5.5.0"               // Icon library
```

### Theme & Dark Mode
```json
"next-themes": "^0.4.6"               // Theme management (dark/light mode)
```

### Fonts
```json
"@fontsource/inter": "^5.2.8"         // Inter font
"@fontsource/orbitron": "^5.2.8"      // Orbitron font
"geist": "^1.3.1"                     // Geist font family
```

### Notifications & Toast
```json
"sonner": "^1.7.4"                    // Toast notifications
"react-hot-toast": "^2.6.0"           // Toast notifications (alternative)
```

---

## 🛠️ Development Bağımlılıkları (DevDependencies)

```json
"@tailwindcss/node": "^4.1.13"        // Tailwind CSS Node.js tools
"@tailwindcss/postcss": "^4.1.13"     // Tailwind PostCSS plugin
"@types/node": "^22.18.7"             // Node.js type definitions
"@types/react": "^19.1.16"            // React type definitions
"@types/react-dom": "^19.1.9"         // React DOM type definitions
```

---

## 📊 Toplam Bağımlılık İstatistikleri

- **Production Dependencies:** 73 paket
- **Development Dependencies:** 5 paket
- **Toplam:** 78 paket

---

## 🔄 Versiyonlama Notları

### Semver Açıklaması
- `^` (caret): Minor ve patch güncellemelere izin verir
  - Örnek: `^14.2.12` → `14.x.x` (15.0.0'a kadar)
- `~` (tilde): Sadece patch güncellemelere izin verir
  - Örnek: `~14.2.12` → `14.2.x`
- Versiyonsuz: Tam versiyon kilidi

---

## 🚀 Bağımlılık Güncellemeleri

### Tüm bağımlılıkları kontrol et
```bash
npm outdated
# veya
pnpm outdated
```

### Güvenli güncellemeler (minor/patch)
```bash
npm update
# veya
pnpm update
```

### Major güncellemeler (dikkatli!)
```bash
# İnteraktif güncelleme
npx npm-check-updates -i

# Tüm bağımlılıkları en son versiyona güncelle
npx npm-check-updates -u
npm install
```

### Güvenlik açığı kontrolü
```bash
npm audit
npm audit fix

# veya
pnpm audit
```

---

## 📦 Paket Boyut Analizi

```bash
# Build analizi için
npm run build

# Bundle analyzer (ekstra paket gerekli)
npm install -D @next/bundle-analyzer
```

---

## 🔒 Lock Files

Projedeki lock file'lar:
- `package-lock.json` (npm)
- `pnpm-lock.yaml` (pnpm)

**Not:** Versiyon kontrolüne her zaman lock file'ları ekleyin!

---

## ⚠️ Bilinen Sorunlar

### Peer Dependency Uyarıları
Bazı paketler peer dependency uyarısı verebilir. Çoğu durum normal.

### Version Conflicts
React 18 ile uyumlu olmayan bazı eski paketler hata verebilir.

---

## 📚 Ek Kaynaklar

- [npm Documentation](https://docs.npmjs.com/)
- [pnpm Documentation](https://pnpm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Son Güncelleme:** Aralık 2025
**Minimum Node.js Versiyonu:** 18.17.0
**Önerilen Node.js Versiyonu:** 20.x veya üzeri

