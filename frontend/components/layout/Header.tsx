'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const navLinkClass = (active: boolean) =>
    `text-sm tracking-wide transition-colors ${
      active ? 'text-luxury-silver font-semibold' : 'text-white hover:text-luxury-silver'
    }`;

  const serviceLinks = [
    { label: t('nav.services.realEstate'), href: '/services/real-estate' },
    { label: t('nav.services.mortgage'), href: '/mortgage' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        mobileMenuOpen
          ? 'bg-luxury-white border-b border-luxury-silver shadow-lg'
          : isScrolled
          ? 'bg-black/95 border-b border-white/10 shadow-lg'
          : 'bg-black/30 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="z-[101] flex items-center h-20" onClick={closeMobileMenu}>
            <Image
              src="/images/ongel-logo.png"
              alt="Öngel Gayrimenkul"
              width={300}
              height={120}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className={navLinkClass(pathname === '/')}>
              {t('nav.home')}
            </Link>
            <Link href="/listings" className={navLinkClass(pathname === '/listings')}>
              {t('nav.portfolio')}
            </Link>
            <Link href="/about" className={navLinkClass(pathname === '/about')}>
              {t('nav.about')}
            </Link>
            <div className="relative">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`${navLinkClass(pathname.startsWith('/services'))} flex items-center gap-1`}
              >
                {t('nav.services')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-black/95 border border-white/10 shadow-xl min-w-[220px] z-50">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-5 py-3 text-sm text-white hover:bg-white/10"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/contact" className={navLinkClass(pathname === '/contact')}>
              {t('nav.contact')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector variant={mobileMenuOpen ? "dark" : "light"} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden z-[101] p-2 ${mobileMenuOpen ? 'text-luxury-black' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-luxury-white text-luxury-black z-[90] transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-4 space-y-4">
            <Link
              href="/"
              className={`block py-3 text-lg border-b border-luxury-silver ${
                pathname === '/' ? 'text-luxury-black font-semibold' : 'text-luxury-medium-gray'
              }`}
              onClick={closeMobileMenu}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/listings"
              className={`block py-3 text-lg border-b border-luxury-silver ${
                pathname === '/listings' ? 'text-luxury-black font-semibold' : 'text-luxury-medium-gray'
              }`}
              onClick={closeMobileMenu}
            >
              {t('nav.portfolio')}
            </Link>
            <Link
              href="/about"
              className={`block py-3 text-lg border-b border-luxury-silver ${
                pathname === '/about' ? 'text-luxury-black font-semibold' : 'text-luxury-medium-gray'
              }`}
              onClick={closeMobileMenu}
            >
              {t('nav.about')}
            </Link>
            <div className="border-b border-luxury-silver">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`w-full text-left py-3 text-lg flex items-center justify-between ${
                  pathname.startsWith('/services') || pathname === '/mortgage'
                    ? 'text-luxury-black font-semibold'
                    : 'text-luxury-medium-gray'
                }`}
              >
                {t('nav.services')}
                <svg
                  className={`w-5 h-5 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="pl-4 space-y-2 pb-3">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-base text-luxury-medium-gray hover:text-luxury-black"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/contact"
              className={`block py-3 text-lg border-b border-luxury-silver ${
                pathname === '/contact' ? 'text-luxury-black font-semibold' : 'text-luxury-medium-gray'
              }`}
              onClick={closeMobileMenu}
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
