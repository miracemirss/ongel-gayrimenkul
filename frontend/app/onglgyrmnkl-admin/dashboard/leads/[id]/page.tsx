'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  relatedListingId?: string;
  assignedAgentId?: string;
  notes?: Array<{ id: string; content: string; createdAt: string }>;
  createdAt: string;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  useActivityTracker(); // 3 dakika inactivity tracking
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    api.get(`/leads/${id}`)
      .then((res) => setLead(res.data))
      .catch((err) => {
        console.error('Error fetching lead:', err);
        alert('Lead bulunamadı.');
        router.push('/onglgyrmnkl-admin/dashboard/leads');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);

    try {
      await api.post(`/leads/${id}/notes`, { content: newNote });
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Not eklenirken bir hata oluştu.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  if (loading || !lead) {
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <a
              href="/onglgyrmnkl-admin/dashboard/leads"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Geri
            </a>
            <div className="flex gap-4">
              <a
                href={`/onglgyrmnkl-admin/dashboard/leads/${id}/edit`}
                className="px-6 py-2 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray"
              >
                Düzenle
              </a>
              <button
                onClick={async () => {
                  if (!confirm('Bu lead\'i silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                    return;
                  }
                  try {
                    await api.delete(`/leads/${id}`);
                    alert('Lead başarıyla silindi.');
                    router.push('/onglgyrmnkl-admin/dashboard/leads');
                  } catch (error: any) {
                    console.error('Error deleting lead:', error);
                    alert(error.response?.data?.message || 'Lead silinirken bir hata oluştu.');
                  }
                }}
                className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>

          <div className="border border-luxury-silver p-6 mb-6">
            <h1 className="text-3xl font-serif mb-6 text-luxury-black">
              {lead.firstName} {lead.lastName}
            </h1>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-luxury-medium-gray mb-1">E-posta</p>
                <p className="text-luxury-black">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-luxury-medium-gray mb-1">Telefon</p>
                <p className="text-luxury-black">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-luxury-medium-gray mb-1">Kaynak</p>
                <p className="text-luxury-black">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm text-luxury-medium-gray mb-1">Durum</p>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                >
                  <option value="new">Yeni</option>
                  <option value="in_progress">İşlemde</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border border-luxury-silver p-6 mb-6">
            <h2 className="text-xl font-medium mb-4 text-luxury-black">Notlar</h2>
            <div className="space-y-4 mb-4">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-luxury-silver pl-4 py-2">
                    <p className="text-luxury-black">{note.content}</p>
                    <p className="text-xs text-luxury-medium-gray mt-1">
                      {new Date(note.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-luxury-medium-gray">Henüz not eklenmemiş.</p>
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yeni not ekle..."
                rows={3}
                className="flex-1 px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
              />
              <button
                onClick={handleAddNote}
                disabled={addingNote || !newNote.trim()}
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

