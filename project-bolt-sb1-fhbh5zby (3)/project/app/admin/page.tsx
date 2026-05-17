'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Users, ShoppingBag, TrendingUp, ChartBar as BarChart2, ChevronRight, Plus, Pencil, Trash2, X, Upload, Star, Zap, Eye, EyeOff, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPriceRaw } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Order = {
  id: string; order_number: string; status: string; total: number; created_at: string;
  customer_name: string; customer_phone: string; delivery_region: string;
};

type Product = {
  id: string; name: string; slug: string; description: string;
  price: number; sale_price: number | null; flash_sale_end: string | null;
  category_id: string | null; stock_quantity: number;
  is_featured: boolean; is_best_seller: boolean; is_active: boolean;
  images: string[];
};

type Category = { id: string; name: string; slug: string };
type Customer = { id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string };

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700', shipped: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

// ─── Product Form Modal ───────────────────────────────────────────────────────

type ProductFormProps = {
  initial?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (p: Product) => void;
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ProductForm({ initial, categories, onClose, onSaved }: ProductFormProps) {
  const isNew = !initial;
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [salePrice, setSalePrice] = useState(initial?.sale_price?.toString() ?? '');
  const [flashSaleEnd, setFlashSaleEnd] = useState(
    initial?.flash_sale_end ? new Date(initial.flash_sale_end).toISOString().slice(0, 16) : ''
  );
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '');
  const [stock, setStock] = useState(initial?.stock_quantity?.toString() ?? '0');
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initial?.is_best_seller ?? false);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) { setError(`Upload failed: ${upErr.message}`); continue; }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    setImages((prev) => [...prev, ...newUrls]);
    setUploadingImages(false);
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = slugify(name) + (isNew ? `-${Date.now().toString(36)}` : '');
    const payload = {
      name, slug: isNew ? slug : initial!.slug,
      description,
      price: parseFloat(price) || 0,
      sale_price: salePrice ? parseFloat(salePrice) : null,
      flash_sale_end: flashSaleEnd || null,
      category_id: categoryId || null,
      stock_quantity: parseInt(stock) || 0,
      is_featured: isFeatured, is_best_seller: isBestSeller, is_active: isActive,
      images,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (isNew) {
      result = await supabase.from('products').insert({ ...payload, created_at: new Date().toISOString() }).select().maybeSingle();
    } else {
      result = await supabase.from('products').update(payload).eq('id', initial!.id).select().maybeSingle();
    }

    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved(result.data as Product);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl my-8 border border-gray-100 dark:border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">{isNew ? 'Add New Product' : 'Edit Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Product Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Leather Bag"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the product..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors resize-none" />
          </div>

          {/* Price + Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Price (GMD) *</label>
              <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Sale Price (GMD)</label>
              <input type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Leave empty if no sale"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Stock Quantity</label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
          </div>

          {/* Flash Sale End */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Flash Sale End Date/Time <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="datetime-local" value={flashSaleEnd} onChange={(e) => setFlashSaleEnd(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Featured', icon: Star, value: isFeatured, set: setIsFeatured, color: 'text-amber-500' },
              { label: 'Best Seller', icon: Zap, value: isBestSeller, set: setIsBestSeller, color: 'text-blue-500' },
              { label: 'Active', icon: Eye, value: isActive, set: setIsActive, color: 'text-green-600' },
            ].map(({ label, icon: Icon, value, set, color }) => (
              <button key={label} type="button" onClick={() => set(!value)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-sm font-medium ${value ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${value ? 'bg-green-600 border-green-600' : 'border-gray-300 dark:border-gray-600'}`}>
                  {value && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Product Images</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all group"
            >
              <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2 group-hover:text-green-500 transition-colors" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — multiple allowed</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)} />

            {uploadingImages && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                Uploading images...
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((url, i) => (
                  <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">MAIN</span>
                    )}
                    <button type="button" onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-green-700 hover:bg-green-600 disabled:opacity-70 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <>{isNew ? <Plus className="w-4 h-4" /> : <Check className="w-4 h-4" />} {isNew ? 'Add Product' : 'Save Changes'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────

function DeleteConfirm({ product, onCancel, onConfirm }: { product: Product; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-7 border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white text-center">Delete Product?</h3>
        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          &ldquo;{product.name}&rdquo; will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  // Product modal state
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Product search/filter
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (!prof || prof.role !== 'admin') { router.push('/'); return; }

      const [{ data: ord }, { data: prod }, { data: cust }, { data: cats }] = await Promise.all([
        supabase.from('orders').select('id, order_number, status, total, created_at, customer_name, customer_phone, delivery_region').order('created_at', { ascending: false }).limit(50),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email, phone, created_at').order('created_at', { ascending: false }).limit(50),
        supabase.from('categories').select('id, name, slug').order('name'),
      ]);

      setOrders((ord as any) || []);
      setProducts((prod as any) || []);
      setCustomers((cust as any) || []);
      setCategories((cats as any) || []);
      const revenue = (ord || []).filter((o: any) => o.status !== 'cancelled').reduce((s: number, o: any) => s + o.total, 0);
      setStats({ revenue, orders: (ord || []).length, products: (prod || []).length, customers: (cust || []).length });
      setLoading(false);
    })();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
  };

  const toggleProductActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    setProducts(products.map((p) => p.id === id ? { ...p, is_active: !current } : p));
  };

  const handleProductSaved = (saved: Product) => {
    if (editProduct) {
      setProducts(products.map((p) => p.id === saved.id ? saved : p));
    } else {
      setProducts([saved, ...products]);
      setStats((s) => ({ ...s, products: s.products + 1 }));
    }
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await supabase.from('products').delete().eq('id', deleteTarget.id);
    setProducts(products.filter((p) => p.id !== deleteTarget.id));
    setStats((s) => ({ ...s, products: s.products - 1 }));
    setDeleteTarget(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'products', label: `Products (${stats.products})`, icon: ShoppingBag },
    { id: 'orders', label: `Orders (${stats.orders})`, icon: Package },
    { id: 'customers', label: `Customers (${stats.customers})`, icon: Users },
  ];

  return (
    <>
      {(showForm || editProduct) && (
        <ProductForm
          initial={editProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSaved={handleProductSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 pb-32 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
          <Link href="/" className="text-sm text-green-700 dark:text-green-400 hover:underline flex items-center gap-1">
            Back to Store <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Revenue', value: formatPriceRaw(stats.revenue), icon: TrendingUp, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
            { label: 'Total Orders', value: stats.orders.toString(), icon: Package, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { label: 'Products', value: stats.products.toString(), icon: ShoppingBag, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
            { label: 'Customers', value: stats.customers.toString(), icon: Users, color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm' : 'text-gray-500'}`}>
                <Icon className="w-4 h-4" />{t.label}
              </button>
            );
          })}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{o.order_number}</p>
                      <p className="text-xs text-gray-400">{o.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || ''}`}>{o.status}</span>
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">{formatPriceRaw(o.total)}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-gray-400">No orders yet</p>}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Low Stock Products</h3>
              <div className="space-y-3">
                {products.filter((p) => p.stock_quantity < 10).slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1 flex-1 mr-2">{p.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock_quantity === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} left`}
                    </span>
                  </div>
                ))}
                {products.filter((p) => p.stock_quantity < 10).length === 0 && (
                  <p className="text-sm text-gray-400">All products are well stocked</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                onClick={() => { setEditProduct(null); setShowForm(true); }}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Product</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Price</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Stock</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Tags</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Active</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const cat = categories.find((c) => c.id === p.category_id);
                      return (
                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {p.images[0] ? (
                                <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-700 flex-shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                  <ImageIcon className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[180px]">{p.name}</p>
                                {cat && <p className="text-xs text-gray-400">{cat.name}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatPriceRaw(p.sale_price ?? p.price)}</p>
                            {p.sale_price != null && <p className="text-xs text-gray-400 line-through">{formatPriceRaw(p.price)}</p>}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`text-xs font-semibold ${p.stock_quantity === 0 ? 'text-red-600' : p.stock_quantity < 10 ? 'text-amber-600' : 'text-green-700 dark:text-green-400'}`}>
                              {p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} units`}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex gap-1 flex-wrap">
                              {p.is_featured && <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">FEATURED</span>}
                              {p.is_best_seller && <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">BESTSELLER</span>}
                              {p.flash_sale_end && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 px-1.5 py-0.5 rounded font-bold">FLASH SALE</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleProductActive(p.id, p.is_active)}
                              className={`relative w-10 h-5 rounded-full transition-colors ${p.is_active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${p.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setEditProduct(p); setShowForm(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(p)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center">
                          <ShoppingBag className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">{search ? 'No products match your search' : 'No products yet'}</p>
                          {!search && (
                            <button onClick={() => { setEditProduct(null); setShowForm(true); }}
                              className="mt-4 inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                              <Plus className="w-4 h-4" /> Add your first product
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Order</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Region</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Total</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{o.order_number}</p>
                        <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{o.customer_name}</p>
                        <p className="text-xs text-gray-400">{o.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{o.delivery_region}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">{formatPriceRaw(o.total)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 cursor-pointer">
                          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Customers ── */}
        {tab === 'customers' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.full_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{c.phone || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-12 text-center text-sm text-gray-400">No customers yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
