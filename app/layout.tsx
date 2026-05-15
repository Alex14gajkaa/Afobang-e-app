import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Afobang — Shop Smart, Live Better', template: '%s | Afobang' },
  description:
    "Afobang is The Gambia's premier online marketplace. Shop quality fashion, electronics, beauty products and more imported from Europe, Dubai, Turkey & China. Fast delivery across all regions of The Gambia.",
  keywords: ['Gambia online shopping', 'Afobang', 'buy online Gambia', 'fashion Gambia', 'delivery Gambia'],
  manifest: '/manifest.json',
  themeColor: '#1b813c',
  openGraph: {
    type: 'website',
    siteName: 'Afobang',
    title: 'Afobang — Shop Smart, Live Better',
    description: "The Gambia's premier online marketplace.",
    images: [{ url: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('afobang-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
