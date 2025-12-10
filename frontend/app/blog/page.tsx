'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/blog?page=${page}&limit=9`);
      const data = res.data;
      
      if (data.posts) {
        setPosts(data.posts);
        setTotalPages(Math.ceil(data.total / data.limit));
      } else if (Array.isArray(data)) {
        setPosts(data);
        setTotalPages(1);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
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
            Blog
          </h1>
          <p className="text-luxury-medium-gray mb-12">
            Öngel Gayrimenkul&apos;den haberler, ipuçları ve güncel gelişmeler
          </p>

          {loading && (
            <div className="text-center py-12 text-luxury-medium-gray">
              Yükleniyor...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12 text-luxury-medium-gray">
              <p className="text-xl mb-4">Henüz blog yazısı bulunmamaktadır.</p>
              <p>Yakında yeni içerikler eklenecektir.</p>
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
                          Devamını oku →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <span className="px-4 py-2 text-luxury-medium-gray">
                    Sayfa {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray text-luxury-black dark:text-luxury-white hover:bg-luxury-light-gray dark:hover:bg-luxury-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
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

