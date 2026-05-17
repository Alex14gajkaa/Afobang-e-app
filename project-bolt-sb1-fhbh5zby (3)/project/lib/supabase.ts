import { createClient as createBrowserClient } from '@/lib/supabase/client';

export const supabase = createBrowserClient();

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  flash_sale_end: string | null;
  currency: string;
  origin_country: string;
  brand: string;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  is_best_seller: boolean;
  images: string[];
  tags: string[];
  weight: number;
  variants: any[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: string;
  loyalty_points: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  region: string;
  area: string;
  street: string;
  is_default: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  coupon_code: string;
  delivery_address: any;
  delivery_region: string;
  estimated_delivery: string;
  tracking_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  variant: any;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
};
