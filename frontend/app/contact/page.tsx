'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    website: '', // Honeypot field for spam protection
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.fullName = 'Ad Soyad en az 3 karakter olmalıdır';
    }

    if (!formData.email) {
      errors.email = 'E-posta adresi gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/contact', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim(),
        website: formData.website, // Honeypot - should be empty
      });
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', message: '', website: '' });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    tr: {
      title: 'İletişim',
      subtitle: 'Bizimle iletişime geçin',
      fullName: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      message: 'Mesaj',
      optional: 'İsteğe bağlı',
      submit: 'Gönder',
      submitting: 'Gönderiliyor...',
      success: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
    },
    en: {
      title: 'Contact',
      subtitle: 'Get in touch with us',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      optional: 'Optional',
      submit: 'Submit',
      submitting: 'Submitting...',
      success: 'Your message has been sent successfully. We will get back to you soon.',
    },
    ar: {
      title: 'اتصل بنا',
      subtitle: 'تواصل معنا',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      message: 'الرسالة',
      optional: 'اختياري',
      submit: 'إرسال',
      submitting: 'جاري الإرسال...',
      success: 'تم إرسال رسالتك بنجاح. سنعود إليك قريباً.',
    },
  };

  const t_page = (key: string) => translations[language]?.[key] || key;

  return (
    <>
      <Header />
          <main className="min-h-screen pt-20 bg-luxury-white dark:bg-luxury-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-luxury text-5xl font-serif mb-4 text-luxury-black dark:text-luxury-white">
            {t_page('title')}
          </h1>
          <p className="text-luxury-medium-gray mb-12">
            {t_page('subtitle')}
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded">
              {t_page('success')}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                {t_page('fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (validationErrors.fullName) {
                    setValidationErrors({ ...validationErrors, fullName: '' });
                  }
                }}
                className={`w-full px-4 py-2 border ${
                  validationErrors.fullName
                    ? 'border-red-500'
                    : 'border-luxury-silver dark:border-luxury-dark-gray'
                } bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors`}
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                {t_page('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
                className={`w-full px-4 py-2 border ${
                  validationErrors.email
                    ? 'border-red-500'
                    : 'border-luxury-silver dark:border-luxury-dark-gray'
                } bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                {t_page('phone')} <span className="text-luxury-medium-gray text-xs">({t_page('optional')})</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (validationErrors.phone) {
                    setValidationErrors({ ...validationErrors, phone: '' });
                  }
                }}
                className={`w-full px-4 py-2 border ${
                  validationErrors.phone
                    ? 'border-red-500'
                    : 'border-luxury-silver dark:border-luxury-dark-gray'
                } bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                {t_page('message')}
              </label>
              <textarea
                id="message"
                rows={6}
                required
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (validationErrors.message) {
                    setValidationErrors({ ...validationErrors, message: '' });
                  }
                }}
                className={`w-full px-4 py-2 border ${
                  validationErrors.message
                    ? 'border-red-500'
                    : 'border-luxury-silver dark:border-luxury-dark-gray'
                } bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors`}
              />
              {validationErrors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-luxury-black dark:bg-luxury-white text-luxury-white dark:text-luxury-black py-3 hover:bg-luxury-dark-gray dark:hover:bg-luxury-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t_page('submitting') : t_page('submit')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

