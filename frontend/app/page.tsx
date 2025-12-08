'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    '/images/ongl1.jpg',
    '/images/ongl2.jpg',
    '/images/ongl3.jpg',
  ];

  // Auto-slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section with Sliding Background Images */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Images Carousel */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#1a1a1a', // Fallback color if image doesn't load
                }}
              />
            ))}
            {/* Overlay - 35% opacity dark layer for text readability */}
            <div className="absolute inset-0 bg-black opacity-35"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 sm:px-6">
            <h1 className="text-luxury text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif mb-4 sm:mb-6 text-white drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-luxury-silver mb-8 sm:mb-12 max-w-2xl mx-auto drop-shadow-md px-2">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                href="/listings"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-luxury-white text-luxury-black hover:bg-luxury-light-gray transition-colors font-medium text-sm sm:text-base"
              >
                {t('hero.portfolioButton')}
              </Link>
              <Link
                href="/about"
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-luxury-white text-luxury-white hover:bg-luxury-white hover:text-luxury-black transition-colors font-medium text-sm sm:text-base"
              >
                {t('hero.aboutButton')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-luxury-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4 text-luxury-black">
                  {t('features.luxury.title')}
                </h3>
                <p className="text-luxury-medium-gray">
                  {t('features.luxury.description')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4 text-luxury-black">
                  {t('features.financial.title')}
                </h3>
                <p className="text-luxury-medium-gray">
                  {t('features.financial.description')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4 text-luxury-black">
                  {t('features.professional.title')}
                </h3>
                <p className="text-luxury-medium-gray">
                  {t('features.professional.description')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
