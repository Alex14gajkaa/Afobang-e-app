import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Fatou Ceesay', location: 'Serrekunda', rating: 5, text: 'Afobang changed how I shop! I ordered a beautiful abaya from Dubai and it arrived in 2 days. The quality is amazing and the price was very fair. No more going to the market under the hot sun!', avatar: 'FC', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { name: 'Ousman Jallow', location: 'Brikama', rating: 5, text: 'I bought the wireless earbuds and they are excellent. Delivery to Brikama was fast and the packaging was good. I paid with Wave which was very easy. Will definitely order again!', avatar: 'OJ', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Amie Touray', location: 'Bakau', rating: 5, text: 'The Turkish kaftan set I ordered for Tobaski was absolutely beautiful. My friends kept asking where I bought it. The customer service is also very helpful. Afobang is the best!', avatar: 'AT', bg: 'bg-green-100 dark:bg-green-900/30' },
  { name: 'Lamin Sanyang', location: 'Kanifing', rating: 4, text: 'Great platform for Gambians. I bought a Smart TV and it works perfectly. Cash on delivery option was very convenient. The delivery person was polite and on time.', avatar: 'LS', bg: 'bg-amber-100 dark:bg-amber-900/30' },
];

export default function Testimonials() {
  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">What Our Customers Say</h2>
          <p className="text-gray-500 dark:text-gray-400">Thousands of satisfied shoppers across The Gambia</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />)}</div>
            <span className="font-bold text-gray-800 dark:text-gray-200">4.9</span>
            <span className="text-gray-400 text-sm">(2,400+ reviews)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-800 flex flex-col">
              <Quote className="w-6 h-6 text-green-200 dark:text-green-800 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{t.text}</p>
              <div className="flex mt-4 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200 dark:text-gray-700'}`} />)}</div>
              <div className="flex items-center gap-3 mt-2">
                <div className={`w-9 h-9 rounded-full ${t.bg} flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300`}>{t.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}, The Gambia</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
