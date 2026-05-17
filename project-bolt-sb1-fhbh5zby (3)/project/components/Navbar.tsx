'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, Package } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const NAV_CATS = [
  { name: 'All Products', slug: '' },
  { name: "Men's", slug: 'men-fashion' },
  { name: "Women's", slug: 'women-fashion' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Beauty', slug: 'beauty-products' },
  { name: 'Home', slug: 'home-essentials' },
  { name: 'Traditional', slug: 'traditional-wear' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dark, setDark] = useState(false);
  const { items } = useCartStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const router = useRouter();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('afobang-theme');
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('afobang-theme', next ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(''); }
  };

  return (
    <>
      {/* Top promo bar */}
      <div className="bg-green-800 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span>Free delivery on orders over D500 across The Gambia</span>
          <span className="text-gold-300 font-semibold">Welcome code: <strong>WELCOME20</strong> — 20% off your first order</span>
        </div>
      </div>

      <nav className={cn('sticky top-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800', scrolled && 'shadow-md')}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img src="/IMG_6445.PNG" alt="Afobang" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/wishlist" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
              <Link href="/account" className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                <User className="w-5 h-5" /><span className="text-sm font-medium">Account</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Category row */}
          <div className="hidden md:flex items-center gap-0 pb-2 overflow-x-auto scrollbar-hide">
            {NAV_CATS.map((cat) => (
              <Link key={cat.slug} href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
                className="flex-shrink-0 text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
            <Link href="/flash-sales" className="flex-shrink-0 text-sm font-semibold text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
              Flash Sales 🔥
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..."
              className="w-full pl-4 pr-12 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500 transition-colors" />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-700 text-white p-2 rounded-lg">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-right overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-white flex items-center gap-3 border-b border-gray-100">
              <img src="/IMG_6445.PNG" alt="Afobang" className="h-10 w-auto object-contain" />
            </div>
            <div className="p-4 space-y-1">
              {[
                { href: '/', label: 'Home' }, { href: '/products', label: 'All Products' },
                { href: '/flash-sales', label: 'Flash Sales 🔥', cls: 'text-red-600' },
              ].map(({ href, label, cls }) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                  className={cn('flex items-center px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-gray-800 dark:text-gray-200', cls)}>
                  {label}
                </Link>
              ))}
              <div className="pt-2 pb-1"><p className="text-xs font-semibold text-gray-400 px-3 uppercase tracking-wider mb-2">Categories</p>
                {[
                  { name: "Men's Fashion", slug: 'men-fashion' }, { name: "Women's Fashion", slug: 'women-fashion' },
                  { name: 'Shoes', slug: 'shoes' }, { name: 'Electronics', slug: 'electronics' },
                  { name: 'Beauty', slug: 'beauty-products' }, { name: 'Home', slug: 'home-essentials' },
                  { name: 'Kids', slug: 'kids-fashion' }, { name: 'Traditional', slug: 'traditional-wear' },
                ].map((cat) => (
                  <Link key={cat.slug} href={`/products?category=${cat.slug}`} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-gray-700 dark:text-gray-300 text-sm">
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                {[
                  { href: '/account', label: 'My Account', icon: User },
                  { href: '/orders', label: 'My Orders', icon: Package },
                  { href: '/wishlist', label: 'Wishlist', icon: Heart },
                ].map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-gray-800 dark:text-gray-200">
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around px-2 py-2">
          <Link href="/" className="bottom-nav-item text-gray-600 dark:text-gray-400 hover:text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/products" className="bottom-nav-item text-gray-600 dark:text-gray-400 hover:text-green-700">
            <Search className="w-5 h-5" /><span className="text-[10px]">Browse</span>
          </Link>
          <Link href="/cart" className="bottom-nav-item text-gray-600 dark:text-gray-400 hover:text-green-700 relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && <span className="absolute top-1 right-2 bg-green-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{totalItems > 9 ? '9+' : totalItems}</span>}
            <span className="text-[10px]">Cart</span>
          </Link>
          <Link href="/wishlist" className="bottom-nav-item text-gray-600 dark:text-gray-400 hover:text-green-700">
            <Heart className="w-5 h-5" /><span className="text-[10px]">Wishlist</span>
          </Link>
          <Link href="/account" className="bottom-nav-item text-gray-600 dark:text-gray-400 hover:text-green-700">
            <User className="w-5 h-5" /><span className="text-[10px]">Account</span>
          </Link>
        </div>
      </div>
    </>
  );
}
