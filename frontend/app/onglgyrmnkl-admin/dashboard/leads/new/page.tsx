'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

export default function NewLeadPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'contact_form',
    relatedListingId: '',
    assignedAgentId: '',
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    Promise.all([
      api.get('/listings').then((res) => setListings(res.data || [])),
      api.get('/users').then((res) => setUsers(res.data || [])),
    ]).catch((err) => console.error('Error fetching data:', err));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        ...formData,
        relatedListingId: formData.relatedListingId || undefined,
        assignedAgentId: formData.assignedAgentId || undefined,
      };
      await api.post('/leads', leadData);
      router.push('/onglgyrmnkl-admin/dashboard/leads');
    } catch (error: any) {
      console.error('Error creating lead:', error);
      alert(error.response?.data?.message || 'Lead oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">Yeni Lead Ekle</h1>
            <a
              href="/onglgyrmnkl-admin/dashboard/leads"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Geri
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Ad</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Soyad</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-black mb-2">E-posta</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-black mb-2">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-black mb-2">Kaynak</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="contact_form">İletişim Formu</option>
                <option value="portfolio_inquiry">Portföy Talebi</option>
                <option value="mortgage_application">Mortgage Ön Başvuru</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-black mb-2">İlgili İlan (Opsiyonel)</label>
              <select
                value={formData.relatedListingId}
                onChange={(e) => setFormData({ ...formData, relatedListingId: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="">Seçiniz</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title?.tr || listing.title?.en || listing.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-black mb-2">Atanan Danışman (Opsiyonel)</label>
              <select
                value={formData.assignedAgentId}
                onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              >
                <option value="">Seçiniz</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Lead Oluştur'}
              </button>
              <a
                href="/onglgyrmnkl-admin/dashboard/leads"
                className="px-8 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                İptal
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

