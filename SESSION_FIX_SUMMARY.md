# 🔐 Admin Panel Oturum Sorunları Düzeltmesi

## Tespit Edilen Sorunlar

1. **Activity Tracker Çok Agresif**: 3 dakika inactivity sonrası otomatik logout
2. **Token Expiration Kontrolü Yok**: Token'ın süresi dolduğunda kullanıcıya bilgi verilmiyor
3. **401 Hata Yönetimi**: Token expire olduğunda kullanıcı dostu mesaj gösterilmiyor

## Yapılan Düzeltmeler

### 1. Activity Tracker Süresi Artırıldı
- **Önceki**: 3 dakika inactivity → logout
- **Yeni**: 30 dakika inactivity → logout
- **Dosya**: `frontend/hooks/useActivityTracker.ts`

### 2. Token Expiration Kontrolü Eklendi
- **Yeni Dosya**: `frontend/lib/token-utils.ts`
  - JWT token decode fonksiyonu
  - Token expiration kontrolü
  - Token süresi hesaplama

- **Güncellenen**: `frontend/lib/auth.ts`
  - `isAuthenticated()` artık token expiration kontrolü yapıyor
  - `checkTokenValidity()` yeni fonksiyon eklendi

### 3. Token Expiry Warning Component
- **Yeni Dosya**: `frontend/components/common/TokenExpiryWarning.tsx`
  - Token'ın 5 dakika içinde expire olacağını gösteren uyarı
  - Otomatik güncellenen sayaç
  - Kapatılabilir uyarı kutusu

- **Eklendiği Sayfalar**:
  - Admin Dashboard (`/onglgyrmnkl-admin/dashboard`)
  - CMS Sayfaları (`/onglgyrmnkl-admin/dashboard/cms`)
  - Blog Yönetimi (`/onglgyrmnkl-admin/dashboard/blog`)

### 4. API Interceptor İyileştirmesi
- **Güncellenen**: `frontend/lib/api.ts`
  - 401 hatası geldiğinde daha iyi hata yönetimi
  - Login sayfasında gereksiz yönlendirme önlendi

## Kullanıcı Deneyimi İyileştirmeleri

### Önceki Durum:
- ❌ 3 dakika sonra otomatik logout (çok kısa)
- ❌ Token expire olduğunda aniden logout
- ❌ Kullanıcıya uyarı gösterilmiyor

### Yeni Durum:
- ✅ 30 dakika inactivity sonrası logout (daha makul)
- ✅ Token expire olmadan 5 dakika önce uyarı gösteriliyor
- ✅ Token expire olduğunda açıklayıcı mesaj
- ✅ Kullanıcı uyarıyı kapatabilir

## Teknik Detaylar

### Token Süresi
- Backend: `JWT_EXPIRES_IN=7d` (7 gün)
- Frontend: Token expiration kontrolü client-side yapılıyor
- Warning: Son 5 dakikada uyarı gösteriliyor

### Activity Tracker
- Süre: 30 dakika
- Event'ler: mousedown, mousemove, keypress, scroll, touchstart, click
- Otomatik reset: Her aktivitede timer sıfırlanıyor

## Test Edilmesi Gerekenler

- [ ] 30 dakika inactivity sonrası logout çalışıyor mu?
- [ ] Token expire olmadan 5 dakika önce uyarı gösteriliyor mu?
- [ ] Token expire olduğunda login sayfasına yönlendiriliyor mu?
- [ ] Uyarı kutusu kapatılabiliyor mu?
- [ ] Tüm admin sayfalarında uyarı gösteriliyor mu?

## Notlar

- Token expiration kontrolü client-side yapılıyor (güvenlik için backend validation hala geçerli)
- Activity tracker sadece frontend'de çalışıyor, backend'de ayrı bir session yönetimi yok
- JWT token süresi backend `.env` dosyasında `JWT_EXPIRES_IN` ile ayarlanıyor

