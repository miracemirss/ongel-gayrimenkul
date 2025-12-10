'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, User } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { TokenExpiryWarning } from '@/components/common/TokenExpiryWarning';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    listings: 0,
    leads: 0,
  });

  useEffect(() => {
    // Get user from localStorage only on client side
    const currentUser = auth.getUser();
    setUser(currentUser);

    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    // Fetch stats
    Promise.all([
      api.get('/listings?limit=1').then((res) => res.data), // Get pagination metadata with minimal data
      api.get('/leads').then((res) => res.data),
    ])
      .then(([listingsResponse, leads]) => {
        // Handle new pagination format: { data, total, page, limit, totalPages }
        const listingsCount = listingsResponse?.total ?? (Array.isArray(listingsResponse) ? listingsResponse.length : 0);
        const leadsCount = leads?.total ?? (Array.isArray(leads) ? leads.length : 0);
        
        setStats({
          listings: listingsCount,
          leads: leadsCount,
        });
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
      });
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif text-luxury-black">
              Admin Dashboard
            </h1>
            <button
              onClick={() => {
                auth.logout();
              }}
              className="px-4 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-2 text-luxury-black">İlanlar</h2>
              <p className="text-3xl font-serif text-luxury-black">{stats.listings}</p>
              <a
                href="/onglgyrmnkl-admin/dashboard/listings"
                className="text-sm text-luxury-medium-gray hover:text-luxury-black mt-4 inline-block"
              >
                Tümünü Gör →
              </a>
            </div>

            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-2 text-luxury-black">Lead&apos;ler</h2>
              <p className="text-3xl font-serif text-luxury-black">{stats.leads}</p>
              <a
                href="/onglgyrmnkl-admin/dashboard/leads"
                className="text-sm text-luxury-medium-gray hover:text-luxury-black mt-4 inline-block"
              >
                Tümünü Gör →
              </a>
            </div>
          </div>

          <div className="border border-luxury-silver p-6 mb-6">
            <h2 className="text-xl font-medium mb-4 text-luxury-black">Hızlı İşlemler</h2>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/onglgyrmnkl-admin/dashboard/listings/new"
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors"
              >
                Yeni İlan Ekle
              </a>
              <a
                href="/onglgyrmnkl-admin/dashboard/leads/new"
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                Yeni Lead Ekle
              </a>
            </div>
          </div>

          <div className="border border-luxury-silver p-6">
            <h2 className="text-xl font-medium mb-4 text-luxury-black">İçerik Yönetimi</h2>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/onglgyrmnkl-admin/dashboard/cms"
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                CMS Sayfaları
              </a>
              <a
                href="/onglgyrmnkl-admin/dashboard/blog"
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                Blog Yönetimi
              </a>
              <a
                href="/onglgyrmnkl-admin/dashboard/navigation"
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                Navigasyon Menüsü
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <TokenExpiryWarning warningThreshold={5} />
    </>
  );
}

