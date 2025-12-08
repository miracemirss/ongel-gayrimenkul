'use client';

import { useEffect, useState } from 'react';
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
  netArea: number;
  grossArea?: number;
  roomCount: string;
  images?: Array<{ url: string; order: number }>;
  virtualTourUrl?: string;
  videoUrl?: string;
}

interface PaginationResponse {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ListingsPage() {
  const { t, language } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    roomCount: '',
    currency: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 12,
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minArea) params.append('minArea', filters.minArea);
      if (filters.maxArea) params.append('maxArea', filters.maxArea);
      if (filters.roomCount) params.append('roomCount', filters.roomCount);
      if (filters.currency) params.append('currency', filters.currency);
      
      // Add sorting
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      // Add pagination
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await api.get<PaginationResponse>(`/listings/public?${params.toString()}`);
      setListings(response.data.data || []);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
        limit: response.data.limit,
      });
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('İlanlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, sortBy, sortOrder]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchListings();
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      roomCount: '',
      currency: '',
    });
    setPage(1);
    setTimeout(() => fetchListings(), 100);
  };

  const getLocalizedText = (obj: { tr: string; en: string; ar: string } | string) => {
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.tr || obj.en || '';
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-luxury text-5xl font-serif mb-12 text-luxury-black text-center">
            {t('listings.title')}
          </h1>
          <p className="text-center text-luxury-medium-gray mb-12">
            {t('listings.subtitle')}
          </p>

          {/* Filters and Sorting */}
          <div className="mb-8 space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder={t('listings.filterLocation') || 'Konum'}
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder={t('listings.filterMinPrice') || 'Min Fiyat'}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder={t('listings.filterMaxPrice') || 'Max Fiyat'}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="text"
                placeholder={t('listings.filterRoomCount') || 'Oda (örn: 2+1)'}
                value={filters.roomCount}
                onChange={(e) => handleFilterChange('roomCount', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder={t('listings.filterMinArea') || 'Min m²'}
                value={filters.minArea}
                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder={t('listings.filterMaxArea') || 'Max m²'}
                value={filters.maxArea}
                onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <select
                value={filters.currency}
                onChange={(e) => handleFilterChange('currency', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="">{t('listings.filterCurrency') || 'Para Birimi'}</option>
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors"
                >
                  {t('listings.applyFilters') || 'Filtrele'}
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
                >
                  {t('listings.resetFilters') || 'Sıfırla'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-luxury-medium-gray">{t('listings.sortBy') || 'Sırala:'}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="createdAt">{t('listings.sortByDate') || 'Tarih'}</option>
                <option value="price">{t('listings.sortByPrice') || 'Fiyat'}</option>
                <option value="netArea">{t('listings.sortByArea') || 'Alan'}</option>
                <option value="location">{t('listings.sortByLocation') || 'Konum'}</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="DESC">{t('listings.sortDesc') || 'Azalan'}</option>
                <option value="ASC">{t('listings.sortAsc') || 'Artan'}</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center text-luxury-medium-gray py-12">
              {t('listings.loading')}
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 py-12">
              {error}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="text-center text-luxury-medium-gray py-12">
              {t('listings.noListings') || 'Henüz ilan bulunmamaktadır.'}
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <>
              <div className="mb-4 text-sm text-luxury-medium-gray">
                {t('listings.showingResults') || 'Gösterilen'} {((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, pagination.total)} {t('listings.of') || '/'} {pagination.total} {t('listings.results') || 'sonuç'}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="border border-luxury-silver hover:shadow-lg transition-shadow block"
                  >
                    {listing.images && listing.images.length > 0 && (
                      <div className="aspect-video bg-luxury-light-gray overflow-hidden">
                        <img
                          src={listing.images[0].url}
                          alt={getLocalizedText(listing.title)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-serif mb-2 text-luxury-black">
                        {getLocalizedText(listing.title)}
                      </h3>
                      <p className="text-luxury-medium-gray text-sm mb-4 line-clamp-2">
                        {getLocalizedText(listing.description)}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-serif text-luxury-black">
                          {formatPrice(listing.price, listing.currency)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-luxury-medium-gray mb-4">
                        <span>{listing.netArea} {t('listings.squareMeter')}</span>
                        {listing.grossArea && <span>• {listing.grossArea} {t('listings.squareMeter')} ({t('listings.gross')})</span>}
                        <span>• {listing.roomCount} {t('listings.room')}</span>
                      </div>
                      <div className="text-sm text-luxury-medium-gray">
                        📍 {listing.location}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-luxury-silver disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury-light-gray"
                  >
                    {t('listings.previous') || 'Önceki'}
                  </button>
                  <span className="px-4 py-2 text-luxury-medium-gray">
                    {t('listings.page') || 'Sayfa'} {page} {t('listings.of') || '/'} {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 border border-luxury-silver disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury-light-gray"
                  >
                    {t('listings.next') || 'Sonraki'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
