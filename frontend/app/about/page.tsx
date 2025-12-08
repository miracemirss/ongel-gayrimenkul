'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';

interface CmsPage {
  title: { tr: string; en: string; ar: string };
  content: { tr: string; en: string; ar: string };
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.get('/cms/pages/about');
        setPage(response.data);
      } catch (err) {
        console.error('Error fetching about page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const getLocalizedText = (obj: { tr: string; en: string; ar: string } | undefined) => {
    if (!obj) return '';
    return obj[language] || obj.tr || obj.en || obj.ar || '';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : page ? (
            <>
              <h1 className="text-luxury text-5xl font-serif mb-8 text-luxury-black">
                {getLocalizedText(page.title) || t('about.title')}
              </h1>
              <div 
                className="prose prose-lg max-w-none text-luxury-medium-gray leading-relaxed"
                dangerouslySetInnerHTML={{ __html: getLocalizedText(page.content) || t('about.description') }}
              />
            </>
          ) : (
            <>
              <h1 className="text-luxury text-5xl font-serif mb-8 text-luxury-black">
                {t('about.title')}
              </h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-luxury-medium-gray leading-relaxed">
                  {t('about.description')}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

