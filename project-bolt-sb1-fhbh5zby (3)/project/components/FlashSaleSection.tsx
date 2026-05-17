'use client';

import { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/supabase';

function CountdownTimer({ endTime }: { endTime: string }) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[t.h, t.m, t.s].map((val, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="bg-gray-900 text-white font-bold text-sm px-2 py-1 rounded-lg min-w-[36px] text-center">{pad(val)}</div>
          {i < 2 && <span className="text-gray-900 dark:text-white font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function FlashSaleSection({ products }: { products: Product[] }) {
  if (!products.length) return null;
  const endTime = products[0]?.flash_sale_end || new Date(Date.now() + 86400000).toISOString();
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-xl"><Zap className="w-5 h-5 text-white fill-white" /></div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Flash Sales <span className="text-red-500 text-sm font-normal animate-pulse">LIVE</span>
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">Ends in:</span>
                <CountdownTimer endTime={endTime} />
              </div>
            </div>
          </div>
          <Link href="/flash-sales" className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
