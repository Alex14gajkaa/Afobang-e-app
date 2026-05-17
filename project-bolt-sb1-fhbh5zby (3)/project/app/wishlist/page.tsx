'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { formatPriceRaw } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const { items: wishlistIds, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) { setLoading(false); setProducts([]); return; }
    supabase.from('products').select('*, categories(*)').in('id', wishlistIds).eq('is_active', true)
      .then(({ data }) => { setProducts((data as any) || []); setLoading(false); });
  }, [wishlistIds]);

  const handleAddToCart = (p: Product) => {
    const img = p.images?.[0] || 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg';
    addItem({ id: `${p.id}-default`, product_id: p.id, name: p.name, price: p.price, sale_price: p.sale_price, image: img, quantity: 1, stock: p.stock_quantity });
    toast({ title: 'Added to cart!', description: p.name });
  };

  const handleAddAll = () => {
    products.forEach((p) => handleAddToCart(p));
    toast({ title: 'All items added to cart!' });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32 md:pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer" />)}
        </div>
      </div>
    );
  }

  if (wishlistIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 pb-32 md:pb-20 text-center">
        <Heart className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Save items you love and come back to them anytime</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{wishlistIds.length} saved item{wishlistIds.length !== 1 ? 's' : ''}</p>
        </div>
        {products.length > 0 && (
          <button onClick={handleAddAll} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <ShoppingCart className="w-4 h-4" /> Add All to Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {products.map((p) => {
          const img = p.images?.[0] || 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg';
          const isOnSale = p.sale_price !== null && p.sale_price < p.price;
          return (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group hover:shadow-card-hover transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Link href={`/products/${p.slug}`}>
                  <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                {isOnSale && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</div>
                )}
                <button onClick={() => toggleItem(p.id)} className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
              <div className="p-3">
                <Link href={`/products/${p.slug}`}>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-2 hover:text-green-700 transition-colors">{p.name}</p>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">{formatPriceRaw(p.sale_price ?? p.price)}</span>
                  {isOnSale && <span className="text-xs text-gray-400 line-through">{formatPriceRaw(p.price)}</span>}
                </div>
                <button onClick={() => handleAddToCart(p)} disabled={p.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {p.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
