'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart, Zap, Globe } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPriceRaw, getDiscountPercent } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

type Props = { product: Product; className?: string };

export default function ProductCard({ product, className }: Props) {
  const { addItem } = useCartStore();
  const { toggleItem, isWished } = useWishlistStore();
  const wished = isWished(product.id);
  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = isOnSale ? getDiscountPercent(product.price, product.sale_price!) : 0;
  const image = product.images?.[0] || 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: `${product.id}-default`, product_id: product.id, name: product.name, price: product.price, sale_price: product.sale_price, image, quantity: 1, stock: product.stock_quantity });
    toast({ title: 'Added to cart!', description: product.name });
  };

  return (
    <Link href={`/products/${product.slug}`} className={cn('block group', className)}>
      <div className="product-card bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-gray-800 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.flash_sale_end && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Flash</span>}
            {discount > 0 && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
            {product.is_best_seller && <span className="bg-gold-500 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Best Seller</span>}
          </div>
          {product.origin_country && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />{product.origin_country}
            </div>
          )}
          <button onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <Heart className={cn('w-4 h-4 transition-colors', wished ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[11px] text-gray-400 mb-1">{product.brand || 'Afobang'}</p>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug flex-1">{product.name}</h3>
          {product.review_count > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-3 h-3', i < Math.round(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-200 dark:text-gray-700')} />)}</div>
              <span className="text-[10px] text-gray-400">({product.review_count})</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-green-700 dark:text-green-400">{formatPriceRaw(product.sale_price ?? product.price)}</span>
            {isOnSale && <span className="text-xs text-gray-400 line-through">{formatPriceRaw(product.price)}</span>}
          </div>
          <button onClick={handleAddToCart} disabled={product.stock_quantity === 0}
            className={cn('mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5', product.stock_quantity === 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white active:scale-95')}>
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
