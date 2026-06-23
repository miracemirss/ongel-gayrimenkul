'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'createdAt' | 'updatedAt' | 'title'>('publishedAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit] = useState(9);

  useEffect(() => {
    loadPosts();
  }, [page, sortBy, sortOrder, searchTerm, language]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('language', language);
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const res = await api.get(`/blog?${params.toString()}`);
      const data = res.data;
      
      if (data.posts) {
        setPosts(data.posts);
        setTotal(data.total);
        setTotalPages(data.totalPages || Math.ceil(data.total / data.limit));
      } else if (Array.isArray(data)) {
        setPosts(data);
        setTotalPages(1);
        setTotal(data.length);
      } else {
        setPosts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(t('blog.error') || 'Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    loadPosts();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const locale = language === 'tr' ? 'tr-TR' : language === 'en' ? 'en-US' : 'ar-SA';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white dark:bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-serif mb-4 text-luxury-black dark:text-luxury-white">
            {t('blog.title')}
          </h1>
          <p className="text-luxury-medium-gray mb-8">
            {t('blog.subtitle')}
          </p>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder={t('blog.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black dark:bg-luxury-dark-gray dark:border-luxury-medium-gray dark:text-luxury-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray dark:bg-luxury-white dark:text-luxury-black dark:hover:bg-luxury-light-gray transition-colors"
              >
                {t('blog.searchButton')}
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setPage(1);
                  }}
                  className="px-6 py-2 border border-luxury-silver hover:bg-luxury-light-gray dark:border-luxury-medium-gray dark:hover:bg-luxury-dark-gray transition-colors"
                >
                  {t('blog.clear')}
                </button>
              )}
            </form>

            <div className="flex gap-4 flex-wrap items-center">
              <label className="text-sm text-luxury-medium-gray">{t('blog.sortBy')}</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setPage(1);
                }}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black dark:bg-luxury-dark-gray dark:border-luxury-medium-gray dark:text-luxury-white"
              >
                <option value="publishedAt">{t('blog.sortByPublished')}</option>
                <option value="createdAt">{t('blog.sortByCreated')}</option>
                <option value="updatedAt">{t('blog.sortByUpdated')}</option>
                <option value="title">{t('blog.sortByTitle')}</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as typeof sortOrder);
                  setPage(1);
                }}
                className="px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black dark:bg-luxury-dark-gray dark:border-luxury-medium-gray dark:text-luxury-white"
              >
                <option value="DESC">{t('blog.sortDesc')}</option>
                <option value="ASC">{t('blog.sortAsc')}</option>
              </select>
              {searchTerm && (
                <span className="text-sm text-luxury-medium-gray">
                  {total} {t('blog.resultsFound')}
                </span>
              )}
            </div>
          </div>

          {loading && (
            <div className="text-center py-12 text-luxury-medium-gray">
              {t('blog.loading')}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12 text-luxury-medium-gray">
              <p className="text-xl mb-4">{t('blog.noPosts')}</p>
              <p>{t('blog.noPostsSoon')}</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group border border-luxury-silver dark:border-luxury-dark-gray hover:border-luxury-black dark:hover:border-luxury-white transition-colors overflow-hidden"
                  >
                    {post.coverImageUrl && (
                      <div className="aspect-video relative overflow-hidden bg-luxury-light-gray">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-serif mb-2 text-luxury-black dark:text-luxury-white group-hover:text-luxury-medium-gray transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-luxury-medium-gray mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-luxury-medium-gray">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="group-hover:text-luxury-black dark:group-hover:text-luxury-white transition-colors">
                          {t('blog.readMore')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('blog.first')}
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('blog.previous')}
                  </button>
                  <span className="px-4 py-2 text-luxury-medium-gray">
                    {t('blog.page')} {page} {t('blog.of')} {totalPages} ({total} {t('blog.posts')})
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('blog.next')}
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('blog.last')}
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

