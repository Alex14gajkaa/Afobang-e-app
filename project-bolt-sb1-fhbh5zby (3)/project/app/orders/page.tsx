'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPriceRaw } from '@/lib/utils';

type Order = {
  id: string; order_number: string; status: string; total: number; created_at: string;
  delivery_region: string; delivery_area: string; payment_method: string;
  order_items: { product_name: string; quantity: number; price: number; product_image: string }[];
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: Package },
  shipped: { label: 'Shipped', color: 'text-green-700 bg-green-50 dark:bg-green-900/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-700 bg-green-50 dark:bg-green-900/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50 dark:bg-red-900/20', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthed(false); setLoading(false); return; }
      const { data } = await supabase.from('orders').select('*, order_items(product_name, quantity, price, product_image)').eq('user_id', user.id).order('created_at', { ascending: false });
      setOrders((data as any) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-32 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer" />)}
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pb-32 text-center">
        <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Sign in to view orders</h2>
        <p className="text-gray-500 mb-8">Track your orders and manage your account</p>
        <Link href="/auth" className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl inline-block transition-colors">Sign In</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pb-32 text-center">
        <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">No orders yet</h2>
        <p className="text-gray-500 mb-8">Your order history will appear here</p>
        <Link href="/products" className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl inline-block transition-colors">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          return (
            <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" /> {cfg.label}
                  </span>
                  <span className="font-bold text-green-700 dark:text-green-400">{formatPriceRaw(order.total)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-3">
                  {order.order_items?.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2">
                      <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-xl object-cover" />
                    </div>
                  ))}
                  {(order.order_items?.length || 0) > 5 && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      +{(order.order_items?.length || 0) - 5}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-500">{order.order_items?.length} item{order.order_items?.length !== 1 ? 's' : ''} · {order.delivery_area}, {order.delivery_region}</p>
                  <Link href={`/orders/${order.id}`} className="flex items-center gap-1 text-green-700 dark:text-green-400 font-medium hover:underline">
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
