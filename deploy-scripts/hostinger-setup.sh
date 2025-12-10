#!/bin/bash

# Hostinger İlk Kurulum Scripti
# Kullanım: ./hostinger-setup.sh

set -e

echo "🚀 Hostinger İlk Kurulum Başlatılıyor..."

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Sistem güncelleme
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y

# Node.js kurulumu
echo -e "${YELLOW}📦 Node.js kuruluyor...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo -e "${GREEN}✅ Node.js zaten kurulu: $(node --version)${NC}"
fi

# PM2 kurulumu
echo -e "${YELLOW}📦 PM2 kuruluyor...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup
    echo -e "${YELLOW}⚠️  PM2 startup komutunu çalıştırın (yukarıda gösterilen)${NC}"
else
    echo -e "${GREEN}✅ PM2 zaten kurulu${NC}"
fi

# Nginx kurulumu
echo -e "${YELLOW}📦 Nginx kuruluyor...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo -e "${GREEN}✅ Nginx zaten kurulu${NC}"
fi

# Git kurulumu
echo -e "${YELLOW}📦 Git kuruluyor...${NC}"
if ! command -v git &> /dev/null; then
    apt install -y git
else
    echo -e "${GREEN}✅ Git zaten kurulu${NC}"
fi

# Certbot kurulumu
echo -e "${YELLOW}📦 Certbot kuruluyor...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
else
    echo -e "${GREEN}✅ Certbot zaten kurulu${NC}"
fi

# Proje dizini oluştur
echo -e "${YELLOW}📁 Proje dizini oluşturuluyor...${NC}"
mkdir -p /var/www/ongel-gayrimenkul

echo -e "${GREEN}✅ İlk kurulum tamamlandı!${NC}"
echo -e "${YELLOW}📝 Sonraki adımlar:${NC}"
echo -e "  1. Projeyi /var/www/ongel-gayrimenkul dizinine yükleyin"
echo -e "  2. Backend .env dosyasını oluşturun"
echo -e "  3. Frontend .env.local dosyasını oluşturun"
echo -e "  4. npm install ve build yapın"
echo -e "  5. PM2 ile başlatın"
echo -e "  6. Nginx config'i ayarlayın"
echo -e "  7. SSL sertifikası alın"

