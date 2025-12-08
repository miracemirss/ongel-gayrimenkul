import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Öngel Gayrimenkul - Luxury Real Estate',
  description: 'Lüks emlak ve finansal danışmanlık uzmanlığı',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-luxury-white text-luxury-black`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

