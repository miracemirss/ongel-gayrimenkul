# 🧪 Hostinger Backend Test Rehberi

## ⚠️ Önemli Not

**Backend Hostinger sunucusunda çalışıyor, Windows localhost'unuzda değil!**

Windows'tan `curl http://localhost:3001/api` çalışmaz çünkü backend sunucuda.

---

## ✅ Doğru Test Yöntemleri

### Yöntem 1: SSH ile Sunucuda Test (Önerilen)

**SSH ile sunucuya bağlanın:**
```bash
ssh root@72.60.39.172
```

**Sunucuda test edin:**
```bash
# Backend test
curl http://localhost:3001/api

# Frontend test
curl http://localhost:3000
```

**Beklenen çıktı:**
```json
{"message":"API is running"}
```

---

### Yöntem 2: PM2 Durumunu Kontrol

**SSH'da:**
```bash
# PM2 durumu
pm2 status

# Backend logları
pm2 logs backend

# Frontend logları
pm2 logs frontend
```

**Beklenen çıktı:**
```
┌───────────┬────┬─────────┬──────┬──────┬──────────┐
│ App name  │ id │ version │ mode │ pid  │ status   │
├───────────┼────┼─────────┼──────┼──────┼──────────┤
│ backend   │ 0  │ N/A     │ fork │ 1234 │ online   │
│ frontend  │ 1  │ N/A     │ fork │ 1235 │ online   │
└───────────┴────┴─────────┴──────┴──────┴──────────┘
```

**Eğer çalışmıyorsa:**
```bash
# Backend başlat
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start:prod

# Frontend başlat
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start

# Kaydet
pm2 save
```

---

### Yöntem 3: Domain Üzerinden Test (DNS Hazırsa)

**DNS kayıtları eklendikten ve propagate olduktan sonra:**

```bash
# Windows PowerShell'de
curl http://api.ongelgayrimenkul.com/api

# Veya browser'da
# http://api.ongelgayrimenkul.com/api/docs
```

**Beklenen çıktı:**
- `200 OK` veya JSON response
- Swagger docs açılıyor

---

### Yöntem 4: IP Üzerinden Test (Nginx Yapılandırmasına Bağlı)

**Not:** Nginx yapılandırmasına göre çalışmayabilir.

```bash
# Windows PowerShell'de
curl http://72.60.39.172:3001/api
```

**Eğer çalışmıyorsa:**
- Nginx yapılandırması domain bazlı olabilir
- Firewall port 3001'i engelliyor olabilir
- Nginx reverse proxy kullanılıyor olabilir

---

## 🔍 Sorun Giderme

### Backend Çalışmıyor

**1. PM2 durumunu kontrol edin:**
```bash
pm2 status
```

**2. Backend loglarını kontrol edin:**
```bash
pm2 logs backend
```

**3. Backend'i yeniden başlatın:**
```bash
cd /var/www/ongel-gayrimenkul/backend
pm2 restart backend
```

**4. .env dosyasını kontrol edin:**
```bash
cat /var/www/ongel-gayrimenkul/backend/.env
```

**5. Port kullanımını kontrol edin:**
```bash
netstat -tulpn | grep 3001
```

---

### Frontend Çalışmıyor

**1. PM2 durumunu kontrol edin:**
```bash
pm2 status
```

**2. Frontend loglarını kontrol edin:**
```bash
pm2 logs frontend
```

**3. Frontend'i yeniden başlatın:**
```bash
cd /var/www/ongel-gayrimenkul/frontend
pm2 restart frontend
```

**4. .env.local dosyasını kontrol edin:**
```bash
cat /var/www/ongel-gayrimenkul/frontend/.env.local
```

**5. Port kullanımını kontrol edin:**
```bash
netstat -tulpn | grep 3000
```

---

### Nginx Çalışmıyor

**1. Nginx durumunu kontrol edin:**
```bash
systemctl status nginx
```

**2. Nginx config test:**
```bash
nginx -t
```

**3. Nginx loglarını kontrol edin:**
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

**4. Nginx'i restart edin:**
```bash
systemctl restart nginx
```

---

## 📝 Test Checklist

- [ ] SSH ile sunucuya bağlanabiliyorum
- [ ] PM2 process'leri çalışıyor (backend, frontend)
- [ ] Backend localhost:3001'de çalışıyor (sunucuda)
- [ ] Frontend localhost:3000'de çalışıyor (sunucuda)
- [ ] Nginx çalışıyor
- [ ] DNS kayıtları eklendi
- [ ] DNS propagasyon tamamlandı (1-2 saat)
- [ ] Domain üzerinden erişilebiliyor

---

## ✅ Başarılı Test Sonrası

Tüm testler başarılı olduktan sonra:

1. **SSL sertifikası alın:**
   ```bash
   certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com
   ```

2. **HTTPS test edin:**
   ```bash
   curl https://ongelgayrimenkul.com
   curl https://api.ongelgayrimenkul.com/api/docs
   ```

3. **Browser'da test edin:**
   - `https://ongelgayrimenkul.com` (Frontend)
   - `https://api.ongelgayrimenkul.com/api/docs` (Backend Swagger)

---

## 🆘 Hala Çalışmıyorsa

1. **PM2 loglarını paylaşın:**
   ```bash
   pm2 logs --lines 50
   ```

2. **Nginx loglarını paylaşın:**
   ```bash
   tail -50 /var/log/nginx/error.log
   ```

3. **System loglarını kontrol edin:**
   ```bash
   journalctl -u nginx -n 50
   ```

4. **Port kullanımını kontrol edin:**
   ```bash
   netstat -tulpn
   ```

