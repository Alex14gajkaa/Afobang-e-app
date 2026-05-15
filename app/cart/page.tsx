'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPriceRaw } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  const subtotal = totalPrice();
  const deliveryFee = subtotal >= 500 ? 0 : 75;
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal + deliveryFee - discountAmount;

  const applyCoupon = () => {
    const codes: Record<string, number> = { WELCOME20: 20, NEWUSER15: 15, AFOBANG10: 10 };
    const pct = codes[coupon.toUpperCase()];
    if (pct) { setDiscount(pct); setAppliedCoupon(coupon.toUpperCase()); setCoupon(''); }
    else alert('Invalid coupon code');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 pb-32 md:pb-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Discover thousands of products from Europe, Dubai, Turkey & China</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-2 mb-1">{item.name}</h3>
                <p className="text-green-700 dark:text-green-400 font-bold">{formatPriceRaw(item.sale_price ?? item.price)}</p>
                {item.sale_price && <p className="text-xs text-gray-400 line-through">{formatPriceRaw(item.price)}</p>}
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center text-sm font-bold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatPriceRaw((item.sale_price ?? item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 transition-colors">Clear cart</button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 h-fit sticky top-20">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Order Summary</h2>
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Coupon Code</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon} (-{discount}%)</span></div>
                <button onClick={() => { setAppliedCoupon(''); setDiscount(0); }} className="text-xs text-red-500 hover:text-red-600">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} placeholder="Enter code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                <button onClick={applyCoupon} className="px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">Apply</button>
              </div>
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatPriceRaw(subtotal)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount ({discount}%)</span><span>-{formatPriceRaw(discountAmount)}</span></div>}
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery fee</span><span>{deliveryFee === 0 ? 'Free' : formatPriceRaw(deliveryFee)}</span></div>
            {subtotal < 500 && <p className="text-xs text-amber-600 dark:text-amber-400">Add {formatPriceRaw(500 - subtotal)} more for free delivery!</p>}
            <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-3 border-t border-gray-100 dark:border-gray-800">
              <span>Total</span><span className="text-green-700 dark:text-green-400">{formatPriceRaw(total)}</span>
            </div>
          </div>
          <button onClick={() => router.push('/checkout')} className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-2xl mt-5 transition-all active:scale-95 flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
          </button>
          <Link href="/products" className="block text-center mt-3 text-sm text-gray-500 hover:text-green-700 transition-colors">Continue Shopping</Link>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 mb-2 text-center">Secure payment via</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {['Wave', 'QMoney', 'AfriMoney', 'Yonna', 'Visa', 'COD'].map((m) => <span key={m} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-lg">{m}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
