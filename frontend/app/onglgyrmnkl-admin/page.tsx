'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(email, password);
      router.push('/onglgyrmnkl-admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 flex items-center justify-center bg-luxury-white">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-luxury text-4xl font-serif mb-2 text-luxury-black">
              Admin Girişi
            </h1>
            <p className="text-luxury-medium-gray">Yönetim paneline erişim</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-luxury-black mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
                className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-black text-luxury-white py-3 hover:bg-luxury-dark-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

