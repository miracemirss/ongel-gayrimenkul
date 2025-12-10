# 🔧 SMTP Hızlı Düzeltme

## Sorun
```
ERROR [EmailService] Email transporter not initialized. Cannot send email.
ERROR [ContactService] Error: Email service not configured
```

## Çözüm ✅

`.env` dosyasına eksik ayarlar eklendi:
- ✅ `SMTP_SECURE=true` (Port 465 için gerekli)
- ✅ `SMTP_FROM=info@ongelgayrimenkul.com`

## Yapılacaklar

### 1. Backend'i Restart Edin

**Lokal geliştirme:**
```bash
# Backend'i durdurun (Ctrl+C)
# Sonra tekrar başlatın
cd backend
npm run start:dev
```

**Hostinger sunucusu:**
```bash
ssh root@72.60.39.172
cd /var/www/ongel-gayrimenkul/backend
pm2 restart backend
pm2 logs backend --lines 50
```

### 2. Test Edin

1. İletişim formunu doldurun: `http://localhost:3000/contact`
2. Gönder butonuna basın
3. Backend loglarını kontrol edin:
   ```
   ✅ Email service initialized with SMTP: smtp.hostinger.com:465
   ✅ Contact form email sent successfully to info@ongelgayrimenkul.com
   ```

### 3. E-posta Kutusunu Kontrol Edin

`info@ongelgayrimenkul.com` adresine e-posta gelmeli.

---

## Mevcut SMTP Ayarları

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=Ongel1234!!
SMTP_SECURE=true          ← YENİ EKLENDİ
SMTP_FROM=info@ongelgayrimenkul.com  ← YENİ EKLENDİ
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

---

## Sorun Devam Ederse

### Port 465 Çalışmıyorsa

Port 587 (TLS) deneyin:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Hostinger SMTP Alternatif

```env
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_SECURE=false
```

### Bağlantı Testi

Backend loglarında şunu görmelisiniz:
```
✅ Email service initialized with SMTP: smtp.hostinger.com:465
```

Eğer hata görüyorsanız:
- SMTP_HOST doğru mu?
- SMTP_USER ve SMTP_PASSWORD doğru mu?
- E-posta hesabı aktif mi?

