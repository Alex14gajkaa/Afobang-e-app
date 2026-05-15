'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, MapPin, CreditCard, CheckCircle, Truck, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { formatPriceRaw, GAMBIA_REGIONS, GAMBIA_AREAS, DELIVERY_FEES, DELIVERY_DAYS, PAYMENT_METHODS } from '@/lib/utils';

const STEPS = ['Delivery', 'Payment', 'Review'];

export default function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [delivery, setDelivery] = useState({
    full_name: '', phone: '', email: '', region: '', area: '', street: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const subtotal = totalPrice();
  const region = delivery.region;
  const deliveryFee = region ? (DELIVERY_FEES[region] ?? 100) : 75;
  const total = subtotal + deliveryFee;
  const deliveryDays = region ? (DELIVERY_DAYS[region] ?? '3-5 days') : '';

  const handleDeliveryNext = () => {
    if (!delivery.full_name || !delivery.phone || !delivery.region || !delivery.area || !delivery.street) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(1);
  };

  const handlePaymentNext = () => {
    if (!paymentMethod) { alert('Please select a payment method'); return; }
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const orderNum = `AFO-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error } = await supabase.from('orders').insert({
        order_number: orderNum,
        user_id: user?.id ?? null,
        status: 'pending',
        subtotal,
        delivery_fee: deliveryFee,
        discount_amount: 0,
        total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        delivery_region: delivery.region,
        delivery_area: delivery.area,
        delivery_address: delivery.street,
        customer_name: delivery.full_name,
        customer_phone: delivery.phone,
        customer_email: delivery.email,
        notes: delivery.notes,
      }).select().single();

      if (error || !order) throw error;

      await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          product_image: item.image,
          price: item.sale_price ?? item.price,
          quantity: item.quantity,
          subtotal: (item.sale_price ?? item.price) * item.quantity,
        }))
      );

      setOrderNumber(orderNum);
      clearCart();
      setStep(3);
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 pb-32 md:pb-16 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Your order has been received</p>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl px-6 py-4 mb-6 inline-block">
          <p className="text-xs text-gray-500 mb-1">Order Number</p>
          <p className="text-xl font-black text-green-700 dark:text-green-400">{orderNumber}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-green-600 flex-shrink-0" /><div><p className="text-xs text-gray-400">Delivery to</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{delivery.area}, {delivery.region}</p></div></div>
          <div className="flex items-center gap-3"><Truck className="w-4 h-4 text-green-600 flex-shrink-0" /><div><p className="text-xs text-gray-400">Estimated delivery</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{deliveryDays}</p></div></div>
          <div className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-green-600 flex-shrink-0" /><div><p className="text-xs text-gray-400">Payment</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</p></div></div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/account" className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all text-center">Track My Order</Link>
          <Link href="/products" className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl transition-all text-center hover:border-green-600">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Your cart is empty</h2>
        <Link href="/products" className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32 md:pb-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-green-700 dark:text-green-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < step ? 'bg-green-700 text-white' : i === step ? 'bg-green-700 text-white ring-4 ring-green-100 dark:ring-green-900/50' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>{i < step ? '✓' : i + 1}</div>
              <span className={`text-sm font-medium hidden sm:inline ${i === step ? 'text-green-700 dark:text-green-400' : ''}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-green-700' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 0: Delivery */}
          {step === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-700" /> Delivery Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name *</label>
                    <input value={delivery.full_name} onChange={(e) => setDelivery({ ...delivery, full_name: e.target.value })} placeholder="Your full name" className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Phone Number *</label>
                    <input value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} placeholder="+220 XXX XXXX" className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email (optional)</label>
                  <input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })} placeholder="your@email.com" className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Region *</label>
                    <select value={delivery.region} onChange={(e) => setDelivery({ ...delivery, region: e.target.value, area: '' })} className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500">
                      <option value="">Select region</option>
                      {GAMBIA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Area / Town *</label>
                    <select value={delivery.area} onChange={(e) => setDelivery({ ...delivery, area: e.target.value })} className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" disabled={!delivery.region}>
                      <option value="">Select area</option>
                      {(GAMBIA_AREAS[delivery.region] || []).map((a: string) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Street / Compound *</label>
                  <input value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} placeholder="House/compound description" className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Delivery Notes</label>
                  <textarea value={delivery.notes} onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })} placeholder="Landmarks, instructions..." rows={2} className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 resize-none" />
                </div>
                {delivery.region && (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
                    <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-700 dark:text-green-400">Delivery to <strong>{delivery.region}</strong>: <strong>{formatPriceRaw(DELIVERY_FEES[delivery.region] ?? 100)}</strong> · Est. {DELIVERY_DAYS[delivery.region] ?? '3-5 days'}</span>
                  </div>
                )}
              </div>
              <button onClick={handleDeliveryNext} className="w-full mt-6 bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                Continue to Payment <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-700" /> Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === method.id ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{method.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{method.description}</p>
                  </button>
                ))}
              </div>
              {paymentMethod && paymentMethod !== 'cod' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 mb-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">You will receive payment instructions via WhatsApp/SMS after placing your order.</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 font-medium hover:border-gray-300 transition-all"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button onClick={handlePaymentNext} className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  Review Order <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Review Your Order</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatPriceRaw((item.sale_price ?? item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 mb-5 text-sm">
                <div className="flex justify-between text-gray-500"><span>Delivery to</span><span className="font-medium text-gray-700 dark:text-gray-300">{delivery.area}, {delivery.region}</span></div>
                <div className="flex justify-between text-gray-500"><span>Payment via</span><span className="font-medium text-gray-700 dark:text-gray-300">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 font-medium hover:border-gray-300 transition-all"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button onClick={placeOrder} disabled={loading} className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {loading ? 'Placing Order...' : `Place Order · ${formatPriceRaw(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 h-fit sticky top-20">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-500 line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">{formatPriceRaw((item.sale_price ?? item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPriceRaw(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{deliveryFee > 0 ? formatPriceRaw(deliveryFee) : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Total</span><span className="text-green-700 dark:text-green-400">{formatPriceRaw(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
