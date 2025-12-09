# 🚀 Vercel Frontend Deploy Rehberi

## Hızlı Başlangıç

### 1. Vercel Hesabı Oluşturma

1. https://vercel.com adresine gidin
2. **"Sign Up"** tıklayın
3. **GitHub ile giriş yapın** (GitHub hesabınızla)

### 2. Proje Oluşturma

1. Vercel Dashboard → **"Add New..."** → **"Project"**
2. GitHub repo listenizden **`ongel-gayrimenkul`** seçin
3. **Import** butonuna tıklayın

### 3. Proje Ayarları

Vercel otomatik olarak Next.js projesini algılayacak, ama ayarları kontrol edin:

**Framework Preset:**
- Next.js (otomatik algılanmalı)

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm run build
```
(Veya boş bırakın, Vercel otomatik kullanır)

**Output Directory:**
```
.next
```
(Veya boş bırakın, Vercel otomatik kullanır)

**Install Command:**
```
npm install
```
(Veya boş bırakın, Vercel otomatik kullanır)

### 4. Environment Variables Ekleme

**Settings** → **Environment Variables** sekmesine gidin ve şunları ekleyin:

```env
NEXT_PUBLIC_API_URL=https://ongel-gayrimenkul-production.up.railway.app/api
```

**ÖNEMLİ:**
- `NEXT_PUBLIC_` prefix'i zorunlu (Next.js public env variables için)
- Railway backend URL'inizi kullanın
- `/api` suffix'ini unutmayın

### 5. Deploy

1. **"Deploy"** butonuna tıklayın
2. Vercel otomatik olarak:
   - Dependencies yükler
   - Build yapar
   - Deploy eder
3. Build tamamlandığında size bir URL verecek: `https://ongel-gayrimenkul.vercel.app`
4. **HTTPS otomatik aktif!** ✅

### 6. Otomatik Deploy (GitHub Integration)

Vercel GitHub repo'nuzu bağladıktan sonra:
- Her `git push` sonrası otomatik deploy yapar
- Preview URL'leri oluşturur (PR'lar için)
- Production URL'i ana branch için kullanılır

---

## 🔧 Sorun Giderme

### Build Hatası

**Root Directory Hatası:**
- Root Directory'nin `frontend` olduğundan emin olun
- Vercel Dashboard → Settings → General → Root Directory

**Dependencies Hatası:**
- `package.json` dosyası `frontend/` klasöründe mi?
- `node_modules` doğru yerde mi?

### Environment Variables Hatası

**API URL Çalışmıyor:**
- `NEXT_PUBLIC_API_URL` doğru mu?
- Railway backend çalışıyor mu?
- CORS ayarları doğru mu? (Backend'de `FRONTEND_URL` doğru mu?)

### CORS Hatası

**Browser Console'da CORS Hatası:**
1. Backend'de `FRONTEND_URL` environment variable'ını kontrol edin
2. Vercel URL'inizi backend'e ekleyin:
   ```
   FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
   ```
3. Backend'i yeniden deploy edin

---

## ✅ Deploy Sonrası Kontrol

1. **Frontend URL'i açın:** `https://ongel-gayrimenkul.vercel.app`
2. **Browser Console'u kontrol edin:** F12 → Console
3. **API çağrılarını test edin:**
   - Ana sayfa açılıyor mu?
   - Listings sayfası çalışıyor mu?
   - Admin panel çalışıyor mu?
4. **Network tab'ı kontrol edin:** F12 → Network
   - API istekleri başarılı mı?
   - CORS hatası var mı?

---

## 📝 Örnek Environment Variables

```env
NEXT_PUBLIC_API_URL=https://ongel-gayrimenkul-production.up.railway.app/api
```

**Not:** Sadece `NEXT_PUBLIC_` prefix'li değişkenler frontend'de kullanılabilir!

---

## 🎯 Başarı Kriterleri

- [ ] Build başarılı
- [ ] Frontend deploy edildi
- [ ] HTTPS aktif
- [ ] API çağrıları çalışıyor
- [ ] Admin panel çalışıyor
- [ ] Public site çalışıyor
- [ ] CORS hatası yok

---

## 🔄 Otomatik Deploy

Vercel GitHub repo'nuzu bağladıktan sonra:
- Her `git push` → Otomatik deploy
- PR oluşturma → Preview URL
- Main branch merge → Production deploy

---

## 📞 Yardım

Sorun yaşarsanız:
- Vercel Logs: Dashboard → Deployments → View Function Logs
- Browser Console: F12 → Console
- Network Tab: F12 → Network

