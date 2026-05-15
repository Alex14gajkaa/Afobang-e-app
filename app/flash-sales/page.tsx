import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Zap } from 'lucide-react';

export default async function FlashSalesPage() {
  const now = new Date().toISOString();
  const [{ data: flash }, { data: sale }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').not('flash_sale_end', 'is', null).gt('flash_sale_end', now).eq('is_active', true),
    supabase.from('products').select('*, categories(*)').not('sale_price', 'is', null).eq('is_active', true).limit(24),
  ]);
  const flashIds = new Set((flash || []).map((p) => p.id));
  const all = [...(flash || []), ...(sale || []).filter((p) => !flashIds.has(p.id))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 mb-8 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-7 h-7 fill-white" />
          <h1 className="text-2xl md:text-3xl font-black">Flash Sales</h1>
          <Zap className="w-7 h-7 fill-white" />
        </div>
        <p className="text-red-100">Limited time deals — grab them before they're gone!</p>
      </div>
      {all.length === 0 ? (
        <div className="text-center py-16"><p className="text-gray-500 dark:text-gray-400">No flash sales right now. Check back soon!</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {all.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      )}
    </div>
  );
}
