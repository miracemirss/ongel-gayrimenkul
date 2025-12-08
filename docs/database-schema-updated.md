# PostgreSQL Database Schema - Güncellenmiş ERD (JSONB Çoklu Dil Desteği)

## Güncellenmiş Tablolar

### 1. listings (İlanlar) - JSONB Çoklu Dil Desteği

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,  -- { "tr": "...", "en": "...", "ar": "..." }
  description JSONB NOT NULL,  -- { "tr": "...", "en": "...", "ar": "..." }
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
  status VARCHAR(30) NOT NULL DEFAULT 'inactive',
  location VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 2),
  longitude DECIMAL(10, 2),
  net_area DECIMAL(10, 2) NOT NULL,
  gross_area DECIMAL(10, 2),
  room_count INTEGER NOT NULL,
  virtual_tour_url VARCHAR(1000),
  video_url VARCHAR(1000),
  assigned_agent_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JSONB index for multilingual search
CREATE INDEX idx_listings_title_gin ON listings USING GIN (title);
CREATE INDEX idx_listings_description_gin ON listings USING GIN (description);
```

**JSONB Yapısı Örneği:**
```json
{
  "title": {
    "tr": "Lüks Villa, Bebek",
    "en": "Luxury Villa, Bebek",
    "ar": "فيلا فاخرة، بيبك"
  },
  "description": {
    "tr": "Muhteşem manzaralı lüks villa...",
    "en": "Luxury villa with stunning views...",
    "ar": "فيلا فاخرة بإطلالات خلابة..."
  }
}
```

### 2. cms_pages (Kurumsal İçerik) - JSONB Çoklu Dil Desteği

```sql
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) UNIQUE NOT NULL CHECK (type IN ('about', 'services', 'mortgage')),
  title JSONB NOT NULL,  -- { "tr": "...", "en": "...", "ar": "..." }
  content JSONB NOT NULL,  -- { "tr": "...", "en": "...", "ar": "..." }
  meta_title JSONB,  -- { "tr": "...", "en": "...", "ar": "..." }
  meta_description JSONB,  -- { "tr": "...", "en": "...", "ar": "..." }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JSONB indexes
CREATE INDEX idx_cms_pages_title_gin ON cms_pages USING GIN (title);
CREATE INDEX idx_cms_pages_content_gin ON cms_pages USING GIN (content);
```

### 3. footer_links (Footer Linkleri) - YENİ

```sql
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('social', 'portal')),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  icon VARCHAR(100),
  order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_footer_links_type ON footer_links(type);
CREATE INDEX idx_footer_links_active ON footer_links(is_active);
```

## JSONB Sorgu Örnekleri

### İlan Başlığını Belirli Dilde Getirme

```sql
-- Türkçe başlık
SELECT title->>'tr' as title_tr FROM listings WHERE id = '...';

-- İngilizce başlık
SELECT title->>'en' as title_en FROM listings WHERE id = '...';

-- Arapça başlık
SELECT title->>'ar' as title_ar FROM listings WHERE id = '...';
```

### JSONB İçinde Arama

```sql
-- Türkçe başlıkta "villa" araması
SELECT * FROM listings 
WHERE title->>'tr' ILIKE '%villa%';

-- Tüm dillerde arama (PostgreSQL full-text search ile)
SELECT * FROM listings 
WHERE to_tsvector('turkish', title->>'tr') @@ to_tsquery('villa')
   OR to_tsvector('english', title->>'en') @@ to_tsquery('villa')
   OR to_tsvector('arabic', title->>'ar') @@ to_tsquery('villa');
```

### CMS Sayfası İçeriğini Dilde Getirme

```sql
-- Hakkımızda sayfası - Türkçe
SELECT 
  title->>'tr' as title,
  content->>'tr' as content
FROM cms_pages 
WHERE type = 'about';

-- Hizmetler sayfası - İngilizce
SELECT 
  title->>'en' as title,
  content->>'en' as content
FROM cms_pages 
WHERE type = 'services';
```

## Avantajlar

1. **Esneklik**: Yeni dil eklemek için schema değişikliği gerekmez
2. **Performans**: JSONB index'leri ile hızlı arama
3. **Tutarlılık**: Tüm diller tek bir kayıtta
4. **PostgreSQL Native**: JSONB operatörleri ile güçlü sorgulama

## Dikkat Edilmesi Gerekenler

1. **Validation**: Backend'de tüm dillerin doldurulduğundan emin olunmalı
2. **Index**: JSONB alanlarında GIN index kullanılmalı
3. **Null Check**: JSONB içindeki değerlerin null olmaması kontrol edilmeli

