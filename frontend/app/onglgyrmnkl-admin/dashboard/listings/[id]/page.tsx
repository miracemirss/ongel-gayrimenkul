'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

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
  virtualTourUrl?: string;
  videoUrl?: string;
  images?: Array<{ url: string; order: number }>;
}

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  useActivityTracker(); // 3 dakika inactivity tracking
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    api.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => {
        console.error('Error fetching listing:', err);
        alert('İlan bulunamadı.');
        router.push('/onglgyrmnkl-admin/dashboard/listings');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const getLocalizedText = (obj: { tr: string; en: string; ar: string }) => {
    return obj.tr || obj.en || obj.ar || '';
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-luxury-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">Yükleniyor...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <a
              href="/onglgyrmnkl-admin/dashboard/listings"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Geri
            </a>
            <div className="flex gap-4">
              <a
                href={`/onglgyrmnkl-admin/dashboard/listings/${id}/edit`}
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray"
              >
                Düzenle
              </a>
              <button
                onClick={async () => {
                  if (!confirm('Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                    return;
                  }
                  try {
                    await api.delete(`/listings/${id}`);
                    alert('İlan başarıyla silindi.');
                    router.push('/onglgyrmnkl-admin/dashboard/listings');
                  } catch (error: any) {
                    console.error('Error deleting listing:', error);
                    alert(error.response?.data?.message || 'İlan silinirken bir hata oluştu.');
                  }
                }}
                className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {listing.images && listing.images.length > 0 ? (
                <div className="mb-6">
                  {/* Ana görsel */}
                  <div className="mb-4">
                    <img
                      src={listing.images[0].url}
                      alt={getLocalizedText(listing.title)}
                      className="w-full h-auto rounded"
                    />
                  </div>
                  {/* Diğer görseller - galeri */}
                  {listing.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {listing.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded">
                          <img
                            src={image.url}
                            alt={`${getLocalizedText(listing.title)} - Görsel ${index + 2}`}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                            onClick={() => {
                              // Ana görseli değiştir
                              const newImages = [image, ...listing.images!.filter((_, i) => i !== index + 1)];
                              setListing({ ...listing, images: newImages });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 bg-luxury-light-gray aspect-video flex items-center justify-center text-luxury-medium-gray">
                  Fotoğraf yok
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-serif mb-4 text-luxury-black">
                {getLocalizedText(listing.title)}
              </h1>
              <p className="text-3xl font-serif mb-6 text-luxury-black">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: listing.currency,
                }).format(listing.price)}
              </p>
              <div className="space-y-4 mb-6">
                <p className="text-luxury-medium-gray">
                  <strong>Konum:</strong> {listing.location}
                </p>
                <p className="text-luxury-medium-gray">
                  <strong>Net Alan:</strong> {listing.netArea} m²
                </p>
                {listing.grossArea && (
                  <p className="text-luxury-medium-gray">
                    <strong>Brüt Alan:</strong> {listing.grossArea} m²
                  </p>
                )}
                <p className="text-luxury-medium-gray">
                  <strong>Oda Sayısı:</strong> {listing.roomCount}
                </p>
                <p className="text-luxury-medium-gray">
                  <strong>Durum:</strong> {listing.status}
                </p>
              </div>
              {listing.virtualTourUrl && (
                <a
                  href={listing.virtualTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-4 text-luxury-black hover:underline"
                >
                  360° Sanal Tur →
                </a>
              )}
              {listing.videoUrl && (
                <a
                  href={listing.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-4 text-luxury-black hover:underline"
                >
                  Video →
                </a>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-serif mb-4 text-luxury-black">Açıklama</h2>
            <div className="prose max-w-none text-luxury-medium-gray">
              <p>{getLocalizedText(listing.description)}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

