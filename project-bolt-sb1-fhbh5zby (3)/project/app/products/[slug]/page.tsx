'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Globe, Package, Truck, Shield, ChevronLeft, ChevronRight, Minus, Plus, Zap } from 'lucide-react';
import { supabase, type Product, type Review } from '@/lib/supabase';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPriceRaw, getDiscountPercent } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const { toggleItem, isWished } = useWishlistStore();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('products').select('*, categories(*)').eq('slug', slug).eq('is_active', true).maybeSingle();
      if (!data) { router.push('/products'); return; }
      setProduct(data as any);
      setLoading(false);
      const { data: rev } = await supabase.from('product_reviews').select('*, profiles(full_name)').eq('product_id', data.id).order('created_at', { ascending: false }).limit(10);
      setReviews((rev as any) || []);
      if (data.category_id) {
        const { data: rel } = await supabase.from('products').select('*, categories(*)').eq('category_id', data.category_id).eq('is_active', true).neq('id', data.id).limit(6);
        setRelated((rel as any) || []);
      }
    };
    load();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer" />
          <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded-xl animate-shimmer" style={{ width: `${80 - i * 8}%` }} />)}</div>
        </div>
      </div>
    );
  }

  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = isOnSale ? getDiscountPercent(product.price, product.sale_price!) : 0;
  const images = product.images?.length ? product.images : ['https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg'];
  const wished = isWished(product.id);

  const handleAddToCart = () => {
    addItem({ id: `${product.id}-default`, product_id: product.id, name: product.name, price: product.price, sale_price: product.sale_price, image: images[0], quantity, stock: product.stock_quantity });
    toast({ title: 'Added to cart!', description: `${product.name} x${quantity}` });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-green-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-green-700">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image src={images[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw,50vw" priority />
            {discount > 0 && <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}% OFF</div>}
            {product.flash_sale_end && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> Flash</div>}
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImage((a) => (a - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setActiveImage((a) => (a + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={cn('flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all', i === activeImage ? 'border-green-600' : 'border-transparent')}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.brand && <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">{product.brand}</p>}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{product.name}</h1>
          {product.review_count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-4 h-4', i < Math.round(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-200 dark:text-gray-700')} />)}</div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.review_count} reviews)</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-black text-green-700 dark:text-green-400">{formatPriceRaw(product.sale_price ?? product.price)}</span>
            {isOnSale && <>
              <span className="text-lg text-gray-400 line-through">{formatPriceRaw(product.price)}</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-2 py-0.5 rounded-lg">Save {formatPriceRaw(product.price - product.sale_price!)}</span>
            </>}
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className={cn('w-2 h-2 rounded-full', product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500')} />
            <span className={cn('text-sm font-medium', product.stock_quantity > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-500')}>
              {product.stock_quantity > 0 ? (product.stock_quantity < 10 ? `Only ${product.stock_quantity} left!` : 'In Stock') : 'Out of Stock'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {product.origin_country && <span className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full"><Globe className="w-3 h-3" /> Imported from {product.origin_country}</span>}
            {product.tags?.map((tag) => <span key={tag} className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full">#{tag}</span>)}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={product.stock_quantity === 0}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 dark:border-green-400 dark:text-green-400 font-bold py-3.5 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={() => { handleAddToCart(); router.push('/cart'); }} disabled={product.stock_quantity === 0}
              className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              Buy Now
            </button>
            <button onClick={() => toggleItem(product.id)} className="w-14 h-14 border-2 border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center hover:border-red-300 transition-colors flex-shrink-0">
              <Heart className={cn('w-5 h-5', wished ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
            {[{ icon: Truck, text: 'Free delivery on orders over D500', color: 'text-green-600' }, { icon: Package, text: 'Secure packaging guaranteed', color: 'text-blue-600' }, { icon: Shield, text: '7-day return policy', color: 'text-amber-600' }].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3"><Icon className={cn('w-4 h-4 flex-shrink-0', color)} /><span className="text-sm text-gray-600 dark:text-gray-400">{text}</span></div>
            ))}
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews ({reviews.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{(review as any).profiles?.full_name || 'Anonymous'}</p>
                    <div className="flex mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-3 h-3', i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200')} />)}</div>
                  </div>
                  {review.is_verified_purchase && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Verified</span>}
                </div>
                {review.title && <p className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">{review.title}</p>}
                <p className="text-sm text-gray-500 dark:text-gray-400">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
