'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, CreditCard as Edit2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPriceRaw } from '@/lib/utils';

type Profile = { id: string; full_name: string | null; phone: string | null; email: string | null; role: string };
type Order = { id: string; order_number: string; status: string; total: number; created_at: string };

const TAB_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (prof) { setProfile(prof as Profile); setEditForm({ full_name: prof.full_name || '', phone: prof.phone || '' }); }
      const { data: ord } = await supabase.from('orders').select('id, order_number, status, total, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
      setOrders((ord as any) || []);
      setLoading(false);
    })();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: editForm.full_name, phone: editForm.phone }).eq('id', profile.id);
    setProfile({ ...profile, full_name: editForm.full_name, phone: editForm.phone });
    setEditing(false);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer mb-4" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-6 mb-6 text-white flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
          {(profile.full_name || 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-xl truncate">{profile.full_name || 'My Account'}</h1>
          <p className="text-green-200 text-sm truncate">{profile.email}</p>
          {profile.role === 'admin' && (
            <Link href="/admin" className="inline-block mt-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">Admin Dashboard</Link>
          )}
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm transition-colors flex-shrink-0">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6 overflow-x-auto scrollbar-hide">
        {TAB_ITEMS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <Icon className="w-4 h-4" />{t.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white">Personal Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 hover:underline"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /> Cancel</button>
                <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1 text-sm text-green-700 dark:text-green-400 font-semibold"><Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Full Name</label>
                  <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Phone</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500" />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profile.full_name || '—'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profile.email || '—'}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profile.phone || '—'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Package className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <Link href="/products" className="mt-4 inline-block text-sm text-green-700 dark:text-green-400 hover:underline">Start shopping</Link>
            </div>
          ) : (
            orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}
                className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-green-200 transition-all">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>{order.status}</span>
                  <span className="font-bold text-green-700 dark:text-green-400 text-sm">{formatPriceRaw(order.total)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {tab === 'wishlist' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center">
          <Heart className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">View and manage your saved items</p>
          <Link href="/wishlist" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl transition-colors">
            Go to Wishlist <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center">
          <MapPin className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Addresses are saved at checkout</p>
          <p className="text-xs text-gray-400">Your delivery addresses will be pre-filled for future orders once saved.</p>
        </div>
      )}
    </div>
  );
}
