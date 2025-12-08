'use client';

import { useLanguage, Language } from '@/contexts/LanguageContext';

type LanguageSelectorProps = {
  variant?: 'light' | 'dark';
};

export default function LanguageSelector({ variant = 'dark' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`text-xs tracking-wide px-2 py-1 transition-colors ${
            language === lang.code
              ? isLight
                ? 'text-white font-semibold border-b border-white'
                : 'text-luxury-black font-semibold border-b border-luxury-black'
              : isLight
              ? 'text-white/70 hover:text-white'
              : 'text-luxury-medium-gray hover:text-luxury-black'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
