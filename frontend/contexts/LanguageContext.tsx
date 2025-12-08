'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'tr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  tr: {
    'nav.home': 'ANA SAYFA',
    'nav.portfolio': 'PORTFÖY',
    'nav.about': 'HAKKIMIZDA',
    'nav.services': 'HİZMETLERİMİZ',
    'nav.contact': 'İLETİŞİM',
    'nav.mortgage': 'MORTGAGE BROKERLİK HİZMETİ',
    'nav.services.realEstate': 'EMLAK DANIŞMANLIĞI',
    'nav.services.mortgage': 'MORTGAGE BROKERLİK HİZMETİ',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Giriş',
    'nav.logout': 'Çıkış',
    'footer.description': 'Lüks emlak ve finansal danışmanlık uzmanlığı',
    'footer.quickLinks': 'Hızlı Linkler',
    'footer.contact': 'İletişim',
    'footer.copyright': 'Tüm hakları saklıdır.',
    'hero.title': 'Öngel Gayrimenkul',
    'hero.subtitle': 'Lüks emlak ve finansal danışmanlık uzmanlığı',
    'hero.portfolioButton': 'Portföy',
    'hero.aboutButton': 'Hakkımızda',
    'features.luxury.title': 'Lüks Emlak',
    'features.luxury.description': 'Seçkin konumlarda, özenle seçilmiş lüks gayrimenkuller',
    'features.financial.title': 'Finansal Danışmanlık',
    'features.financial.description': 'Uzman ekibimizle finansal çözümler',
    'features.professional.title': 'Profesyonel Hizmet',
    'features.professional.description': 'Her adımda yanınızda olan güvenilir partner',
    'portfolio.title': 'Portföy',
    'portfolio.subtitle': 'Seçkin konumlarda lüks gayrimenkuller',
    'portfolio.loading': 'İlanlar yükleniyor...',
    'listings.title': 'Portföyümüz',
    'listings.subtitle': 'Seçkin konumlarda lüks gayrimenkuller',
    'listings.loading': 'İlanlar yükleniyor...',
    'listings.noListings': 'Henüz ilan bulunmamaktadır.',
    'listings.description': 'Açıklama',
    'listings.room': 'Oda',
    'listings.squareMeter': 'm²',
    'listings.gross': 'Brüt',
    'listings.virtualTour': '360° Sanal Tur',
    'listings.watchVideo': 'Video İzle',
    'listings.filterLocation': 'Konum',
    'listings.filterMinPrice': 'Min Fiyat',
    'listings.filterMaxPrice': 'Max Fiyat',
    'listings.filterMinArea': 'Min m²',
    'listings.filterMaxArea': 'Max m²',
    'listings.filterRoomCount': 'Oda (örn: 2+1)',
    'listings.filterCurrency': 'Para Birimi',
    'listings.applyFilters': 'Filtrele',
    'listings.resetFilters': 'Sıfırla',
    'listings.sortBy': 'Sırala:',
    'listings.sortByDate': 'Tarih',
    'listings.sortByPrice': 'Fiyat',
    'listings.sortByArea': 'Alan',
    'listings.sortByLocation': 'Konum',
    'listings.sortDesc': 'Azalan',
    'listings.sortAsc': 'Artan',
    'listings.showingResults': 'Gösterilen',
    'listings.of': '/',
    'listings.results': 'sonuç',
    'listings.page': 'Sayfa',
    'listings.previous': 'Önceki',
    'listings.next': 'Sonraki',
    'about.title': 'Hakkımızda',
    'about.description': 'Öngel Gayrimenkul, lüks emlak ve finansal danışmanlık alanında uzmanlaşmış, müşteri memnuniyetini ön planda tutan bir danışmanlık firmasıdır.',
    'mortgage.title': 'Mortgage',
    'mortgage.intro': 'Hayalinizdeki gayrimenkulü satın almak için mortgage çözümlerimizden yararlanın.',
    'mortgage.application.title': 'Mortgage Ön Başvuru',
    'mortgage.application.description': 'Formu doldurarak ön başvurunuzu yapabilirsiniz. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.',
    'mortgage.application.button': 'Başvuru Formu',
    'services.title': 'Hizmetlerimiz',
    'services.description': 'Öngel Gayrimenkul olarak, lüks emlak ve finansal danışmanlık alanında kapsamlı hizmetler sunmaktayız.',
  },
  en: {
    'nav.home': 'HOME',
    'nav.portfolio': 'PORTFOLIO',
    'nav.about': 'ABOUT',
    'nav.services': 'OUR SERVICES',
    'nav.contact': 'CONTACT',
    'nav.mortgage': 'MORTGAGE BROKERAGE SERVICE',
    'nav.services.realEstate': 'REAL ESTATE ADVISORY',
    'nav.services.mortgage': 'MORTGAGE BROKERAGE SERVICE',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'footer.description': 'Luxury real estate and financial consulting expertise',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.copyright': 'All rights reserved.',
    'hero.title': 'Öngel Gayrimenkul',
    'hero.subtitle': 'Luxury real estate and financial consulting expertise',
    'hero.portfolioButton': 'Portfolio',
    'hero.aboutButton': 'About Us',
    'features.luxury.title': 'Luxury Real Estate',
    'features.luxury.description': 'Carefully selected luxury properties in prime locations',
    'features.financial.title': 'Financial Consulting',
    'features.financial.description': 'Financial solutions with our expert team',
    'features.professional.title': 'Professional Service',
    'features.professional.description': 'A reliable partner by your side at every step',
    'portfolio.title': 'Portfolio',
    'portfolio.subtitle': 'Luxury properties in prime locations',
    'portfolio.loading': 'Loading listings...',
    'listings.title': 'Our Portfolio',
    'listings.subtitle': 'Luxury properties in prime locations',
    'listings.loading': 'Loading listings...',
    'listings.noListings': 'No listings available yet.',
    'listings.description': 'Description',
    'listings.room': 'Room',
    'listings.squareMeter': 'm²',
    'listings.gross': 'Gross',
    'listings.virtualTour': '360° Virtual Tour',
    'listings.watchVideo': 'Watch Video',
    'about.title': 'About Us',
    'about.description': 'Öngel Gayrimenkul is a consulting firm specialized in luxury real estate and financial consulting, prioritizing customer satisfaction.',
    'mortgage.title': 'Mortgage',
    'mortgage.intro': 'Take advantage of our mortgage solutions to purchase your dream property.',
    'mortgage.application.title': 'Mortgage Pre-Application',
    'mortgage.application.description': 'You can submit your pre-application by filling out the form. Our expert team will contact you as soon as possible.',
    'mortgage.application.button': 'Application Form',
    'services.title': 'Our Services',
    'services.description': 'As Öngel Gayrimenkul, we offer comprehensive services in the field of luxury real estate and financial consulting.',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.portfolio': 'المحفظة',
    'nav.about': 'من نحن',
    'nav.services': 'خدماتنا',
    'nav.contact': 'اتصل بنا',
    'nav.mortgage': 'خدمة الوساطة العقارية',
    'nav.services.realEstate': 'استشارات عقارية',
    'nav.services.mortgage': 'خدمة الوساطة العقارية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'footer.description': 'الخبرة في العقارات الفاخرة والاستشارات المالية',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.copyright': 'جميع الحقوق محفوظة.',
    'hero.title': 'أونجل العقارية',
    'hero.subtitle': 'الخبرة في العقارات الفاخرة والاستشارات المالية',
    'hero.portfolioButton': 'المحفظة',
    'hero.aboutButton': 'من نحن',
    'features.luxury.title': 'العقارات الفاخرة',
    'features.luxury.description': 'عقارات فاخرة مختارة بعناية في مواقع ممتازة',
    'features.financial.title': 'الاستشارات المالية',
    'features.financial.description': 'حلول مالية مع فريقنا الخبير',
    'features.professional.title': 'خدمة احترافية',
    'features.professional.description': 'شريك موثوق بجانبك في كل خطوة',
    'portfolio.title': 'المحفظة',
    'portfolio.subtitle': 'عقارات فاخرة في مواقع ممتازة',
    'portfolio.loading': 'جاري تحميل العقارات...',
    'listings.title': 'محفظتنا',
    'listings.subtitle': 'عقارات فاخرة في مواقع ممتازة',
    'listings.loading': 'جاري تحميل العقارات...',
    'listings.noListings': 'لا توجد عقارات متاحة بعد.',
    'listings.description': 'الوصف',
    'listings.room': 'غرفة',
    'listings.squareMeter': 'م²',
    'listings.gross': 'إجمالي',
    'listings.virtualTour': 'جولة افتراضية 360°',
    'listings.watchVideo': 'شاهد الفيديو',
    'listings.filterLocation': 'الموقع',
    'listings.filterMinPrice': 'الحد الأدنى للسعر',
    'listings.filterMaxPrice': 'الحد الأقصى للسعر',
    'listings.filterMinArea': 'الحد الأدنى للمساحة (م²)',
    'listings.filterMaxArea': 'الحد الأقصى للمساحة (م²)',
    'listings.filterRoomCount': 'عدد الغرف (مثال: 2+1)',
    'listings.filterCurrency': 'العملة',
    'listings.applyFilters': 'تصفية',
    'listings.resetFilters': 'إعادة تعيين',
    'listings.sortBy': 'ترتيب حسب:',
    'listings.sortByDate': 'التاريخ',
    'listings.sortByPrice': 'السعر',
    'listings.sortByArea': 'المساحة',
    'listings.sortByLocation': 'الموقع',
    'listings.sortDesc': 'تنازلي',
    'listings.sortAsc': 'تصاعدي',
    'listings.showingResults': 'عرض',
    'listings.of': 'من',
    'listings.results': 'نتيجة',
    'listings.page': 'صفحة',
    'listings.previous': 'السابق',
    'listings.next': 'التالي',
    'about.title': 'من نحن',
    'about.description': 'أونجل العقارية هي شركة استشارية متخصصة في العقارات الفاخرة والاستشارات المالية، مع إعطاء الأولوية لرضا العملاء.',
    'mortgage.title': 'الرهن العقاري',
    'mortgage.intro': 'استفد من حلول الرهن العقاري لدينا لشراء العقار الذي تحلم به.',
    'mortgage.application.title': 'طلب مسبق للرهن العقاري',
    'mortgage.application.description': 'يمكنك تقديم طلبك المسبق من خلال ملء النموذج. سيتصل بك فريقنا الخبير في أقرب وقت ممكن.',
    'mortgage.application.button': 'نموذج الطلب',
    'services.title': 'خدماتنا',
    'services.description': 'كأونجل العقارية، نقدم خدمات شاملة في مجال العقارات الفاخرة والاستشارات المالية.',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language | null;
      if (savedLang && ['tr', 'en', 'ar'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Always provide context, even before mounted
  // This prevents the "must be used within LanguageProvider" error
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

