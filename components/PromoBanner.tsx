import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const banners = [
  { title: 'European Fashion Week', subtitle: 'Latest trends from Paris & Milan', cta: 'Shop Now', href: '/products?category=women-fashion', bg: 'from-rose-600 to-rose-800', image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg' },
  { title: 'Dubai Luxury Collection', subtitle: 'Premium watches, bags & accessories', cta: 'Explore', href: '/products?category=watches', bg: 'from-amber-600 to-amber-800', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg' },
  { title: 'Chinese Electronics', subtitle: 'Best tech deals at unbeatable prices', cta: 'Shop Tech', href: '/products?category=electronics', bg: 'from-blue-600 to-blue-900', image: 'https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg' },
];

export default function PromoBanner() {
  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {banners.map((b) => (
            <Link key={b.title} href={b.href} className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:h-52">
              <div className="absolute inset-0" style={{ backgroundImage: `url(${b.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.bg} opacity-80`} />
              <div className="relative p-5 h-full flex flex-col justify-end">
                <h3 className="text-white font-bold text-lg leading-tight">{b.title}</h3>
                <p className="text-white/80 text-xs mt-1 mb-3">{b.subtitle}</p>
                <div className="flex items-center gap-1 text-gold-300 text-sm font-semibold group-hover:gap-2 transition-all">
                  {b.cta} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
