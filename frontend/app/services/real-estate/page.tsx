'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RealEstateServicesPage() {
  const { t, language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    tr: {
      title: 'Emlak Danışmanlığı',
      intro:
        'Öngel Gayrimenkul, lüks segmentte portföy yönetimi, değerleme ve alım-satım süreçlerinde uçtan uca danışmanlık sunar.',
      description:
        'Seçkin konumlarda, özenle seçilmiş lüks gayrimenkuller için profesyonel danışmanlık hizmetleri.',
    },
    en: {
      title: 'Real Estate Advisory',
      intro:
        'Öngel Gayrimenkul provides end-to-end advisory for high-end real estate, including portfolio management, valuation and transactions.',
      description:
        'Professional advisory services for carefully selected luxury properties in prime locations.',
    },
    ar: {
      title: 'الاستشارات العقارية',
      intro:
        'أونجل العقارية تقدم خدمات استشارية متكاملة في قطاع العقارات الفاخرة، من إدارة المحافظ إلى التقييم وصفقات البيع والشراء.',
      description:
        'خدمات استشارية احترافية للعقارات الفاخرة المختارة بعناية في مواقع ممتازة.',
    },
  };

  const content = translations[language] || translations.tr;

  return (
    <>
      <Header />
          <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-luxury text-5xl font-serif mb-8 text-luxury-black">
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-luxury-medium-gray leading-relaxed mb-6">
              {content.intro}
            </p>
            <p className="text-luxury-medium-gray leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

