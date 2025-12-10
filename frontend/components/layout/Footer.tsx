'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface FooterLink {
  id: string;
  type: 'social' | 'portal';
  name: string;
  url: string;
  icon?: string;
}

export default function Footer() {
  const { t, language } = useLanguage();

  // Bu veriler backend'den gelecek, şimdilik statik
  const socialLinks: FooterLink[] = [
    { id: '1', type: 'social', name: 'Instagram', url: 'https://instagram.com/ongelgayrimenkul', icon: 'instagram' },
    { id: '2', type: 'social', name: 'LinkedIn', url: 'https://linkedin.com/company/ongelgayrimenkul', icon: 'linkedin' },
  ];

  const portalLinks: FooterLink[] = [
    { id: '3', type: 'portal', name: 'Sahibinden', url: 'https://sahibinden.com/ongel', icon: 'sahibinden' },
    { id: '4', type: 'portal', name: 'Emlakjet', url: 'https://emlakjet.com/ongel', icon: 'emlakjet' },
  ];

  const translations: Record<string, Record<string, string>> = {
    tr: {
      description: 'Lüks emlak ve finansal danışmanlık uzmanlığı',
      quickLinks: 'Hızlı Linkler',
      contact: 'İletişim',
      socialTitle: 'Sosyal Medya & Portallar',
      copyright: 'Tüm hakları saklıdır.',
    },
    en: {
      description: 'Luxury real estate and financial consulting expertise',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      socialTitle: 'Social Media & Portals',
      copyright: 'All rights reserved.',
    },
    ar: {
      description: 'الخبرة في العقارات الفاخرة والاستشارات المالية',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      socialTitle: 'وسائل التواصل والمنصات',
      copyright: 'جميع الحقوق محفوظة.',
    },
  };

  const t_page = (key: string) => translations[language]?.[key] || key;

  return (
    <footer className="bg-luxury-black dark:bg-luxury-white text-luxury-white dark:text-luxury-black py-12 border-t border-luxury-dark-gray dark:border-luxury-silver">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-luxury text-2xl font-serif mb-4">Öngel Gayrimenkul</h3>
            <p className="text-luxury-silver dark:text-luxury-medium-gray text-sm">
              {t_page('description')}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">{t_page('quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-luxury-silver dark:text-luxury-medium-gray">
              <li>
                <Link href="/listings" className="hover:text-luxury-white dark:hover:text-luxury-black">
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-luxury-white dark:hover:text-luxury-black">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-luxury-white dark:hover:text-luxury-black">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-luxury-white dark:hover:text-luxury-black">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">{t_page('contact')}</h4>
            <ul className="space-y-2 text-sm text-luxury-silver dark:text-luxury-medium-gray">
              <li>Email: info@ongelgayrimenkul.com</li>
              <li>Telefon: +90 533 572 95 14</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">{t_page('socialTitle')}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-silver dark:text-luxury-medium-gray hover:text-luxury-white dark:hover:text-luxury-black transition-colors"
                    title={link.name}
                  >
                    <span className="sr-only">{link.name}</span>
                    {link.icon === 'instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {link.icon === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
              <div className="flex gap-3">
                {portalLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-luxury-silver dark:text-luxury-medium-gray hover:text-luxury-white dark:hover:text-luxury-black transition-colors border border-luxury-silver dark:border-luxury-medium-gray px-2 py-1 rounded"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-luxury-dark-gray dark:border-luxury-silver text-center text-sm text-luxury-silver dark:text-luxury-medium-gray">
          <p>&copy; {new Date().getFullYear()} Öngel Gayrimenkul. {t_page('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
