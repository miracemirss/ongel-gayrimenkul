# Frontend Klasör Yapısı - Next.js 14 App Router

## Genel Yapı

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Ana sayfa
│   ├── globals.css        # Global stiller
│   ├── login/             # Giriş sayfası
│   │   └── page.tsx
│   ├── dashboard/         # Dashboard (authenticated)
│   │   ├── page.tsx
│   │   ├── listings/      # İlan yönetimi
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── leads/         # Lead yönetimi
│   │       ├── page.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── listings/          # Public ilan listesi
│   │   └── page.tsx
│   ├── listings/[id]/     # Public ilan detay
│   │   └── page.tsx
│   ├── about/             # Hakkımızda (CMS)
│   │   └── page.tsx
│   ├── services/          # Hizmetler (CMS)
│   │   └── page.tsx
│   └── mortgage/          # Mortgage (CMS)
│       └── page.tsx
├── components/            # React bileşenleri
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── listings/
│   │   ├── ListingCard.tsx
│   │   ├── ListingForm.tsx
│   │   └── ListingGallery.tsx
│   ├── leads/
│   │   ├── LeadCard.tsx
│   │   ├── LeadForm.tsx
│   │   └── LeadNotes.tsx
│   ├── cms/
│   │   └── CmsEditor.tsx  # WYSIWYG editor
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/                   # Utility fonksiyonlar
│   ├── api.ts            # Axios instance
│   └── auth.ts           # Auth helper functions
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   └── useListings.ts
├── types/                 # TypeScript type definitions
│   ├── listing.ts
│   ├── lead.ts
│   └── user.ts
├── public/               # Static dosyalar
│   └── images/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Önemli Dosyalar

### app/layout.tsx
Root layout - Tüm sayfalar için ortak yapı (fontlar, metadata)

### app/globals.css
Global CSS - Tailwind directives ve custom utilities

### lib/api.ts
Axios instance - JWT token interceptor'ları ile

### lib/auth.ts
Authentication helper functions - Login, logout, token yönetimi

### components/layout/
Header ve Footer bileşenleri - Tüm sayfalarda kullanılır

## Tasarım Sistemi

### Renkler (Tailwind Config)
- `luxury-black`: #000000
- `luxury-white`: #FFFFFF
- `luxury-silver`: #C0C0C0
- `luxury-light-gray`: #F5F5F5
- `luxury-dark-gray`: #2C2C2C
- `luxury-medium-gray`: #808080

### Fontlar
- **Sans-serif**: Inter (--font-inter)
- **Serif**: Playfair Display (--font-playfair) - Başlıklar için

### Stil Prensipleri
- Minimalist tasarım
- Siyah-beyaz-gümüş renk paleti
- Aşırı animasyon yok
- Temiz, profesyonel görünüm
- Mobil uyumlu (responsive)

