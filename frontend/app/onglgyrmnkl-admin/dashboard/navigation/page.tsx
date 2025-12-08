'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

interface NavItem {
  id: string;
  label: { tr: string; en: string; ar: string };
  href: string;
  type: 'link' | 'dropdown';
  order: number;
  isActive: boolean;
  parentId?: string;
}

export default function NavigationPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [formData, setFormData] = useState<NavItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    loadItems();
  }, [router]);

  const loadItems = async () => {
    try {
      const res = await api.get('/navigation/admin');
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching navigation items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item: NavItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    const newItem: NavItem = {
      id: '',
      label: { tr: '', en: '', ar: '' },
      href: '',
      type: 'link',
      order: items.length,
      isActive: true,
    };
    setEditingItem(newItem);
    setFormData(newItem);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);

    try {
      const saveData = {
        label: formData.label,
        href: formData.href,
        type: formData.type,
        order: formData.order,
        isActive: formData.isActive,
        parentId: formData.parentId || undefined,
      };

      if (!editingItem?.id) {
        await api.post('/navigation', saveData);
        alert('Navigasyon öğesi başarıyla oluşturuldu.');
      } else {
        await api.patch(`/navigation/${editingItem.id}`, saveData);
        alert('Navigasyon öğesi başarıyla güncellendi.');
      }
      await loadItems();
      setShowForm(false);
      setEditingItem(null);
      setFormData(null);
    } catch (error: any) {
      console.error('Error saving navigation item:', error);
      alert(error.response?.data?.message || 'Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Bu navigasyon öğesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await api.delete(`/navigation/${itemId}`);
      alert('Navigasyon öğesi başarıyla silindi.');
      await loadItems();
      if (editingItem?.id === itemId) {
        setShowForm(false);
        setEditingItem(null);
        setFormData(null);
      }
    } catch (error: any) {
      console.error('Error deleting navigation item:', error);
      alert(error.response?.data?.message || 'Silinirken bir hata oluştu.');
    }
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">Navigasyon Menüsü</h1>
            <div className="flex gap-4">
              <button
                onClick={handleCreateNew}
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray"
              >
                + Yeni Öğe
              </button>
              <a
                href="/onglgyrmnkl-admin/dashboard"
                className="text-luxury-medium-gray hover:text-luxury-black"
              >
                ← Dashboard
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Menü Öğeleri</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handleItemSelect(item)}
                      className={`flex-1 text-left px-4 py-2 border transition-colors ${
                        editingItem?.id === item.id
                          ? 'border-luxury-black bg-luxury-light-gray'
                          : 'border-luxury-silver hover:border-luxury-black'
                      }`}
                    >
                      {item.label.tr || item.label.en || item.label.ar || item.href}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-600 text-white text-xs hover:bg-red-700"
                      title="Sil"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-luxury-medium-gray">Henüz menü öğesi yok.</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {showForm && formData ? (
                <div className="border border-luxury-silver p-6">
                  <h2 className="text-2xl font-serif mb-6 text-luxury-black">
                    {editingItem?.id ? 'Menü Öğesi Düzenle' : 'Yeni Menü Öğesi'}
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">URL</label>
                      <input
                        type="text"
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        required
                        placeholder="/about"
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">Tip</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'link' | 'dropdown' })}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      >
                        <option value="link">Link</option>
                        <option value="dropdown">Dropdown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">Sıra</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-luxury-black">Aktif</span>
                      </label>
                    </div>

                    {(['tr', 'en', 'ar'] as const).map((lang) => (
                      <div key={lang} className="border-b border-luxury-silver pb-4">
                        <h3 className="text-lg font-medium mb-4 text-luxury-black">
                          {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : 'العربية'} Etiket
                        </h3>
                        <input
                          type="text"
                          value={formData.label[lang]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              label: { ...formData.label, [lang]: e.target.value },
                            })
                          }
                          required
                          placeholder={lang === 'tr' ? 'Ana Sayfa' : lang === 'en' ? 'Home' : 'الرئيسية'}
                          className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                        />
                      </div>
                    ))}

                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingItem(null);
                          setFormData(null);
                        }}
                        className="px-8 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-luxury-silver p-6">
                  <p className="text-luxury-medium-gray">Düzenlemek için bir menü öğesi seçin veya yeni öğe oluşturun.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

