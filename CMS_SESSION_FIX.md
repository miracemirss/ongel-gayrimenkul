# 🔐 CMS Oturum Sorunu Düzeltmesi

## Tespit Edilen Sorun

CMS sayfalarında içerik düzenlerken "Oturum süreniz dolmuş" hatası alınıyordu.

## Sorunun Nedeni

API interceptor'da `/cms/pages/` içeren tüm route'lar public olarak işaretlenmişti. Bu yüzden:
- ✅ GET `/cms/pages/:type` → Public (doğru)
- ❌ PATCH `/cms/pages/:id` → Token gönderilmiyordu (YANLIŞ!)
- ❌ POST `/cms/pages` → Token gönderilmiyordu (YANLIŞ!)
- ❌ GET `/cms/pages` → Token gönderilmiyordu (YANLIŞ!)

## Yapılan Düzeltme

### 1. API Interceptor Düzeltildi
**Dosya**: `frontend/lib/api.ts`

**Önceki Kod:**
```typescript
const publicRoutes = ['/public', '/cms/pages/'];
const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
```

**Yeni Kod:**
```typescript
// Sadece GET /cms/pages/:type (about, services, mortgage) public
const isPublicCmsRoute = 
  config.method?.toLowerCase() === 'get' &&
  config.url?.match(/^\/cms\/pages\/(about|services|mortgage)$/i);
```

**Sonuç:**
- ✅ GET `/cms/pages/about` → Public (token gönderilmez)
- ✅ GET `/cms/pages/services` → Public (token gönderilmez)
- ✅ GET `/cms/pages/mortgage` → Public (token gönderilmez)
- ✅ GET `/cms/pages` → Auth gerektirir (token gönderilir)
- ✅ POST `/cms/pages` → Auth gerektirir (token gönderilir)
- ✅ PATCH `/cms/pages/:id` → Auth gerektirir (token gönderilir)
- ✅ DELETE `/cms/pages/:id` → Auth gerektirir (token gönderilir)

### 2. CMS Hata Yönetimi İyileştirildi
**Dosya**: `frontend/app/onglgyrmnkl-admin/dashboard/cms/page.tsx`

- Daha detaylı error logging eklendi
- Token expiration kontrolü eklendi
- Daha açıklayıcı hata mesajları
- 2 saniye gecikme ile redirect (kullanıcı mesajı görebilsin)

### 3. Duplicate Import Hatası Düzeltildi
**Dosya**: `frontend/app/onglgyrmnkl-admin/dashboard/blog/page.tsx`

- TokenExpiryWarning iki kez import edilmişti
- Tekrar eden import satırı kaldırıldı

## Test Edilmesi Gerekenler

1. **CMS Sayfası Düzenleme:**
   - [ ] Admin panel → CMS Sayfaları
   - [ ] Hakkımızda sayfasını seç
   - [ ] İçeriği değiştir
   - [ ] Kaydet butonuna bas
   - [ ] Başarılı mesajı görünmeli
   - [ ] "Oturum süreniz dolmuş" hatası OLMAMALI

2. **Token Kontrolü:**
   - [ ] Browser DevTools → Network tab
   - [ ] CMS sayfasını kaydet
   - [ ] PATCH request'ini kontrol et
   - [ ] Request Headers'da `Authorization: Bearer ...` olmalı

3. **Public Route Kontrolü:**
   - [ ] Public site'den `/about` sayfasını aç
   - [ ] GET `/cms/pages/about` request'ini kontrol et
   - [ ] Request Headers'da `Authorization` OLMAMALI

## Sorun Giderme

### Hala "Oturum süreniz dolmuş" hatası alıyorsanız:

1. **Token'ı kontrol edin:**
   ```javascript
   // Browser console'da
   localStorage.getItem('access_token')
   ```

2. **Token geçerli mi?**
   - Token yoksa → Login olun
   - Token varsa ama hata alıyorsanız → Token expire olmuş olabilir
   - Yeniden login olun

3. **Network tab'da kontrol edin:**
   - PATCH request'inde `Authorization` header'ı var mı?
   - Response status code nedir? (401, 403, 500?)

4. **Backend loglarını kontrol edin:**
   ```bash
   pm2 logs backend --lines 50
   ```

## Özet

✅ **Çözüldü:**
- API interceptor public route kontrolü düzeltildi
- CMS PATCH/POST request'lerine token gönderiliyor
- Duplicate import hatası düzeltildi
- Hata yönetimi iyileştirildi

⚠️ **Not:**
- Eğer hala sorun varsa, token'ın süresi dolmuş olabilir
- Yeniden login olun ve tekrar deneyin
- Canlıya deploy edildikten sonra test edin

