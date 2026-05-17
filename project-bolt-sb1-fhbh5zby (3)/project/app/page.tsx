import { supabase } from '@/lib/supabase';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FlashSaleSection from '@/components/FlashSaleSection';
import ProductGrid from '@/components/ProductGrid';
import PromoBanner from '@/components/PromoBanner';
import HowItWorks from '@/components/HowItWorks';
import DeliveryInfo from '@/components/DeliveryInfo';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';

async function getData() {
  const now = new Date().toISOString();
  const [{ data: flash }, { data: featured }, { data: bestSellers }, { data: newArrivals }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').not('flash_sale_end', 'is', null).gt('flash_sale_end', now).eq('is_active', true).limit(5),
    supabase.from('products').select('*, categories(*)').eq('is_featured', true).eq('is_active', true).limit(8),
    supabase.from('products').select('*, categories(*)').eq('is_best_seller', true).eq('is_active', true).limit(8),
    supabase.from('products').select('*, categories(*)').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
  ]);
  return { flash: flash || [], featured: featured || [], bestSellers: bestSellers || [], newArrivals: newArrivals || [] };
}

export default async function HomePage() {
  const { flash, featured, bestSellers, newArrivals } = await getData();
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <FlashSaleSection products={flash as any} />
      <ProductGrid title="Featured Products" subtitle="Handpicked quality products just for you" products={featured as any} viewAllHref="/products?filter=featured" />
      <PromoBanner />
      <ProductGrid title="Best Sellers" subtitle="Most loved by our customers" products={bestSellers as any} viewAllHref="/products?filter=best-sellers" />
      <HowItWorks />
      <ProductGrid title="New Arrivals" subtitle="Fresh imports just landed" products={newArrivals as any} viewAllHref="/products?sort=newest" />
      <DeliveryInfo />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
