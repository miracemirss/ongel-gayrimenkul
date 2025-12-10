# 🌐 DNS Propagasyonu Nedir?

## 📚 Basit Açıklama

**DNS Propagasyonu**, DNS kayıtlarınızın (domain'inizin IP adresine yönlendirme bilgisi) dünya genelindeki tüm DNS sunucularına yayılması ve güncellenmesi sürecidir.

---

## 🔍 Nasıl Çalışır?

### 1. DNS Kaydı Ekleme

Hostinger'da DNS kaydı eklediğinizde:
```
ongelgayrimenkul.com → 72.60.39.172
```

Bu bilgi önce **Hostinger'ın DNS sunucularına** kaydedilir.

### 2. Propagasyon Süreci

Bu bilgi dünya genelindeki DNS sunucularına yayılır:
- **Google DNS** (8.8.8.8)
- **Cloudflare DNS** (1.1.1.1)
- **ISP DNS sunucuları** (Türk Telekom, Vodafone, vb.)
- **Diğer tüm DNS sunucuları**

### 3. TTL (Time To Live)

Her DNS kaydının bir **TTL** (Time To Live) değeri vardır:
- **TTL = 3600** → 1 saat
- **TTL = 1800** → 30 dakika
- **TTL = 300** → 5 dakika

TTL, DNS sunucularının bu bilgiyi ne kadar süre saklayacağını belirler.

---

## ⏱️ Ne Kadar Sürer?

### Normal Süre
- **Minimum:** 5 dakika (TTL düşükse)
- **Ortalama:** 1-2 saat
- **Maksimum:** 24-48 saat (nadiren)

### Etkileyen Faktörler
1. **TTL Değeri:**
   - Düşük TTL (300-600) → Daha hızlı güncelleme
   - Yüksek TTL (3600+) → Daha yavaş güncelleme

2. **DNS Sunucu Cache:**
   - Bazı DNS sunucuları eski bilgiyi cache'ler
   - Cache süresi dolana kadar eski IP gösterir

3. **Coğrafi Konum:**
   - Yakın DNS sunucuları daha hızlı güncellenir
   - Uzak DNS sunucuları daha yavaş güncellenir

---

## 🔍 Nasıl Kontrol Edilir?

### 1. nslookup Komutu

**SSH'da veya Windows'ta:**
```bash
nslookup ongelgayrimenkul.com
```

**Beklenen çıktı (propagasyon tamamlandıysa):**
```
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   ongelgayrimenkul.com
Address: 72.60.39.172
```

**Eğer farklı IP gösteriyorsa veya bulamıyorsa:**
- Propagasyon henüz tamamlanmamış
- Beklemeye devam edin

### 2. Online DNS Checker

**Web siteleri:**
- https://www.whatsmydns.net/
- https://dnschecker.org/
- https://www.dnswatch.info/

Bu siteler dünya genelindeki farklı DNS sunucularından domain'inizi kontrol eder.

### 3. Farklı DNS Sunucularından Test

**SSH'da:**
```bash
# Google DNS
nslookup ongelgayrimenkul.com 8.8.8.8

# Cloudflare DNS
nslookup ongelgayrimenkul.com 1.1.1.1

# OpenDNS
nslookup ongelgayrimenkul.com 208.67.222.222
```

**Beklenen:** Hepsi aynı IP'yi göstermeli (`72.60.39.172`)

---

## 📊 Propagasyon Durumu

### ✅ Tamamlandı
- Tüm DNS sunucuları yeni IP'yi gösteriyor
- Domain erişilebilir
- SSL sertifikası alınabilir

### ⏳ Devam Ediyor
- Bazı DNS sunucuları eski IP gösteriyor
- Bazı yerlerden erişilebilir, bazılarından değil
- SSL sertifikası alınamayabilir

### ❌ Başlamadı
- Hiçbir DNS sunucusu yeni IP'yi göstermiyor
- DNS kayıtları yanlış veya eksik
- Hostinger'da DNS kayıtlarını kontrol edin

---

## 🎯 Pratik Örnek

### Senaryo: Domain IP Değişikliği

**Önceki durum:**
```
ongelgayrimenkul.com → 192.168.1.1 (eski sunucu)
```

**Yeni durum:**
```
ongelgayrimenkul.com → 72.60.39.172 (yeni sunucu)
```

**Propagasyon süreci:**

1. **0 dakika:** Hostinger DNS sunucuları güncellendi
2. **5 dakika:** Google DNS güncellendi
3. **30 dakika:** Cloudflare DNS güncellendi
4. **1 saat:** Çoğu DNS sunucusu güncellendi
5. **2 saat:** Tüm DNS sunucuları güncellendi ✅

**Bu süre zarfında:**
- Bazı kullanıcılar eski sunucuya yönlendirilir
- Bazı kullanıcılar yeni sunucuya yönlendirilir
- Bu normaldir!

---

## ⚡ Hızlandırma Yöntemleri

### 1. TTL Değerini Düşürün

**Hostinger Dashboard → Domain → DNS Management**

DNS kaydını düzenleyin:
- **TTL:** `300` (5 dakika) veya `600` (10 dakika)

**Not:** Propagasyon sonrası TTL'yi tekrar `3600` (1 saat) yapabilirsiniz.

### 2. DNS Cache'i Temizleyin

**Windows'ta:**
```powershell
ipconfig /flushdns
```

**Linux'ta:**
```bash
sudo systemd-resolve --flush-caches
```

**Not:** Bu sadece yerel cache'i temizler, dünya genelindeki DNS sunucularını etkilemez.

### 3. Farklı DNS Sunucuları Kullanın

**Windows'ta:**
- Network Settings → DNS → `8.8.8.8` (Google DNS)

**Linux'ta:**
- `/etc/resolv.conf` dosyasını düzenleyin

---

## 🆘 Sorun Giderme

### Propagasyon 24 Saatten Fazla Sürüyor

1. **DNS kayıtlarını kontrol edin:**
   - Hostinger Dashboard → Domain → DNS Management
   - IP adresi doğru mu? (`72.60.39.172`)

2. **TTL değerini kontrol edin:**
   - Çok yüksek TTL (86400+) propagasyonu yavaşlatır

3. **DNS sunucularını kontrol edin:**
   - Hostinger'ın DNS sunucuları doğru mu?

### Bazı Yerlerden Erişilemiyor

1. **Normal durum:** Propagasyon devam ediyor
2. **Bekleyin:** 1-2 saat içinde düzelecek
3. **Kontrol edin:** Online DNS checker kullanın

### SSL Sertifikası Alınamıyor

1. **DNS propagasyon tamamlanmamış olabilir**
2. **Let's Encrypt farklı DNS sunucularından kontrol eder**
3. **Bekleyin:** Propagasyon tamamlandıktan sonra tekrar deneyin

---

## 📝 Özet

**DNS Propagasyonu:**
- ✅ DNS kayıtlarının dünya genelindeki DNS sunucularına yayılması
- ✅ Normal süre: 1-2 saat
- ✅ Maksimum: 24-48 saat
- ✅ TTL değeri süreyi etkiler
- ✅ Online DNS checker ile kontrol edilebilir

**Önemli:**
- Propagasyon tamamlanmadan SSL sertifikası alınamayabilir
- Bazı yerlerden erişilebilir, bazılarından erişilemez (normal)
- Sabırlı olun, bekleyin! ⏳

---

## 🔗 Faydalı Linkler

- **DNS Checker:** https://www.whatsmydns.net/
- **DNS Watch:** https://www.dnswatch.info/
- **Google DNS:** 8.8.8.8
- **Cloudflare DNS:** 1.1.1.1

