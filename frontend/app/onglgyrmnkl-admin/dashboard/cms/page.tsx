'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { TokenExpiryWarning } from '@/components/common/TokenExpiryWarning';

interface CmsPage {
  id: string;
  type: 'about' | 'services' | 'mortgage';
  title: { tr: string; en: string; ar: string };
  content: { tr: string; en: string; ar: string };
  metaTitle?: { tr?: string; en?: string; ar?: string };
  metaDescription?: { tr?: string; en?: string; ar?: string };
}

export default function CmsPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [formData, setFormData] = useState<CmsPage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    loadPages();
  }, [router]);

  const loadPages = async () => {
    try {
      const res = await api.get('/cms/pages');
      const fetchedPages = res.data || [];
      setPages(fetchedPages);
      
      // If no pages exist, create default ones
      if (fetchedPages.length === 0) {
        await createDefaultPages();
        const res2 = await api.get('/cms/pages');
        setPages(res2.data || []);
        const aboutPage = res2.data?.find((p: CmsPage) => p.type === 'about');
        if (aboutPage) {
          setEditingPage(aboutPage);
          setFormData(aboutPage);
        }
      } else {
        // Load about page initially
        const aboutPage = fetchedPages.find((p: CmsPage) => p.type === 'about');
        const servicesPage = fetchedPages.find((p: CmsPage) => p.type === 'services');
        if (aboutPage) {
          setEditingPage(aboutPage);
          setFormData(aboutPage);
        } else if (servicesPage) {
          setEditingPage(servicesPage);
          setFormData(servicesPage);
        }
      }
    } catch (err: any) {
      console.error('Error fetching CMS pages:', err);
      if (err.response?.status === 403) {
        alert('Bu sayfaya erişim yetkiniz yok. Lütfen admin yetkisine sahip bir kullanıcı ile giriş yapın.');
        router.push('/onglgyrmnkl-admin/dashboard');
      } else if (err.response?.status === 401) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/onglgyrmnkl-admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPages = async () => {
    const defaultPages = [
      {
        type: 'about',
        title: { tr: 'Hakkımızda', en: 'About Us', ar: 'من نحن' },
        content: {
          tr: 'Öngel Gayrimenkul, lüks emlak ve finansal danışmanlık alanında uzmanlaşmış, müşteri memnuniyetini ön planda tutan bir danışmanlık firmasıdır.',
          en: 'Öngel Gayrimenkul is a consulting firm specialized in luxury real estate and financial consulting, prioritizing customer satisfaction.',
          ar: 'أونجل العقارية هي شركة استشارية متخصصة في العقارات الفاخرة والاستشارات المالية، مع إعطاء الأولوية لرضا العملاء.',
        },
      },
      {
        type: 'services',
        title: { tr: 'Hizmetlerimiz', en: 'Our Services', ar: 'خدماتنا' },
        content: {
          tr: 'Öngel Gayrimenkul olarak, lüks emlak ve finansal danışmanlık alanında kapsamlı hizmetler sunmaktayız.',
          en: 'As Öngel Gayrimenkul, we offer comprehensive services in the field of luxury real estate and financial consulting.',
          ar: 'كأونجل العقارية، نقدم خدمات شاملة في مجال العقارات الفاخرة والاستشارات المالية.',
        },
      },
    ];

    for (const page of defaultPages) {
      try {
        await api.post('/cms/pages', page);
      } catch (err) {
        console.error(`Error creating ${page.type} page:`, err);
      }
    }
  };

  const handlePageSelect = (page: CmsPage) => {
    setEditingPage(page);
    setFormData(page);
  };

  const handleSave = async () => {
    if (!formData || !editingPage) return;
    setSaving(true);

    try {
      // Prepare data without id, createdAt, updatedAt
      const saveData = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      // If page doesn't exist, create it
      if (!editingPage.id) {
        await api.post('/cms/pages', saveData);
        alert('İçerik başarıyla oluşturuldu.');
      } else {
        await api.patch(`/cms/pages/${editingPage.id}`, saveData);
        alert('İçerik başarıyla güncellendi.');
      }
      await loadPages();
    } catch (error: any) {
      console.error('Error saving CMS page:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'İçerik kaydedilirken bir hata oluştu.';
      
      if (error.response?.status === 403) {
        alert(`Yetki hatası: ${errorMessage}\n\nLütfen admin yetkisine sahip bir kullanıcı ile giriş yaptığınızdan emin olun.`);
      } else if (error.response?.status === 401) {
        // Check if token exists
        const token = localStorage.getItem('access_token');
        if (!token) {
          alert('Oturum açık değil. Lütfen giriş yapın.');
        } else {
          // Token might be expired - try to decode and check
          try {
            const { isTokenExpired } = require('@/lib/token-utils');
            if (isTokenExpired(token)) {
              alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            } else {
              alert('Oturum hatası. Lütfen sayfayı yenileyip tekrar deneyin. Sorun devam ederse tekrar giriş yapın.');
            }
          } catch (e) {
            alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          }
        }
        // Don't redirect immediately - let user see the error
        setTimeout(() => {
          router.push('/onglgyrmnkl-admin');
        }, 2000);
      } else {
        alert(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = async (type: 'about' | 'services' | 'mortgage') => {
    setSaving(true);
    try {
      const getPageTitle = (type: string) => {
        const titles: Record<string, { tr: string; en: string; ar: string }> = {
          about: { tr: 'Hakkımızda', en: 'About Us', ar: 'من نحن' },
          services: { tr: 'Hizmetlerimiz', en: 'Our Services', ar: 'خدماتنا' },
          mortgage: { tr: 'Mortgage', en: 'Mortgage', ar: 'الرهن العقاري' },
        };
        return titles[type] || { tr: '', en: '', ar: '' };
      };

      const newPage = {
        type,
        title: getPageTitle(type),
        content: { tr: 'İçerik...', en: 'Content...', ar: 'المحتوى...' },
      };
      
      const response = await api.post('/cms/pages', newPage);
      alert(`${getPageTitle(type).tr} sayfası başarıyla oluşturuldu.`);
      await loadPages();
      // Yeni oluşturulan sayfayı seç
      const res = await api.get('/cms/pages');
      const createdPage = res.data.find((p: CmsPage) => p.type === type);
      if (createdPage) {
        setEditingPage(createdPage);
        setFormData(createdPage);
      }
    } catch (error: any) {
      console.error('Error creating CMS page:', error);
      alert(error.response?.data?.message || 'Sayfa oluşturulurken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Bu sayfayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await api.delete(`/cms/pages/${pageId}`);
      alert('Sayfa başarıyla silindi.');
      await loadPages();
      // Select first available page or clear selection
      const remainingPages = pages.filter((p) => p.id !== pageId);
      if (remainingPages.length > 0) {
        setEditingPage(remainingPages[0]);
        setFormData(remainingPages[0]);
      } else {
        setEditingPage(null);
        setFormData(null);
      }
    } catch (error: any) {
      console.error('Error deleting page:', error);
      alert(error.response?.data?.message || 'Sayfa silinirken bir hata oluştu.');
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

  const getPageTitle = (type: string) => {
    const titles: Record<string, string> = {
      about: 'Hakkımızda',
      services: 'Hizmetlerimiz',
      mortgage: 'Mortgage',
    };
    return titles[type] || type;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">İçerik Yönetimi</h1>
            <a
              href="/onglgyrmnkl-admin/dashboard"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Dashboard
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Sayfalar</h2>
              <div className="space-y-2 mb-4">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageSelect(page)}
                      className={`flex-1 text-left px-4 py-2 border transition-colors ${
                        editingPage?.id === page.id
                          ? 'border-luxury-black bg-luxury-light-gray'
                          : 'border-luxury-silver hover:border-luxury-black'
                      }`}
                    >
                      {getPageTitle(page.type)}
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="px-3 py-2 bg-red-600 text-white text-xs hover:bg-red-700"
                      title="Sil"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-luxury-silver">
                <p className="text-sm text-luxury-medium-gray mb-2">Sayfa yoksa oluştur:</p>
                <div className="space-y-2">
                  {!pages.find((p) => p.type === 'about') && (
                    <button
                      onClick={() => handleCreateNew('about')}
                      disabled={saving}
                      className="w-full text-left px-4 py-2 border border-luxury-silver hover:border-luxury-black hover:bg-luxury-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Hakkımızda
                    </button>
                  )}
                  {!pages.find((p) => p.type === 'services') && (
                    <button
                      onClick={() => handleCreateNew('services')}
                      disabled={saving}
                      className="w-full text-left px-4 py-2 border border-luxury-silver hover:border-luxury-black hover:bg-luxury-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Hizmetlerimiz
                    </button>
                  )}
                  {!pages.find((p) => p.type === 'mortgage') && (
                    <button
                      onClick={() => handleCreateNew('mortgage')}
                      disabled={saving}
                      className="w-full text-left px-4 py-2 border border-luxury-silver hover:border-luxury-black hover:bg-luxury-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Mortgage
                    </button>
                  )}
                  {pages.find((p) => p.type === 'about') && 
                   pages.find((p) => p.type === 'services') && 
                   pages.find((p) => p.type === 'mortgage') && (
                    <p className="text-xs text-luxury-medium-gray italic">Tüm sayfalar oluşturulmuş.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {formData && editingPage ? (
                <div className="border border-luxury-silver p-6">
                  <h2 className="text-2xl font-serif mb-6 text-luxury-black">
                    {getPageTitle(editingPage.type)} Düzenle
                  </h2>

                  <div className="space-y-6">
                    {(['tr', 'en', 'ar'] as const).map((lang) => (
                      <div key={lang} className="border-b border-luxury-silver pb-6">
                        <h3 className="text-lg font-medium mb-4 text-luxury-black">
                          {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : 'العربية'}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-luxury-black mb-2">Başlık</label>
                            <input
                              type="text"
                              value={formData.title[lang]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: { ...formData.title, [lang]: e.target.value },
                                })
                              }
                              className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-luxury-black mb-2">İçerik</label>
                            <textarea
                              value={formData.content[lang]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  content: { ...formData.content, [lang]: e.target.value },
                                })
                              }
                              rows={8}
                              className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-8 py-3 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray disabled:opacity-50"
                    >
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-luxury-silver p-6 text-center text-luxury-medium-gray">
                  Düzenlemek için bir sayfa seçin
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

