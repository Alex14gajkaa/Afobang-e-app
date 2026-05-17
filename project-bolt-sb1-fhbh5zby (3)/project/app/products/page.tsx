import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

const CATS = [
  { name: 'All', slug: '' }, { name: "Men's Fashion", slug: 'men-fashion' },
  { name: "Women's Fashion", slug: 'women-fashion' }, { name: 'Shoes', slug: 'shoes' },
  { name: 'Bags', slug: 'bags' }, { name: 'Watches', slug: 'watches' },
  { name: 'Electronics', slug: 'electronics' }, { name: 'Beauty', slug: 'beauty-products' },
  { name: 'Home', slug: 'home-essentials' }, { name: 'Kids', slug: 'kids-fashion' },
  { name: 'Traditional', slug: 'traditional-wear' },
];

type SP = { category?: string; search?: string; sort?: string; filter?: string };

async function getProducts(params: SP) {
  let query = supabase.from('products').select('*, categories(*)').eq('is_active', true);
  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).maybeSingle();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (params.search) query = query.ilike('name', `%${params.search}%`);
  if (params.filter === 'featured') query = query.eq('is_featured', true);
  if (params.filter === 'best-sellers') query = query.eq('is_best_seller', true);
  query = params.sort === 'price-asc' ? query.order('price', { ascending: true }) : params.sort === 'price-desc' ? query.order('price', { ascending: false }) : params.sort === 'rating' ? query.order('rating', { ascending: false }) : query.order('created_at', { ascending: false });
  const { data } = await query.limit(48);
  return data || [];
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const products = await getProducts(searchParams);
  const activeCategory = searchParams.category || '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {searchParams.search ? `Results for "${searchParams.search}"` : searchParams.category ? CATS.find((c) => c.slug === activeCategory)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {CATS.map((cat) => (
          <a key={cat.slug} href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.slug ? 'bg-green-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
            {cat.name}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-end mb-4 gap-2">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Sort:</span>
        {[{ label: 'Newest', value: 'newest' }, { label: 'Price: Low', value: 'price-asc' }, { label: 'Price: High', value: 'price-desc' }, { label: 'Rating', value: 'rating' }].map((opt) => (
          <a key={opt.value} href={`/products?${new URLSearchParams({ ...(searchParams.category ? { category: searchParams.category } : {}), ...(searchParams.search ? { search: searchParams.search } : {}), sort: opt.value }).toString()}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${(searchParams.sort || 'newest') === opt.value ? 'bg-green-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
            {opt.label}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No products found</h3>
          <a href="/products" className="inline-block mt-4 bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">Browse All Products</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      )}
    </div>
  );
}
