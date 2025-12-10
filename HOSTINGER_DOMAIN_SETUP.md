# 🌐 Hostinger Domain Kurulumu

## Özet

Hostinger'da satın aldığınız domain'i mevcut Vercel (Frontend) ve Railway (Backend) deployment'larına bağlayabilirsiniz.

**Avantajlar:**
- ✅ Vercel ve Railway'ın otomatik HTTPS desteği
- ✅ Kolay yönetim
- ✅ Ücretsiz SSL sertifikası
- ✅ Mevcut deployment'ları değiştirmeye gerek yok

---

## 🎯 Senaryo 1: Custom Domain Ekleme (Önerilen)

### Frontend (Vercel) için Domain

1. **Vercel Dashboard → Project → Settings → Domains**
2. Domain'inizi ekleyin: `ongelgayrimenkul.com` (veya ne satın aldıysanız)
3. Vercel size DNS kayıtlarını verecek

### Backend (Railway) için Domain

1. **Railway Dashboard → Service → Settings → Networking**
2. "Custom Domain" butonuna tıklayın
3. Domain'inizi ekleyin: `api.ongelgayrimenkul.com` (veya `backend.ongelgayrimenkul.com`)
4. Railway size DNS kayıtlarını verecek

### Hostinger DNS Ayarları

**Hostinger Dashboard → Domain → DNS Management**

Vercel için:
```
Type: CNAME
Name: @ (veya www)
Value: cname.vercel-dns.com
```

Railway için:
```
Type: CNAME
Name: api (veya backend)
Value: [Railway'ın verdiği CNAME değeri]
```

**Veya A Record (Root domain için):**
```
Type: A
Name: @
Value: [Vercel'ın verdiği IP adresi]
```

---

## 🎯 Senaryo 2: Hostinger VPS ile Deploy (Gelişmiş)

Eğer Hostinger VPS kullanmak isterseniz:

### Gereksinimler:
- Node.js 18+
- PostgreSQL (veya Supabase kullanmaya devam)
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL sertifikası (Let's Encrypt)

### Adımlar:

1. **VPS'e SSH ile bağlanın**
2. **Node.js kurun**
3. **Backend'i deploy edin**
4. **Frontend'i build edip static olarak serve edin** (veya Next.js standalone)
5. **Nginx reverse proxy kurun**
6. **SSL sertifikası ekleyin**

**Not:** Bu yöntem daha karmaşık ve manuel yönetim gerektirir.

---

## ✅ Önerilen Yöntem: Custom Domain Ekleme

### Neden?

1. **Kolay:** Sadece DNS ayarları yapılır
2. **Otomatik HTTPS:** Vercel ve Railway otomatik SSL sağlar
3. **Bakım Yok:** Vercel ve Railway her şeyi yönetir
4. **Ölçeklenebilir:** Trafik arttıkça otomatik ölçeklenir

### Domain Yapısı Önerisi:

```
ongelgayrimenkul.com          → Vercel (Frontend)
www.ongelgayrimenkul.com      → Vercel (Frontend)
api.ongelgayrimenkul.com      → Railway (Backend)
```

---

## 📝 Adım Adım: Vercel Custom Domain

### 1. Vercel Dashboard

1. Project → Settings → Domains
2. "Add Domain" butonuna tıklayın
3. Domain'inizi girin: `ongelgayrimenkul.com`
4. Vercel size DNS kayıtlarını verecek

### 2. Hostinger DNS Ayarları

**Hostinger Dashboard → Domain → DNS Management**

Vercel'in verdiği kayıtları ekleyin:
- A Record (root domain için)
- CNAME Record (www için)

### 3. SSL Sertifikası

Vercel otomatik olarak SSL sertifikası ekler (5-10 dakika)

---

## 📝 Adım Adım: Railway Custom Domain

### 1. Railway Dashboard

1. Service → Settings → Networking
2. "Custom Domain" butonuna tıklayın
3. Subdomain girin: `api.ongelgayrimenkul.com`
4. Railway size DNS kayıtlarını verecek

### 2. Hostinger DNS Ayarları

**Hostinger Dashboard → Domain → DNS Management**

Railway'ın verdiği CNAME kaydını ekleyin:
```
Type: CNAME
Name: api
Value: [Railway'ın verdiği değer]
```

### 3. SSL Sertifikası

Railway otomatik olarak SSL sertifikası ekler

---

## 🔧 Environment Variables Güncelleme

### Vercel

**Vercel Dashboard → Environment Variables**

`NEXT_PUBLIC_API_URL` güncelleyin:
```
https://api.ongelgayrimenkul.com/api
```

### Railway

**Railway Dashboard → Variables**

`FRONTEND_URL` güncelleyin:
```
https://ongelgayrimenkul.com
```

---

## ✅ Kontrol

1. **Frontend:** `https://ongelgayrimenkul.com` açılıyor mu?
2. **Backend:** `https://api.ongelgayrimenkul.com/api/docs` açılıyor mu?
3. **SSL:** HTTPS çalışıyor mu? (kilit ikonu)
4. **API:** Frontend'den backend'e istekler çalışıyor mu?

---

## 🆘 Sorun Giderme

### DNS Propagasyon

DNS değişiklikleri 24-48 saat sürebilir. Genellikle 1-2 saat içinde aktif olur.

**Kontrol:**
```bash
# Terminal'de
nslookup ongelgayrimenkul.com
```

### SSL Sertifikası

SSL sertifikası otomatik eklenir ama 5-10 dakika sürebilir.

**Kontrol:**
- Browser'da kilit ikonunu kontrol edin
- Vercel/Railway dashboard'da SSL durumunu kontrol edin

### CORS Hatası

Custom domain ekledikten sonra CORS hatası alırsanız:

1. Railway → Variables → `FRONTEND_URL` güncelleyin
2. Railway'ı yeniden deploy edin

---

## 📞 Yardım

Sorun yaşarsanız:
1. DNS kayıtlarını kontrol edin
2. SSL sertifikası durumunu kontrol edin
3. Environment variables'ı kontrol edin
4. Vercel/Railway logs'u kontrol edin

