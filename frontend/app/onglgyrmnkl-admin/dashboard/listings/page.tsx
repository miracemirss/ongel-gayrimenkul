'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

interface Listing {
  id: string;
  title: { tr: string; en: string; ar: string };
  price: number;
  currency: string;
  status: string;
  location: string;
  images?: Array<{ url: string }>;
}

interface PaginationResponse {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ListingsPage() {
  const router = useRouter();
  useActivityTracker();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
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
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.status) params.append('status', filters.status);
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

      const response = await api.get<PaginationResponse>(`/listings?${params.toString()}`);
      setListings(response.data.data || []);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
        limit: response.data.limit,
      });
    } catch (err) {
      console.error('Error fetching listings:', err);
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
      status: '',
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await api.delete(`/listings/${id}`);
      await fetchListings();
      alert('İlan başarıyla silindi.');
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      alert(error.response?.data?.message || 'İlan silinirken bir hata oluştu.');
    }
  };

  const getLocalizedText = (obj: { tr: string; en: string; ar: string }) => {
    return obj.tr || obj.en || obj.ar || '';
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active_for_sale: 'Satılık',
      active_for_rent: 'Kiralık',
      sold: 'Satıldı',
      rented: 'Kiraya Verildi',
      inactive: 'Pasif',
    };
    return labels[status] || status;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">İlanlar</h1>
            <div className="flex gap-4">
              <a
                href="/onglgyrmnkl-admin/dashboard"
                className="text-luxury-medium-gray hover:text-luxury-black"
              >
                ← Dashboard
              </a>
              <a
                href="/onglgyrmnkl-admin/dashboard/listings/new"
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray"
              >
                + Yeni İlan
              </a>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-8 space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active_for_sale">Satılık</option>
                <option value="active_for_rent">Kiralık</option>
                <option value="sold">Satıldı</option>
                <option value="rented">Kiraya Verildi</option>
                <option value="inactive">Pasif</option>
              </select>
              <input
                type="text"
                placeholder="Konum"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder="Min Fiyat"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder="Max Fiyat"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Min m²"
                value={filters.minArea}
                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="number"
                placeholder="Max m²"
                value={filters.maxArea}
                onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <input
                type="text"
                placeholder="Oda (örn: 2+1)"
                value={filters.roomCount}
                onChange={(e) => handleFilterChange('roomCount', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <select
                value={filters.currency}
                onChange={(e) => handleFilterChange('currency', e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="">Para Birimi</option>
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors"
              >
                Filtrele
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                Sıfırla
              </button>
              <label className="text-sm text-luxury-medium-gray ml-4">Sırala:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="createdAt">Tarih</option>
                <option value="price">Fiyat</option>
                <option value="netArea">Alan</option>
                <option value="location">Konum</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="DESC">Azalan</option>
                <option value="ASC">Artan</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-luxury-medium-gray">
              Henüz ilan bulunmamaktadır.
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-luxury-medium-gray">
                Gösterilen {((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, pagination.total)} / {pagination.total} sonuç
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-luxury-silver hover:shadow-lg transition-shadow relative"
                  >
                    <a href={`/onglgyrmnkl-admin/dashboard/listings/${listing.id}`}>
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
                        <p className="text-2xl font-serif text-luxury-black mb-2">
                          {formatPrice(listing.price, listing.currency)}
                        </p>
                        <p className="text-sm text-luxury-medium-gray mb-2">{listing.location}</p>
                        <span className="inline-block px-3 py-1 text-xs border border-luxury-silver">
                          {getStatusLabel(listing.status)}
                        </span>
                      </div>
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(listing.id);
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
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
                    Önceki
                  </button>
                  <span className="px-4 py-2 text-luxury-medium-gray">
                    Sayfa {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 border border-luxury-silver disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury-light-gray"
                  >
                    Sonraki
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
