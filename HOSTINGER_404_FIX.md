# 🔧 Hostinger 404 Hatası Çözümü

## ❌ Hata

```
HTTP/1.1 404 Not Found
Server: openresty
X-Hostinger-Datacenter: gcp-usc1
```

**Sebep:** Domain Hostinger'ın edge/CDN sunucularına yönlendiriliyor, direkt sunucuya gitmiyor.

---

## ✅ Çözüm Adımları

### Adım 1: Nginx Yapılandırmasını Kontrol

**SSH'da:**
```bash
# Nginx config dosyası var mı?
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Nginx config içeriği
cat /etc/nginx/sites-available/ongelgayrimenkul

# Nginx durumu
systemctl status nginx
```

**Beklenen:**
- `/etc/nginx/sites-available/ongelgayrimenkul` dosyası var
- `/etc/nginx/sites-enabled/ongelgayrimenkul` symbolic link var

---

### Adım 2: Nginx Config'i Aktif Et

**Eğer config dosyası varsa ama aktif değilse:**

**SSH'da:**
```bash
# Symbolic link oluştur
ln -s /etc/nginx/sites-available/ongelgayrimenkul /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Nginx config test
nginx -t

# Nginx restart
systemctl restart nginx
```

---

### Adım 3: Nginx Config Dosyasını Oluştur

**Eğer config dosyası yoksa:**

**SSH'da:**
```bash
# Nginx config dosyası oluştur
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**İçerik:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.ongelgayrimenkul.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

    # Let's Encrypt için .well-known klasörüne erişim
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Aktif et:**
```bash
ln -s /etc/nginx/sites-available/ongelgayrimenkul /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### Adım 4: .well-known Klasörünü Oluştur

**SSH'da:**
```bash
mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html/.well-known
```

---

### Adım 5: Hostinger CDN/Proxy Ayarlarını Kontrol

**Hostinger Dashboard → Domain → DNS Management**

**Kontrol edin:**
1. **CDN/Proxy aktif mi?** → Kapatın (direkt IP'ye yönlendirmek için)
2. **DNS kayıtları doğru mu?**
   - `@` → `72.60.39.172` (A record)
   - `www` → `72.60.39.172` (A record)
   - `api` → `72.60.39.172` (A record)

**Not:** Bazı Hostinger paketlerinde CDN/Proxy otomatik aktif olabilir. Bunu kapatmanız gerekebilir.

---

### Adım 6: Domain Erişilebilirliğini Tekrar Test Et

**SSH'da:**
```bash
# Domain test
curl -I http://ongelgayrimenkul.com

# Localhost test (sunucuda)
curl -I http://localhost:3000
```

**Beklenen çıktı (başarılı):**
```
HTTP/1.1 200 OK
# veya
HTTP/1.1 301 Moved Permanently
```

**Eğer hala 404 alıyorsanız:**
- Hostinger CDN/Proxy hala aktif olabilir
- DNS kayıtları yanlış olabilir
- Nginx yapılandırması eksik olabilir

---

### Adım 7: PM2 Process'lerini Kontrol

**SSH'da:**
```bash
# PM2 durumu
pm2 status

# Frontend çalışıyor mu?
pm2 logs frontend --lines 10

# Backend çalışıyor mu?
pm2 logs backend --lines 10
```

**Eğer çalışmıyorsa:**
```bash
# Frontend başlat
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start

# Backend başlat
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start

# Kaydet
pm2 save
```

---

## 🆘 Sorun Giderme

### Hala 404 Hatası

1. **Nginx loglarını kontrol edin:**
   ```bash
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

2. **Nginx config test:**
   ```bash
   nginx -t
   ```

3. **Nginx durumu:**
   ```bash
   systemctl status nginx
   ```

4. **Port kullanımını kontrol edin:**
   ```bash
   netstat -tulpn | grep 80
   netstat -tulpn | grep 3000
   ```

### Hostinger CDN Bypass

**Eğer Hostinger CDN/Proxy aktifse:**

1. **Hostinger Dashboard → Domain → DNS Management**
2. **CDN/Proxy ayarlarını kapatın**
3. **DNS kayıtlarını kontrol edin** (direkt IP'ye yönlendirmeli)
4. **1-2 saat bekleyin** (DNS propagasyon)

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

3. **Nginx logları:**
   ```bash
   journalctl -u nginx -n 50
   ```

---

## ✅ Başarılı Sonrası

Domain erişilebilir olduktan sonra:

1. **SSL sertifikası alın:**
   ```bash
   certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
   ```

2. **HTTPS test:**
   ```bash
   curl -I https://ongelgayrimenkul.com
   ```

3. **Browser'da test:**
   - `https://ongelgayrimenkul.com` (Frontend)
   - `https://api.ongelgayrimenkul.com/api/docs` (Backend)

---

## 📝 Özet

1. ✅ **Nginx config dosyasını kontrol edin**
2. ✅ **Nginx config'i aktif edin** (symbolic link)
3. ✅ **.well-known klasörünü oluşturun**
4. ✅ **Hostinger CDN/Proxy'yi kapatın** (gerekirse)
5. ✅ **Nginx'i restart edin**
6. ✅ **Domain erişilebilirliğini test edin**
7. ✅ **SSL sertifikası alın**

**Not:** Hostinger CDN/Proxy aktifse, domain direkt sunucuya gitmez. Bunu kapatmanız gerekebilir.

