import Link from 'next/link';

const categories = [
  { name: "Men's Fashion", slug: 'men-fashion', emoji: '👔', bg: 'from-blue-600 to-blue-800' },
  { name: "Women's Fashion", slug: 'women-fashion', emoji: '👗', bg: 'from-rose-500 to-rose-700' },
  { name: 'Shoes', slug: 'shoes', emoji: '👟', bg: 'from-amber-500 to-amber-700' },
  { name: 'Bags', slug: 'bags', emoji: '👜', bg: 'from-violet-600 to-violet-800' },
  { name: 'Watches', slug: 'watches', emoji: '⌚', bg: 'from-gray-600 to-gray-800' },
  { name: 'Electronics', slug: 'electronics', emoji: '📱', bg: 'from-cyan-600 to-cyan-800' },
  { name: 'Beauty', slug: 'beauty-products', emoji: '💄', bg: 'from-pink-500 to-pink-700' },
  { name: 'Home', slug: 'home-essentials', emoji: '🏠', bg: 'from-teal-600 to-teal-800' },
  { name: 'Kids', slug: 'kids-fashion', emoji: '🧒', bg: 'from-orange-500 to-orange-700' },
  { name: 'Traditional', slug: 'traditional-wear', emoji: '🌍', bg: 'from-green-700 to-green-900' },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find exactly what you're looking for</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline">View All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="flex-shrink-0 w-28 md:w-auto group">
              <div className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-4 md:p-5 text-white text-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}>
                <div className="text-3xl md:text-4xl mb-2">{cat.emoji}</div>
                <p className="font-semibold text-xs md:text-sm leading-tight">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
