import { MapPin, Clock, Shield, RefreshCw } from 'lucide-react';

const features = [
  { icon: MapPin, title: 'Nationwide Delivery', description: 'We deliver to all 7 regions of The Gambia including Greater Banjul, Kanifing, West Coast, North Bank, Lower River, Central River, and Upper River.', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: Clock, title: 'Fast & Reliable', description: 'Same-day delivery in Banjul & Serrekunda area. 1-3 days for West Coast. Upcountry delivery within 5-10 days.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: Shield, title: 'Secure Payments', description: 'We support Wave, QMoney, AfriMoney, Yonna, Visa, Mastercard, and Cash on Delivery. Pay however you prefer.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: RefreshCw, title: 'Easy Returns', description: 'Not satisfied? We offer hassle-free returns within 7 days of delivery. Customer satisfaction is our priority.', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

export default function DeliveryInfo() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Why Shop with Afobang?</h2>
          <p className="text-gray-500 dark:text-gray-400">Quality products, trusted delivery, and excellent customer service</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {features.map((f) => (
            <div key={f.title} className={`${f.bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800`}>
              <div className={`${f.color} mb-3`}><f.icon className="w-8 h-8" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 bg-green-700 text-white"><h3 className="font-bold text-lg">Delivery Regions & Fees</h3></div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { region: 'Greater Banjul Area', fee: 'D 75', time: '1-2 days', areas: 'Banjul, Bakau, Fajara, Kotu' },
              { region: 'Kanifing Municipal', fee: 'D 75', time: '1-2 days', areas: 'Serrekunda, Kanifing, Bundung' },
              { region: 'West Coast Region', fee: 'D 100', time: '2-3 days', areas: 'Brikama, Sukuta, Brufut' },
              { region: 'North Bank Region', fee: 'D 200', time: '3-5 days', areas: 'Barra, Farafenni, Kerewan' },
              { region: 'Lower River Region', fee: 'D 350', time: '5-7 days', areas: 'Mansa Konko, Soma' },
              { region: 'Central River Region', fee: 'D 450', time: '5-7 days', areas: 'Janjanbureh, Bansang' },
              { region: 'Upper River Region', fee: 'D 550', time: '7-10 days', areas: 'Basse Santa Su' },
            ].map((row) => (
              <div key={row.region} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 text-sm">
                <div className="font-medium text-gray-800 dark:text-gray-200">{row.region}</div>
                <div className="text-green-700 dark:text-green-400 font-semibold">{row.fee}</div>
                <div className="text-gray-600 dark:text-gray-400">{row.time}</div>
                <div className="text-gray-500 hidden md:block">{row.areas}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
