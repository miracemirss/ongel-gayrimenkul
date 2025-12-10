# 📧 SMTP E-posta Yapılandırma Rehberi

## Sorun

İletişim formu gönderilirken e-posta gönderilemiyor. Hata: `getaddrinfo ENOTFOUND smtp.example.com`

## Çözüm

Backend `.env` dosyasında SMTP ayarlarını yapılandırmanız gerekiyor.

---

## Hostinger SMTP Ayarları

Hostinger'da e-posta hesabınız varsa, şu ayarları kullanın:

### Hostinger SMTP (Titan Email)

```env
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

### Hostinger SMTP (Alternatif)

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

---

## Gmail SMTP (Geliştirme için)

Geliştirme ortamında Gmail kullanmak isterseniz:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Gmail App Password gerekli
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

**Gmail App Password Nasıl Alınır:**
1. Google Account → Security
2. 2-Step Verification aktif olmalı
3. App Passwords → Generate
4. Oluşturulan şifreyi `SMTP_PASSWORD` olarak kullanın

---

## Diğer E-posta Sağlayıcıları

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
```

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
SMTP_SECURE=false
```

---

## Yapılandırma Adımları

### 1. Backend `.env` Dosyasını Düzenle

**Lokal geliştirme:**
```bash
cd backend
nano .env
# veya
notepad .env  # Windows
```

**Hostinger sunucusu:**
```bash
ssh root@72.60.39.172
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

### 2. SMTP Ayarlarını Ekleyin

```env
# Email Configuration
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=Ongel1234!!
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

### 3. Backend'i Restart Edin

**Lokal:**
```bash
# Backend'i durdurun (Ctrl+C)
# Sonra tekrar başlatın
npm run start:dev
```

**Hostinger:**
```bash
pm2 restart backend
pm2 logs backend --lines 50
```

### 4. Test Edin

1. İletişim formunu doldurun
2. Gönder butonuna basın
3. Backend loglarını kontrol edin:
   ```bash
   pm2 logs backend --lines 50
   ```
4. E-posta kutusunu kontrol edin (`info@ongelgayrimenkul.com`)

---

## Sorun Giderme

### "getaddrinfo ENOTFOUND" Hatası

**Sorun:** SMTP_HOST yanlış veya erişilemiyor.

**Çözüm:**
- SMTP_HOST değerini kontrol edin
- DNS çözümlemesi yapın: `nslookup smtp.titan.email`
- Firewall SMTP portunu engelliyor olabilir

### "EAUTH" Hatası

**Sorun:** SMTP_USER veya SMTP_PASSWORD yanlış.

**Çözüm:**
- E-posta adresi ve şifreyi kontrol edin
- Gmail kullanıyorsanız App Password kullanın
- Hostinger'da e-posta hesabının aktif olduğundan emin olun

### "ECONNREFUSED" Hatası

**Sorun:** SMTP_PORT yanlış veya sunucu erişilemiyor.

**Çözüm:**
- Port 587 (TLS) veya 465 (SSL) kullanın
- SMTP_SECURE ayarını kontrol edin:
  - Port 587 → `SMTP_SECURE=false`
  - Port 465 → `SMTP_SECURE=true`

### E-posta Gönderilmiyor Ama Hata Yok

**Kontrol:**
1. Spam klasörünü kontrol edin
2. Backend loglarını kontrol edin:
   ```bash
   pm2 logs backend | grep -i email
   ```
3. SMTP sunucusu loglarını kontrol edin (Hostinger panel)

---

## Güvenlik Notları

1. **`.env` dosyasını Git'e commit etmeyin!**
   - `.gitignore` dosyasında `.env` olmalı

2. **Production'da güçlü şifreler kullanın**

3. **SMTP_PASSWORD'u asla kod içinde hardcode etmeyin**

4. **Rate limiting**: Çok fazla e-posta göndermeyin (spam olarak algılanabilir)

---

## Test Komutu

Backend'de SMTP bağlantısını test etmek için:

```bash
# Backend dizininde
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
transporter.verify().then(() => {
  console.log('✅ SMTP bağlantısı başarılı!');
}).catch(err => {
  console.error('❌ SMTP bağlantı hatası:', err.message);
});
"
```

---

## Hızlı Kontrol Listesi

- [ ] Backend `.env` dosyasında SMTP ayarları var mı?
- [ ] SMTP_HOST gerçek bir sunucu adresi mi? (example.com değil!)
- [ ] SMTP_USER ve SMTP_PASSWORD doğru mu?
- [ ] SMTP_PORT doğru mu? (587 veya 465)
- [ ] SMTP_SECURE ayarı port ile uyumlu mu?
- [ ] Backend restart edildi mi?
- [ ] E-posta hesabı aktif mi?
- [ ] Firewall SMTP portunu engelliyor mu?

---

## Örnek `.env` Dosyası

```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email Configuration (ÖNEMLİ!)
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=your-actual-password
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com

# App
NODE_ENV=production
FRONTEND_URL=https://ongelgayrimenkul.com
PORT=3001
```

