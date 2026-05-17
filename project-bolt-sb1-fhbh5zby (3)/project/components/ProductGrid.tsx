import ProductCard from './ProductCard';
import type { Product } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = { title: string; subtitle?: string; products: Product[]; viewAllHref?: string; };

export default function ProductGrid({ title, subtitle, products, viewAllHref }: Props) {
  if (!products.length) return null;
  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline flex-shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
