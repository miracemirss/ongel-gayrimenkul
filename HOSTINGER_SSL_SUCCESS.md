# 🎉 SSL Sertifikası Başarıyla Alındı!

## ✅ HTTPS Aktif!

SSL sertifikası başarıyla alındı. Artık siteniz HTTPS üzerinden erişilebilir!

---

## 🔍 Test Adımları

### 1. HTTPS Test (SSH'da)

**SSH terminal'inde:**
```bash
# Frontend test
curl -I https://ongelgayrimenkul.com
curl -I https://www.ongelgayrimenkul.com

# Backend test
curl -I https://api.ongelgayrimenkul.com/api/docs
```

**Beklenen çıktı:**
```
HTTP/2 200
# veya
HTTP/2 301
```

### 2. Browser'da Test

**Tarayıcınızda açın:**
- ✅ `https://ongelgayrimenkul.com` (Frontend)
- ✅ `https://www.ongelgayrimenkul.com` (Frontend)
- ✅ `https://api.ongelgayrimenkul.com/api/docs` (Backend Swagger)

**Kontrol:**
- 🔒 Kilit ikonu görünüyor mu?
- 🔒 "Secure" yazıyor mu?
- 🔒 HTTPS çalışıyor mu?

### 3. SSL Sertifika Kontrolü

**SSH'da:**
```bash
# Sertifika durumu
certbot certificates
```

**Beklenen çıktı:**
```
Found the following certificates:
  Certificate Name: ongelgayrimenkul.com
    Domains: ongelgayrimenkul.com www.ongelgayrimenkul.com
    Expiry Date: 2026-03-10 (90 days)
    Certificate Path: /etc/letsencrypt/live/ongelgayrimenkul.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/ongelgayrimenkul.com/privkey.pem
```

---

## ⚙️ Environment Variables Güncelleme

### Frontend .env.local

**SSH'da:**
```bash
cd /var/www/ongel-gayrimenkul/frontend
nano .env.local
```

**Güncelleyin:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Veya API subdomain kullanıyorsanız:**
```env
NEXT_PUBLIC_API_URL=https://api.ongelgayrimenkul.com/api
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Frontend'i restart edin:**
```bash
pm2 restart frontend
```

### Backend .env

**SSH'da:**
```bash
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

**Güncelleyin:**
```env
FRONTEND_URL=https://ongelgayrimenkul.com
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Backend'i restart edin:**
```bash
pm2 restart backend
```

---

## 🔄 Otomatik SSL Yenileme

Let's Encrypt sertifikaları **90 gün** geçerlidir. Certbot otomatik olarak yeniler.

**Kontrol:**
```bash
# Otomatik yenileme test
certbot renew --dry-run
```

**Manuel yenileme (gerekirse):**
```bash
certbot renew
```

**Cron job (otomatik yenileme):**
Certbot otomatik olarak systemd timer kullanır. Kontrol edin:
```bash
systemctl status certbot.timer
```

---

## 📋 Son Kontrol Listesi

- [x] SSL sertifikası alındı
- [ ] HTTPS test edildi (curl)
- [ ] Browser'da test edildi
- [ ] Frontend environment variable güncellendi
- [ ] Backend environment variable güncellendi
- [ ] Frontend restart edildi
- [ ] Backend restart edildi
- [ ] Tüm sayfalar HTTPS üzerinden çalışıyor

---

## 🎯 Sonraki Adımlar

### 1. Frontend ve Backend'i Test Edin

**Browser'da:**
- ✅ Frontend açılıyor mu? (`https://ongelgayrimenkul.com`)
- ✅ Backend API çalışıyor mu? (`https://api.ongelgayrimenkul.com/api/docs`)
- ✅ Login çalışıyor mu?
- ✅ Listings görüntüleniyor mu?

### 2. CORS Kontrolü

**Browser console'da:**
- ❌ CORS hatası var mı?
- ✅ API çağrıları çalışıyor mu?

**Eğer CORS hatası varsa:**
- Backend `.env` dosyasında `FRONTEND_URL` doğru mu?
- Backend restart edildi mi?

### 3. Admin Panel Test

**Browser'da:**
- ✅ Admin panel açılıyor mu?
- ✅ Login çalışıyor mu?
- ✅ Dashboard çalışıyor mu?

---

## 🆘 Sorun Giderme

### HTTPS Çalışmıyor

1. **Nginx yapılandırmasını kontrol edin:**
   ```bash
   cat /etc/nginx/sites-available/ongelgayrimenkul
   ```

2. **Nginx loglarını kontrol edin:**
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **SSL sertifikasını kontrol edin:**
   ```bash
   certbot certificates
   ```

### Mixed Content Hatası

**Browser console'da "Mixed Content" hatası görüyorsanız:**

1. **Frontend'de HTTPS kullanın:**
   - `http://` yerine `https://` kullanın
   - Environment variable'ları güncelleyin

2. **Backend'de HTTPS kullanın:**
   - API URL'leri `https://` ile başlamalı

### CORS Hatası

1. **Backend `.env` dosyasını kontrol edin:**
   ```env
   FRONTEND_URL=https://ongelgayrimenkul.com
   ```

2. **Backend'i restart edin:**
   ```bash
   pm2 restart backend
   ```

---

## ✅ Başarı!

Artık siteniz:
- ✅ HTTPS üzerinden erişilebilir
- ✅ Güvenli bağlantı kullanıyor
- ✅ SSL sertifikası otomatik yenileniyor
- ✅ Browser'da kilit ikonu görünüyor

**Tebrikler! Projeniz Hostinger'da başarıyla deploy edildi! 🚀**

---

## 📝 Özet

1. ✅ SSL sertifikası alındı
2. ✅ HTTPS aktif
3. ✅ Environment variables güncellenmeli
4. ✅ Frontend ve Backend restart edilmeli
5. ✅ Test edilmeli

**Sonraki:** Frontend ve Backend environment variables'ı güncelleyin ve restart edin!

