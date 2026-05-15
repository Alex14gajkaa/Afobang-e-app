import { Smartphone, Package, Truck, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Smartphone, title: 'Browse & Order', description: 'Shop from your phone anytime, anywhere. Browse thousands of products and place your order in minutes.', step: '01', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { icon: Package, title: 'We Process', description: 'Your order is confirmed and prepared with care. We pack everything safely to ensure it arrives in perfect condition.', step: '02', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { icon: Truck, title: 'Fast Delivery', description: 'We deliver to all 7 regions of The Gambia. From Banjul to Basse, we bring your order straight to you.', step: '03', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { icon: CheckCircle, title: 'Enjoy & Review', description: "Receive your order, verify it's perfect, then pay. Cash on Delivery available! Share your review to help others.", step: '04', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">How Afobang Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Shopping has never been easier. No more walking under the hot sun — order from home and get it delivered.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              <div className={`w-16 h-16 mx-auto rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="absolute top-0 left-1/2 ml-6 -translate-x-[50%] w-6 h-6 bg-green-700 text-white text-[10px] font-black rounded-full flex items-center justify-center">{step.step}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
