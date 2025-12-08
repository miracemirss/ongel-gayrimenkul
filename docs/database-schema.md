# PostgreSQL Database Schema - ERD

## Tablolar ve İlişkiler

### 1. users (Kullanıcılar)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  phone VARCHAR(50),
  avatar VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**İlişkiler:**
- `users` 1:N `listings` (assigned_agent_id)
- `users` 1:N `leads` (assigned_agent_id)
- `users` 1:N `lead_notes` (created_by_id)

---

### 2. listings (İlanlar)
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR', 'GBP')),
  status VARCHAR(30) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active_for_sale', 'active_for_rent', 'sold', 'rented', 'inactive')),
  location VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 2),
  longitude DECIMAL(10, 2),
  net_area DECIMAL(10, 2) NOT NULL,
  gross_area DECIMAL(10, 2),
  room_count INTEGER NOT NULL,
  virtual_tour_url VARCHAR(1000),
  video_url VARCHAR(1000),
  assigned_agent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_agent ON listings(assigned_agent_id);
CREATE INDEX idx_listings_location ON listings(location);
```

**İlişkiler:**
- `listings` N:1 `users` (assigned_agent_id)
- `listings` 1:N `listing_images` (listing_id)

---

### 3. listing_images (İlan Görselleri)
```sql
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR(1000) NOT NULL,
  key VARCHAR(500) NOT NULL,
  order INTEGER DEFAULT 0,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);
```

**İlişkiler:**
- `listing_images` N:1 `listings` (listing_id)

---

### 4. leads (Potansiyel Müşteriler)
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  source VARCHAR(30) NOT NULL CHECK (source IN ('contact_form', 'portfolio_inquiry', 'mortgage_application')),
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  related_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_agent ON leads(assigned_agent_id);
CREATE INDEX idx_leads_source ON leads(source);
```

**İlişkiler:**
- `leads` N:1 `users` (assigned_agent_id)
- `leads` N:1 `listings` (related_listing_id) - Optional
- `leads` 1:N `lead_notes` (lead_id)

---

### 5. lead_notes (Lead Notları/Günlük)
```sql
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_notes_lead ON lead_notes(lead_id);
```

**İlişkiler:**
- `lead_notes` N:1 `leads` (lead_id)
- `lead_notes` N:1 `users` (created_by_id)

---

### 6. cms_pages (Kurumsal İçerik Sayfaları)
```sql
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) UNIQUE NOT NULL CHECK (type IN ('about', 'services', 'mortgage')),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**İlişkiler:**
- Yok (standalone)

---

## ERD Diyagramı (Metin Tabanlı)

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ first_name  │
│ last_name   │
│ role        │
│ phone       │
│ avatar      │
│ is_active   │
└──────┬──────┘
       │
       │ 1
       │
       │ N
       │
┌──────▼──────────┐         ┌──────────────┐
│   listings      │         │ listing_     │
├─────────────────┤         │ images       │
│ id (PK)         │◄───1:N──┤──────────────┤
│ title           │         │ id (PK)      │
│ description     │         │ url          │
│ price           │         │ key          │
│ currency        │         │ order        │
│ status          │         │ listing_id   │
│ location        │         │ (FK)         │
│ latitude        │         └──────────────┘
│ longitude       │
│ net_area        │
│ gross_area      │
│ room_count      │
│ virtual_tour_url│
│ video_url       │
│ assigned_agent_ │
│   id (FK)       │
└──────┬──────────┘
       │
       │ N
       │
       │ 1
       │
┌──────▼──────────┐         ┌──────────────┐
│     leads        │         │ lead_notes   │
├─────────────────┤         ├──────────────┤
│ id (PK)         │◄───1:N──┤ id (PK)      │
│ first_name      │         │ content      │
│ last_name       │         │ lead_id (FK) │
│ email           │         │ created_by_  │
│ phone           │         │   id (FK)    │
│ source          │         │ created_at   │
│ status          │         └──────┬───────┘
│ related_listing │                │
│   _id (FK)      │                │ N
│ assigned_agent_ │                │
│   id (FK)        │                │ 1
└──────┬───────────┘                │
       │                            │
       │ N                          │
       │                            │
       │ 1                          │
       │                            │
┌──────▼──────────┐                │
│    users        │─────────────────┘
└─────────────────┘

┌─────────────┐
│ cms_pages   │
├─────────────┤
│ id (PK)     │
│ type (UNIQUE)│
│ title       │
│ content     │
│ meta_title  │
│ meta_desc   │
└─────────────┘
```

---

## Enum Değerleri

### Role (users.role)
- `admin` - Tüm yetkilere sahip
- `agent` - Sadece kendi atanan kaynaklara erişim

### ListingStatus (listings.status)
- `active_for_sale` - Aktif (Satılık)
- `active_for_rent` - Aktif (Kiralık)
- `sold` - Satıldı
- `rented` - Kiraya Verildi
- `inactive` - Pasif

### Currency (listings.currency)
- `TRY` - Türk Lirası
- `USD` - Amerikan Doları
- `EUR` - Euro
- `GBP` - İngiliz Sterlini

### LeadSource (leads.source)
- `contact_form` - İletişim Formu
- `portfolio_inquiry` - Portföy Bilgi Talebi
- `mortgage_application` - Mortgage Ön Başvuru

### LeadStatus (leads.status)
- `new` - Yeni
- `in_progress` - İşlemde
- `completed` - Tamamlandı

### CmsPageType (cms_pages.type)
- `about` - Hakkımızda
- `services` - Hizmetler
- `mortgage` - Mortgage

