'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    tag: 'New Collection',
    title: 'Fashion from\nEurope & Dubai',
    subtitle: 'Premium imports delivered to your door across The Gambia',
    cta: 'Shop Now', ctaLink: '/products',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    bg: 'from-green-900 via-green-800 to-green-700',
  },
  {
    tag: 'Flash Sale — Up to 50% Off',
    title: 'Electronics &\nGadgets',
    subtitle: 'Latest smartphones, earbuds, TVs and more at unbeatable prices',
    cta: 'View Flash Sales', ctaLink: '/flash-sales',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    bg: 'from-gray-900 via-gray-800 to-gray-700',
  },
  {
    tag: 'Gambian Culture',
    title: 'Traditional Wear\n& Crafts',
    subtitle: 'Celebrate your heritage with authentic African and Gambian fashion',
    cta: 'Explore Culture', ctaLink: '/products?category=traditional-wear',
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
    bg: 'from-amber-900 via-amber-800 to-amber-700',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const go = (next: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(next); setFading(false); }, 200);
  };

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden">
      <div className={cn(`relative min-h-[420px] md:min-h-[520px] bg-gradient-to-r ${slide.bg} transition-opacity duration-300`, fading ? 'opacity-0' : 'opacity-100')}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-xl">
            <span className="inline-block text-sm font-semibold mb-3 bg-white/10 text-gold-300 px-3 py-1 rounded-full">{slide.tag}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight whitespace-pre-line mb-4">{slide.title}</h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">{slide.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
              <Link href={slide.ctaLink} className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-gray-900 font-bold px-7 py-3.5 rounded-2xl transition-all active:scale-95 text-base shadow-gold">
                {slide.cta} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all text-base border border-white/20">
                Browse All
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
              {[['1,000+', 'Products'], ['5,000+', 'Customers'], ['7 Regions', 'Delivery']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-white font-black text-lg md:text-xl">{val}</div>
                  <div className="text-white/60 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block w-72 h-72 lg:w-96 lg:h-80 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <button onClick={() => go((current - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => go((current + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} className={cn('rounded-full transition-all duration-300', i === current ? 'w-6 h-2 bg-gold-400' : 'w-2 h-2 bg-white/40')} />
          ))}
        </div>
      </div>
    </div>
  );
}
