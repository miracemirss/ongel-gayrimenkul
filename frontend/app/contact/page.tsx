'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/leads', {
        ...formData,
        source: 'contact_form',
      });
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    tr: {
      title: 'İletişim',
      subtitle: 'Bizimle iletişime geçin',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      message: 'Mesaj',
      submit: 'Gönder',
      submitting: 'Gönderiliyor...',
      success: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
    },
    en: {
      title: 'Contact',
      subtitle: 'Get in touch with us',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      submit: 'Submit',
      submitting: 'Submitting...',
      success: 'Your message has been sent successfully. We will get back to you soon.',
    },
    ar: {
      title: 'اتصل بنا',
      subtitle: 'تواصل معنا',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      message: 'الرسالة',
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
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
              {t_page('success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                  {t_page('firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                  {t_page('lastName')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors"
                />
              </div>
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-luxury-black dark:text-luxury-white mb-2">
                {t_page('phone')}
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors"
              />
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
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-luxury-silver dark:border-luxury-dark-gray bg-luxury-white dark:bg-luxury-black text-luxury-black dark:text-luxury-white focus:outline-none focus:border-luxury-black dark:focus:border-luxury-white transition-colors"
              />
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

