# 🌐 Hostinger DNS Kaydı Sorun Giderme

## ❌ Hata Mesajı

```
DNS resource record is not valid or conflicts with another resource record
```

## 🔍 Sebepler

1. **Zaten aynı kayıt var** (www için A record mevcut)
2. **CNAME ve A record çakışması** (aynı isim için hem CNAME hem A var)
3. **Yanlış format** (Name alanında yanlış değer)
4. **Root domain çakışması** (@ kaydı ile www çakışıyor)

---

## ✅ Çözüm Adımları

### Adım 1: Mevcut DNS Kayıtlarını Kontrol Edin

**Hostinger Dashboard → Domain → DNS Management**

Mevcut kayıtları listeleyin:
- `@` (root domain) kaydı var mı?
- `www` kaydı var mı?
- `api` kaydı var mı?

**Kontrol edin:**
- Hangi Type? (A, CNAME, MX, vb.)
- Hangi IP/Value?
- Aktif mi?

---

### Adım 2: Mevcut Kayıtları Düzenleyin (Önerilen)

**Eğer kayıt zaten varsa:**

1. **Mevcut kaydı bulun** (www için)
2. **"Edit" (Düzenle) butonuna tıklayın**
3. **IP adresini güncelleyin:** `72.60.39.172`
4. **TTL:** `3600`
5. **Save (Kaydet)**

**Silmeyin, sadece düzenleyin!**

---

### Adım 3: Yeni Kayıt Ekleme (Eğer Yoksa)

**Sırayla ekleyin:**

#### 1. Root Domain (@) Kaydı

```
Type: A
Name: @ (veya boş bırakın - Hostinger otomatik @ olarak algılar)
Points to: 72.60.39.172
TTL: 3600
```

**Not:** Bazı Hostinger panellerinde Name alanına `@` yazmanız gerekir, bazılarında boş bırakmanız yeterlidir.

#### 2. www Subdomain Kaydı

```
Type: A
Name: www (sadece "www", "www." değil)
Points to: 72.60.39.172
TTL: 3600
```

**ÖNEMLİ:** 
- Name alanına sadece `www` yazın
- `www.` veya `www.ongelgayrimenkul.com` yazmayın
- Sadece subdomain adını yazın: `www`

#### 3. api Subdomain Kaydı

```
Type: A
Name: api (sadece "api", "api." değil)
Points to: 72.60.39.172
TTL: 3600
```

**ÖNEMLİ:**
- Name alanına sadece `api` yazın
- `api.` veya `api.ongelgayrimenkul.com` yazmayın

---

### Adım 4: CNAME Çakışması Kontrolü

**Eğer www için CNAME kaydı varsa:**

1. **CNAME kaydını silin** (eğer A record kullanacaksanız)
2. **A record ekleyin**

**Not:** Aynı isim için hem CNAME hem A record olamaz. Birini seçin:
- **A record:** Direkt IP'ye yönlendirir (önerilen)
- **CNAME:** Başka bir domain'e yönlendirir

---

### Adım 5: Kayıtları Kontrol Edin

**Ekledikten sonra:**

1. **DNS Management sayfasında kayıtları görün:**
   - `@` → `72.60.39.172` (A)
   - `www` → `72.60.39.172` (A)
   - `api` → `72.60.39.172` (A)

2. **Bekleyin:** DNS propagasyon 1-24 saat sürebilir (genellikle 1-2 saat)

3. **Test edin (SSH'da):**
   ```bash
   nslookup ongelgayrimenkul.com
   nslookup www.ongelgayrimenkul.com
   nslookup api.ongelgayrimenkul.com
   ```

**Beklenen çıktı:** Her biri `72.60.39.172` IP'sini göstermeli.

---

## 🆘 Hala Çalışmıyorsa

### Seçenek 1: Tüm Kayıtları Sil ve Yeniden Ekle

**DİKKAT:** Bu işlem domain'i geçici olarak erişilemez yapabilir!

1. **Mevcut tüm A kayıtlarını silin** (@, www, api)
2. **5 dakika bekleyin**
3. **Yeniden ekleyin** (yukarıdaki sırayla)

### Seçenek 2: Hostinger Destek ile İletişime Geçin

1. **Hostinger Dashboard → Support**
2. **"DNS kaydı ekleyemiyorum" konulu ticket açın**
3. **Hata mesajını ve ekran görüntüsünü paylaşın**

### Seçenek 3: Alternatif: Sadece Root Domain Kullanın

Eğer www ve api kayıtları eklenemiyorsa:

1. **Sadece root domain (@) kaydını ekleyin**
2. **Nginx'te www ve api için ayrı server block'ları kullanmayın**
3. **Tüm trafiği root domain'e yönlendirin**

**Nginx config:**
```nginx
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com api.ongelgayrimenkul.com;

    location /api {
        proxy_pass http://localhost:3001;
        # ... proxy ayarları
    }

    location / {
        proxy_pass http://localhost:3000;
        # ... proxy ayarları
    }
}
```

---

## 📝 Özet

1. ✅ **Mevcut kayıtları kontrol edin**
2. ✅ **Varsa düzenleyin, yoksa ekleyin**
3. ✅ **Name alanına sadece subdomain adını yazın** (www, api)
4. ✅ **CNAME çakışması varsa silin**
5. ✅ **DNS propagasyon bekleyin** (1-2 saat)
6. ✅ **Test edin** (nslookup)

---

## ✅ Başarılı DNS Sonrası

DNS kayıtları başarıyla eklendikten ve propagate olduktan sonra:

1. **SSL sertifikası alın:**
   ```bash
   certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com
   ```

2. **Test edin:**
   ```bash
   curl -I http://ongelgayrimenkul.com
   curl -I http://www.ongelgayrimenkul.com
   curl -I http://api.ongelgayrimenkul.com
   ```

**Beklenen çıktı:** `200 OK` veya `301/302 Redirect`

