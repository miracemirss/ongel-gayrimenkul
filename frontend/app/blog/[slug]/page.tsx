'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/blog/${slug}`);
      setPost(res.data);
    } catch (err: any) {
      console.error('Error fetching blog post:', err);
      if (err.response?.status === 404) {
        setError('Blog yazısı bulunamadı.');
      } else {
        setError('Blog yazısı yüklenirken bir hata oluştu.');
      }
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-luxury-white dark:bg-luxury-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-luxury-medium-gray">Yükleniyor...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-luxury-white dark:bg-luxury-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-serif mb-4 text-luxury-black dark:text-luxury-white">
                {error || 'Blog yazısı bulunamadı'}
              </h1>
              <Link
                href="/blog"
                className="text-luxury-medium-gray hover:text-luxury-black dark:hover:text-luxury-white"
              >
                ← Blog sayfasına dön
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white dark:bg-luxury-black">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/blog"
            className="inline-block mb-6 text-luxury-medium-gray hover:text-luxury-black dark:hover:text-luxury-white"
          >
            ← Blog sayfasına dön
          </Link>

          {post.coverImageUrl && (
            <div className="mb-8 aspect-video relative overflow-hidden bg-luxury-light-gray">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-5xl font-serif mb-4 text-luxury-black dark:text-luxury-white">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-luxury-medium-gray mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="text-sm text-luxury-medium-gray">
              {formatDate(post.publishedAt)}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none text-luxury-black dark:text-luxury-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-luxury-silver dark:border-luxury-dark-gray">
            <Link
              href="/blog"
              className="text-luxury-medium-gray hover:text-luxury-black dark:hover:text-luxury-white"
            >
              ← Tüm blog yazılarına dön
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

