'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    api.get('/leads')
      .then((res) => setLeads(res.data || []))
      .catch((err) => console.error('Error fetching leads:', err))
      .finally(() => setLoading(false));
  }, [router]);

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      contact_form: 'İletişim Formu',
      portfolio_inquiry: 'Portföy Talebi',
      mortgage_application: 'Mortgage Ön Başvuru',
    };
    return labels[source] || source;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Yeni',
      in_progress: 'İşlemde',
      completed: 'Tamamlandı',
    };
    return labels[status] || status;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">Lead&apos;ler</h1>
            <div className="flex gap-4">
              <a
                href="/onglgyrmnkl-admin/dashboard"
                className="text-luxury-medium-gray hover:text-luxury-black"
              >
                ← Dashboard
              </a>
              <a
                href="/onglgyrmnkl-admin/dashboard/leads/new"
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray"
              >
                + Yeni Lead
              </a>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-luxury-medium-gray">
              Henüz lead bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-luxury-silver">
                <thead>
                  <tr className="bg-luxury-light-gray">
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">Ad Soyad</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">E-posta</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">Telefon</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">Kaynak</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">Durum</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">Tarih</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-luxury-black">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-luxury-silver">
                      <td className="px-6 py-4 text-luxury-black">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="px-6 py-4 text-luxury-medium-gray">{lead.email}</td>
                      <td className="px-6 py-4 text-luxury-medium-gray">{lead.phone}</td>
                      <td className="px-6 py-4 text-luxury-medium-gray">{getSourceLabel(lead.source)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs border border-luxury-silver">
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-luxury-medium-gray">
                        {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <a
                            href={`/onglgyrmnkl-admin/dashboard/leads/${lead.id}`}
                            className="text-luxury-black hover:underline"
                          >
                            Detay
                          </a>
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              if (!confirm("Bu lead'i silmek istediğinize emin misiniz?")) {
                                return;
                              }
                              try {
                                await api.delete(`/leads/${lead.id}`);
                                setLeads(leads.filter((l) => l.id !== lead.id));
                                alert('Lead başarıyla silindi.');
                              } catch (error: any) {
                                console.error('Error deleting lead:', error);
                                alert(error.response?.data?.message || 'Lead silinirken bir hata oluştu.');
                              }
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

