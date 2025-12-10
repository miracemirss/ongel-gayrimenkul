'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const router = useRouter();
  useActivityTracker();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    loadPosts();
  }, [router]);

  const loadPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await api.get(`/blog/admin/all?${params.toString()}`);
      const data = res.data?.posts || res.data || [];
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
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

  const handlePostSelect = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      status: 'draft',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Başlık ve içerik zorunludur.');
      return;
    }

    setSaving(true);

    try {
      const saveData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImageUrl: formData.coverImageUrl,
        status: formData.status || 'draft',
        publishedAt: formData.publishedAt,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
      };

      if (!editingPost) {
        await api.post('/blog', saveData);
        alert('Blog yazısı başarıyla oluşturuldu.');
      } else {
        await api.patch(`/blog/${editingPost.id}`, saveData);
        alert('Blog yazısı başarıyla güncellendi.');
      }
      await loadPosts();
      setEditingPost(null);
      setFormData({});
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Blog yazısı kaydedilirken bir hata oluştu.';
      
      if (error.response?.status === 403) {
        alert(`Yetki hatası: ${errorMessage}`);
      } else if (error.response?.status === 401) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/onglgyrmnkl-admin');
      } else {
        alert(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await api.delete(`/blog/${postId}`);
      alert('Blog yazısı başarıyla silindi.');
      await loadPosts();
      if (editingPost?.id === postId) {
        setEditingPost(null);
        setFormData({});
      }
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      alert(error.response?.data?.message || 'Blog yazısı silinirken bir hata oluştu.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            <h1 className="text-4xl font-serif text-luxury-black">Blog Yönetimi</h1>
            <a
              href="/onglgyrmnkl-admin/dashboard"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Dashboard
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-luxury-silver p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-luxury-black">Blog Yazıları</h2>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray text-sm"
                >
                  + Yeni
                </button>
              </div>

              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Debounce search - reload after user stops typing
                    setTimeout(() => loadPosts(), 500);
                  }}
                  className="w-full px-3 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black text-sm"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'all' | 'draft' | 'published');
                    loadPosts();
                  }}
                  className="w-full px-3 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="published">Yayınlanan</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handlePostSelect(post)}
                      className={`flex-1 text-left px-4 py-2 border transition-colors text-sm ${
                        editingPost?.id === post.id
                          ? 'border-luxury-black bg-luxury-light-gray'
                          : 'border-luxury-silver hover:border-luxury-black'
                      }`}
                    >
                      <div className="font-medium truncate">{post.title}</div>
                      <div className="text-xs text-luxury-medium-gray">
                        {post.status === 'published' ? '✓ Yayında' : '📝 Taslak'}
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-2 bg-red-600 text-white text-xs hover:bg-red-700"
                      title="Sil"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="text-sm text-luxury-medium-gray text-center py-4">
                    Blog yazısı bulunamadı.
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {formData.title !== undefined ? (
                <div className="border border-luxury-silver p-6">
                  <h2 className="text-2xl font-serif mb-6 text-luxury-black">
                    {editingPost ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı'}
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">
                        Slug (URL) {formData.slug && <span className="text-xs text-luxury-medium-gray">(otomatik oluşturulur)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="otomatik-olusur"
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">
                        Özet
                      </label>
                      <textarea
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">
                        İçerik *
                      </label>
                      <textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={12}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black font-mono text-sm"
                      />
                      <p className="text-xs text-luxury-medium-gray mt-1">
                        HTML veya Markdown formatında yazabilirsiniz.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-black mb-2">
                        Kapak Görseli URL
                      </label>
                      <input
                        type="url"
                        value={formData.coverImageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-luxury-black mb-2">
                          Durum
                        </label>
                        <select
                          value={formData.status || 'draft'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                        >
                          <option value="draft">Taslak</option>
                          <option value="published">Yayınla</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-luxury-black mb-2">
                          Yayın Tarihi
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                          className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                        />
                      </div>
                    </div>

                    <div className="border-t border-luxury-silver pt-4">
                      <h3 className="text-lg font-medium mb-4 text-luxury-black">SEO Ayarları</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-luxury-black mb-2">
                            SEO Başlık
                          </label>
                          <input
                            type="text"
                            value={formData.seoTitle || ''}
                            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                            className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-luxury-black mb-2">
                            SEO Açıklama
                          </label>
                          <textarea
                            value={formData.seoDescription || ''}
                            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-luxury-black mb-2">
                            SEO Anahtar Kelimeler (virgülle ayrılmış)
                          </label>
                          <input
                            type="text"
                            value={formData.seoKeywords || ''}
                            onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                            className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray disabled:opacity-50"
                      >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setFormData({});
                        }}
                        className="px-8 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-luxury-silver p-6 text-center text-luxury-medium-gray">
                  Düzenlemek için bir blog yazısı seçin veya yeni bir yazı oluşturun.
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

