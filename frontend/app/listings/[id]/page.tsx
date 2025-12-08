'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';

interface Listing {
  id: string;
  title: { tr: string; en: string; ar: string };
  description: { tr: string; en: string; ar: string };
  price: number;
  currency: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  netArea: number;
  grossArea?: number;
  roomCount: string;
  images?: Array<{ url: string; order: number }>;
  virtualTourUrl?: string;
  videoUrl?: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/public/${id}`);
        setListing(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0].url);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('İlan bulunamadı.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const getLocalizedText = (obj: { tr: string; en: string; ar: string } | string) => {
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.tr || obj.en || obj.ar || '';
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : language === 'en' ? 'en-US' : 'ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-luxury-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">Yükleniyor...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-luxury-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error || &apos;İlan bulunamadı.&apos;}</p>
              <Link
                href="/listings"
                className="text-luxury-black hover:underline"
              >
                ← Portföye Dön
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              href="/listings"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← {t('listings.title') || 'Portföy'}
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Images */}
            <div>
              {mainImage ? (
                <div className="mb-6">
                  <img
                    src={mainImage}
                    alt={getLocalizedText(listing.title)}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-luxury-light-gray flex items-center justify-center text-luxury-medium-gray mb-6">
                  Fotoğraf yok
                </div>
              )}
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {listing.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-24 object-cover border cursor-pointer transition-opacity ${
                        mainImage === img.url
                          ? 'border-luxury-black opacity-100'
                          : 'border-luxury-silver opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setMainImage(img.url)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-luxury text-4xl md:text-5xl font-serif mb-4 text-luxury-black">
                {getLocalizedText(listing.title)}
              </h1>
              <p className="text-3xl font-serif text-luxury-black mb-6">
                {formatPrice(listing.price, listing.currency)}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-luxury-medium-gray">
                  <span className="mr-2">📍</span>
                  <span>{listing.location}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-luxury-medium-gray">
                  <span>{listing.netArea} {t('listings.squareMeter')}</span>
                  {listing.grossArea && <span>• {listing.grossArea} {t('listings.squareMeter')} ({t('listings.gross')})</span>}
                  <span>• {listing.roomCount} {t('listings.room')}</span>
                </div>
              </div>

              {listing.virtualTourUrl && (
                <div className="mb-4">
                  <a
                    href={listing.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
                  >
                    {t('listings.virtualTour')}
                  </a>
                </div>
              )}

              {listing.videoUrl && (
                <div className="mb-4">
                  <a
                    href={listing.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
                  >
                    {t('listings.watchVideo')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-luxury-silver pt-12">
            <h2 className="text-2xl font-serif mb-6 text-luxury-black">
              {t('listings.description') || 'Açıklama'}
            </h2>
            <div
              className="prose prose-lg max-w-none text-luxury-medium-gray leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getLocalizedText(listing.description) }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

