# RESTful API Endpoint Listesi

Base URL: `http://localhost:3001/api`

Tüm endpoint'ler (auth hariç) JWT Bearer token gerektirir.

---

## Authentication

### POST /auth/login
**Public Endpoint**

Giriş yapma.

**Request Body:**
```json
{
  "email": "agent@ongel.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "agent@ongel.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "agent"
  }
}
```

---

## Users (Kullanıcı Yönetimi)

### POST /users
**Admin Only**

Yeni kullanıcı oluştur.

**Request Body:**
```json
{
  "email": "newuser@ongel.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "agent",
  "phone": "+905551234567"
}
```

### GET /users
**Admin Only**

Tüm kullanıcıları listele.

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user@ongel.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "agent",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /users/:id
**Authenticated**

Kullanıcı detayını getir.

### PATCH /users/:id
**Authenticated**

Kullanıcı bilgilerini güncelle.

### DELETE /users/:id
**Admin Only**

Kullanıcıyı sil.

---

## Listings (İlan Yönetimi)

### POST /listings
**Authenticated**

Yeni ilan oluştur.

**Request Body:**
```json
{
  "title": "Lüks Villa, Bebek",
  "description": "<p>Muhteşem manzaralı lüks villa...</p>",
  "price": 5000000,
  "currency": "USD",
  "status": "active_for_sale",
  "location": "Bebek, İstanbul",
  "latitude": 41.0766,
  "longitude": 29.0430,
  "netArea": 350.5,
  "grossArea": 450.0,
  "roomCount": 5,
  "virtualTourUrl": "https://example.com/tour",
  "videoUrl": "https://example.com/video.mp4",
  "assignedAgentId": "uuid"
}
```

**RBAC:** Agent sadece kendi ID'sini `assignedAgentId` olarak kullanabilir.

### GET /listings
**Authenticated**

İlanları listele (RBAC filtrelenmiş).

**Query Parameters:**
- `status` (enum): `active_for_sale`, `active_for_rent`, `sold`, `rented`, `inactive`
- `currency` (enum): `TRY`, `USD`, `EUR`, `GBP`
- `location` (string): Konum filtresi
- `minPrice` (number): Minimum fiyat
- `maxPrice` (number): Maksimum fiyat
- `minArea` (number): Minimum alan (m²)
- `maxArea` (number): Maksimum alan (m²)
- `roomCount` (number): Oda sayısı

**Example:**
```
GET /listings?status=active_for_sale&minPrice=1000000&maxPrice=5000000&roomCount=3
```

**RBAC:** Agent sadece kendi atanan ilanlarını görür.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Lüks Villa",
    "price": 5000000,
    "currency": "USD",
    "status": "active_for_sale",
    "location": "Bebek, İstanbul",
    "netArea": 350.5,
    "roomCount": 5,
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "order": 0
      }
    ],
    "assignedAgent": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /listings/:id
**Authenticated**

İlan detayını getir.

**RBAC:** Agent sadece kendi atanan ilanını görebilir.

### PATCH /listings/:id
**Authenticated**

İlanı güncelle.

**RBAC:** Agent sadece kendi atanan ilanını güncelleyebilir. Agent `assignedAgentId` değiştiremez.

### DELETE /listings/:id
**Authenticated**

İlanı sil.

**RBAC:** Agent sadece kendi atanan ilanını silebilir.

---

## Leads (Potansiyel Müşteri Yönetimi)

### POST /leads
**Authenticated**

Yeni lead oluştur.

**Request Body:**
```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+905551234567",
  "source": "contact_form",
  "relatedListingId": "uuid",
  "assignedAgentId": "uuid"
}
```

**RBAC:** Agent sadece kendi ID'sini `assignedAgentId` olarak kullanabilir.

### GET /leads
**Authenticated**

Lead'leri listele (RBAC filtrelenmiş).

**Query Parameters:**
- `status` (enum): `new`, `in_progress`, `completed`

**Example:**
```
GET /leads?status=new
```

**RBAC:** Agent sadece kendi atanan lead'lerini görür.

**Response:**
```json
[
  {
    "id": "uuid",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "phone": "+905551234567",
    "source": "contact_form",
    "status": "new",
    "assignedAgent": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "notes": [
      {
        "id": "uuid",
        "content": "Müşteri ile görüşüldü...",
        "createdBy": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /leads/:id
**Authenticated**

Lead detayını getir.

**RBAC:** Agent sadece kendi atanan lead'ini görebilir.

### PATCH /leads/:id
**Authenticated**

Lead'i güncelle.

**Request Body:**
```json
{
  "status": "in_progress",
  "assignedAgentId": "uuid"
}
```

**RBAC:** Agent sadece kendi atanan lead'ini güncelleyebilir. Agent `assignedAgentId` değiştiremez.

### DELETE /leads/:id
**Authenticated**

Lead'i sil.

**RBAC:** Agent sadece kendi atanan lead'ini silebilir.

### POST /leads/:id/notes
**Authenticated**

Lead'e not ekle.

**Request Body:**
```json
{
  "content": "Müşteri ile görüşüldü. İlan hakkında bilgi verildi."
}
```

**RBAC:** Lead'e erişim yetkisi olan kullanıcılar not ekleyebilir.

### DELETE /leads/notes/:noteId
**Authenticated**

Lead notunu sil.

**RBAC:** Lead'e erişim yetkisi olan kullanıcılar not silebilir.

---

## CMS (Kurumsal İçerik Yönetimi)

### GET /cms/pages/:type
**Public**

CMS sayfasını type'a göre getir.

**Path Parameters:**
- `type` (enum): `about`, `services`, `mortgage`

**Response:**
```json
{
  "id": "uuid",
  "type": "about",
  "title": "Hakkımızda",
  "content": "<p>Öngel Gayrimenkul hakkında...</p>",
  "metaTitle": "Hakkımızda - Öngel Gayrimenkul",
  "metaDescription": "...",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /cms/pages
**Admin Only**

Yeni CMS sayfası oluştur.

**Request Body:**
```json
{
  "type": "about",
  "title": "Hakkımızda",
  "content": "<p>WYSIWYG içerik...</p>",
  "metaTitle": "Hakkımızda - Öngel Gayrimenkul",
  "metaDescription": "SEO açıklaması"
}
```

### GET /cms/pages
**Admin Only**

Tüm CMS sayfalarını listele.

### GET /cms/pages/:id
**Admin Only**

CMS sayfası detayını getir.

### PATCH /cms/pages/:id
**Admin Only**

CMS sayfasını güncelle.

### DELETE /cms/pages/:id
**Admin Only**

CMS sayfasını sil.

---

## Hata Kodları

- `400` - Bad Request (Validation hatası)
- `401` - Unauthorized (Token geçersiz/eksik)
- `403` - Forbidden (Yetki yok)
- `404` - Not Found (Kaynak bulunamadı)
- `500` - Internal Server Error

---

## Swagger Documentation

API dokümantasyonu: `http://localhost:3001/api/docs`

