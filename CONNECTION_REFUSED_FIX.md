# 🔧 ERR_CONNECTION_REFUSED Hatası Çözümü

## ❌ Hata

```
ERR_CONNECTION_REFUSED
ongelgayrimenkul.com bağlanmayı reddetti
```

**Sebep:** Nginx çalışmıyor, Frontend çalışmıyor, veya Firewall port'ları engelliyor.

---

## ✅ Çözüm Adımları

### Adım 1: Nginx Durumunu Kontrol Edin

**SSH terminal'inde:**
```bash
# Nginx durumu
systemctl status nginx

# Nginx çalışmıyorsa başlat
systemctl start nginx
systemctl enable nginx

# Nginx config test
nginx -t

# Nginx restart
systemctl restart nginx
```

**Beklenen:** Nginx "active (running)" olmalı

---

### Adım 2: Frontend Durumunu Kontrol Edin

**SSH terminal'inde:**
```bash
# PM2 durumu
pm2 status

# Frontend logları
pm2 logs frontend --lines 20

# Frontend çalışmıyorsa başlat
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start
pm2 save
```

**Beklenen:** Frontend "online" olmalı

---

### Adım 3: Port Kullanımını Kontrol Edin

**SSH terminal'inde:**
```bash
# Port 80 (HTTP)
netstat -tulpn | grep 80

# Port 443 (HTTPS)
netstat -tulpn | grep 443

# Port 3000 (Frontend)
netstat -tulpn | grep 3000

# Port 3001 (Backend)
netstat -tulpn | grep 3001
```

**Beklenen:**
- Port 80: Nginx dinliyor olmalı
- Port 443: Nginx dinliyor olmalı (SSL varsa)
- Port 3000: Frontend (PM2) dinliyor olmalı
- Port 3001: Backend (PM2) dinliyor olmalı

---

### Adım 4: Firewall Kontrolü

**SSH terminal'inde:**
```bash
# Firewall durumu
ufw status

# Eğer aktifse, port'ları aç
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

**Veya Hostinger Firewall:**
- Hostinger Dashboard → VPS → Firewall
- Port 80 ve 443 açık olmalı

---

### Adım 5: Nginx Loglarını Kontrol Edin

**SSH terminal'inde:**
```bash
# Nginx error logları
tail -f /var/log/nginx/error.log

# Nginx access logları
tail -f /var/log/nginx/access.log
```

**Kontrol:** Hata mesajları var mı?

---

### Adım 6: Backend Durumunu Kontrol Edin

**SSH terminal'inde:**
```bash
# PM2 durumu
pm2 status

# Backend logları
pm2 logs backend --lines 20

# Backend çalışmıyorsa başlat
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start:prod
pm2 save
```

**Beklenen:** Backend "online" olmalı

---

## 🆘 Sorun Giderme

### Nginx Çalışmıyor

1. **Nginx durumu:**
   ```bash
   systemctl status nginx
   ```

2. **Nginx başlat:**
   ```bash
   systemctl start nginx
   systemctl enable nginx
   ```

3. **Nginx config test:**
   ```bash
   nginx -t
   ```

4. **Nginx logları:**
   ```bash
   journalctl -u nginx -n 50
   ```

### Frontend Çalışmıyor

1. **PM2 durumu:**
   ```bash
   pm2 status
   ```

2. **Frontend logları:**
   ```bash
   pm2 logs frontend --lines 50
   ```

3. **Frontend restart:**
   ```bash
   pm2 restart frontend
   ```

4. **Frontend yeniden başlat:**
   ```bash
   cd /var/www/ongel-gayrimenkul/frontend
   pm2 delete frontend
   pm2 start npm --name "frontend" -- run start
   pm2 save
   ```

### Port Kullanımda

1. **Hangi process port'u kullanıyor?**
   ```bash
   netstat -tulpn | grep 80
   ```

2. **Process'i durdur:**
   ```bash
   kill -9 [PID]
   ```

3. **Nginx restart:**
   ```bash
   systemctl restart nginx
   ```

### Firewall Engelliyor

1. **UFW durumu:**
   ```bash
   ufw status
   ```

2. **Port'ları aç:**
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw reload
   ```

3. **Hostinger Firewall:**
   - Hostinger Dashboard → VPS → Firewall
   - Port 80 ve 443 açık olmalı

---

## ✅ Başarı Kontrolü

- [x] Nginx çalışıyor
- [x] Frontend çalışıyor
- [x] Backend çalışıyor
- [x] Port 80 açık
- [x] Port 443 açık
- [x] Firewall port'ları açık
- [x] Browser'dan site erişilebilir

---

## 📝 Özet

1. ✅ **Nginx durumunu kontrol et:** `systemctl status nginx`
2. ✅ **Frontend durumunu kontrol et:** `pm2 status`
3. ✅ **Port kullanımını kontrol et:** `netstat -tulpn | grep 80`
4. ✅ **Firewall kontrolü:** `ufw status`
5. ✅ **Nginx loglarını kontrol et:** `tail -f /var/log/nginx/error.log`
6. ✅ **Gerekirse restart et:** Nginx ve PM2

**Not:** ERR_CONNECTION_REFUSED genellikle Nginx veya Frontend çalışmadığında olur!

